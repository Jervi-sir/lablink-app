import React, { useState, useEffect, useCallback } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, LayoutAnimation, UIManager, ActivityIndicator, Alert, RefreshControl, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import StatsIcon from "@/assets/icons/stats-icon";
import InfoIcon from "@/assets/icons/info-icon";
import SpecsIcon from "@/assets/icons/specs-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useInventoryStore } from "../zustand/inventory-store";
import { useLanguageStore } from "@/zustand/language-store";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const translations = {
  inventory_detail: { en: 'Inventory Detail', fr: 'Détails de l\'inventaire', ar: 'تفاصيل المخزون' },
  edit: { en: 'Edit', fr: 'Modifier', ar: 'تعديل' },
  performance_stats: { en: 'Performance Stats', fr: 'Stats de performance', ar: 'إحصائيات الأداء' },
  specifications: { en: 'Specifications', fr: 'Spécifications', ar: 'المواصفات' },
  description: { en: 'Description', fr: 'Description', ar: 'الوصف' },
  total_revenue: { en: 'Total Revenue', fr: 'Revenu total', ar: 'إجمالي الإيرادات' },
  page_views: { en: 'Page Views', fr: 'Vues de la page', ar: 'مشاهدات الصفحة' },
  sales_count: { en: 'Sales Count', fr: 'Nombre de ventes', ar: 'عدد المبيعات' },
  conversions: { en: 'Conversions', fr: 'Conversions', ar: 'التحويلات' },
  error: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  failed_load_details: { en: 'Failed to load product details', fr: 'Échec du chargement des détails du produit', ar: 'فشل في تحميل تفاصيل المنتج' },
  success: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  status_updated: { en: 'Product marked as {status}', fr: 'Produit marqué comme {status}', ar: 'تم تحديد المنتج كـ {status}' },
  available: { en: 'available', fr: 'disponible', ar: 'متاح' },
  private: { en: 'private', fr: 'privé', ar: 'خاص' },
  failed_update_status: { en: 'Failed to update product status', fr: 'Échec de la mise à jour du statut du produit', ar: 'فشل في تحديث حالة المنتج' },
  delete_product: { en: 'Delete Product', fr: 'Supprimer le produit', ar: 'حذف المنتج' },
  delete_confirm: { en: 'Are you sure you want to delete this product? This action cannot be undone.', fr: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.', ar: 'هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  delete: { en: 'Delete', fr: 'Supprimer', ar: 'حذف' },
  failed_delete_product: { en: 'Failed to delete product', fr: 'Échec de la suppression du produit', ar: 'فشل في حذف المنتج' },
  sku: { en: 'SKU', fr: 'SKU (UGS)', ar: 'وحدة حفظ المخزون' },
  no_description: { en: 'No description available.', fr: 'Aucune description disponible.', ar: 'لا يوجد وصف متاح.' },
  active: { en: 'Active', fr: 'Actif', ar: 'نشط' },
  draft: { en: 'Draft', fr: 'Brouillon', ar: 'مسودة' },
  unit_available: { en: '{count} units available', fr: '{count} unités disponibles', ar: '{count} وحدة متاحة' },
  no_images: { en: 'No images uploaded', fr: 'Aucune image téléchargée', ar: 'لم يتم تحميل صور' },
  delete_listing: { en: 'Delete Listing', fr: 'Supprimer l\'annonce', ar: 'حذف الإعلان' },
  promote_listing: { en: 'Promote Listing', fr: 'Promouvoir l\'annonce', ar: 'ترويج الإعلان' },
  mark_private: { en: 'Mark Private', fr: 'Marquer comme privé', ar: 'تحديد كخاص' },
  make_public: { en: 'Make Public', fr: 'Rendre public', ar: 'جعل عام' },
};

export default function BusinessProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations, params?: Record<string, string>) => {
    let text = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };
  const initialProduct = route.params?.product;
  const { updateProductLocal, deleteProductLocal } = useInventoryStore();

  const [product, setProduct] = useState<any>(initialProduct);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>('stats');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProductDetail = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.products.show, { id: product.id }));
      if (response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      Alert.alert(t('error'), t('failed_load_details'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [product?.id]);

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProductDetail(false);
  };

  const toggleAvailability = async () => {
    setIsActionLoading(true);
    try {
      const response: any = await api.put(buildRoute(ApiRoutes.products.update, { id: product.id }), {
        is_available: !product.isAvailable
      });
      if (response.data) {
        const newStatus = !product.isAvailable;
        setProduct({ ...product, isAvailable: newStatus });
        updateProductLocal(product.id, { isAvailable: newStatus });
        Alert.alert(t('success'), t('status_updated', { status: newStatus ? t('available') : t('private') }));
      }
    } catch (error) {
      Alert.alert(t('error'), t('failed_update_status'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteProduct = () => {
    Alert.alert(
      t('delete_product'),
      t('delete_confirm'),
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('delete'),
          style: "destructive",
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await api.delete(buildRoute(ApiRoutes.products.destroy, { id: product.id }));
              deleteProductLocal(product.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert(t('error'), t('failed_delete_product'));
            } finally {
              setIsActionLoading(false);
            }
          }
        }
      ]
    );
  };

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'stats':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{t('total_revenue')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0 DA</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{t('page_views')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{Math.floor(Math.random() * 500)}</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{t('sales_count')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0</Text>
              </View>
              <View style={{ width: '48%', backgroundColor: '#F8F9FB', padding: 12, borderRadius: 12, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{t('conversions')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>0%</Text>
              </View>
            </View>
          </View>
        );
      case 'specs':
        const specs = product.specifications || {};
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            {Object.keys(specs).length > 0 ? (
              Object.entries(specs).map(([key, val]: [string, any]) => (
                <View key={key} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                  <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>{key}</Text>
                  <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{val}</Text>
                </View>
              ))
            ) : (
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>{t('sku')}</Text>
                <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{product.sku || 'N/A'}</Text>
              </View>
            )}
          </View>
        );
      case 'desc':
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>
              {product.description || t('no_description')}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (isLoading && !product) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  const statusText = product.isAvailable ? t('active') : t('draft');
  const priceText = `${product.price.toLocaleString()} DA`;

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Premium Header */}
      <View style={{
        height: 60,
        flexDirection: language === 'ar' ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: paddingHorizontal,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{t('inventory_detail')}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product })}
        >
          <Text style={{ color: '#8B5CF6', fontWeight: '800', fontSize: 13 }}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: paddingHorizontal }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Product Image Stage */}
        <View style={{ width: width - 40, height: width - 40, backgroundColor: '#FFF', borderRadius: 32, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 15, elevation: 3, alignSelf: 'center', marginTop: 20 }}>
          {product.images && product.images.length > 0 ? (
            <>
              <FlatList
                data={product.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e: any) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }: { item: any }) => (
                  <ScrollView
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ width: width - 40, height: width - 40 }}
                  >
                    <Image
                      source={{ uri: item.url }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </ScrollView>
                )}
                keyExtractor={(_: any, index: number) => index.toString()}
              />
              {product.images.length > 1 && (
                <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 6, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                  {product.images.map((_: any, idx: number) => (
                    <View
                      key={idx}
                      style={[
                        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
                        idx === activeImageIndex && { width: 16, backgroundColor: '#8B5CF6' }
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 80 }}>{product.category?.code === 'Reagent' ? '🧪' : '🔬'}</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginTop: 12 }}>{t('no_images')}</Text>
            </View>
          )}
        </View>

        {/* Vital Info */}
        <View style={{ paddingVertical: 20, gap: 8, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase' }}>{product.category?.code || 'Equipment'}</Text>
            <View style={[
              { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
              product.isAvailable ? { backgroundColor: '#F0FDF4' } : { backgroundColor: '#FFFBEB' }
            ]}>
              <Text style={[{ fontSize: 10, fontWeight: '800' }, product.isAvailable ? { color: '#16A34A' } : { color: '#D97706' }]}>{statusText}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32, textAlign: language === 'ar' ? 'right' : 'left' }}>{product.name}</Text>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, width: '100%' }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{priceText}</Text>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('unit_available', { count: product.stock })}</Text>
          </View>
        </View>

        {/* Management Sections */}
        <View style={{ gap: 12, marginBottom: 32 }}>
          {[
            { id: 'stats', title: t('performance_stats'), icon: <StatsIcon /> },
            { id: 'specs', title: t('specifications'), icon: <SpecsIcon /> },
            { id: 'desc', title: t('description'), icon: <InfoIcon /> },
          ].map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[
                { backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' },
                isExpanded && { borderColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }
              ]}>
                <TouchableOpacity
                  style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16 }}>{section.icon}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#334155' }}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] },
                    isExpanded && { transform: [{ rotate: '45deg' }], borderColor: '#8B5CF6' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>

        {/* Delete Action */}
        <View style={{}}>
          <TouchableOpacity
            style={{ backgroundColor: '#FEF2F2', height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' }}
            onPress={deleteProduct}
          >
            <Text style={{ color: '#EF4444', fontWeight: '800' }}>{t('delete_listing')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Business Actions */}
      <View style={{ paddingHorizontal: paddingHorizontal, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingVertical: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ flex: 2, backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{t('promote_listing')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#F1F5F9', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
          onPress={toggleAvailability}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <ActivityIndicator color="#475569" />
          ) : (
            <Text style={{ color: '#475569', fontSize: 14, fontWeight: '700' }}>{product.isAvailable ? t('mark_private') : t('make_public')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

