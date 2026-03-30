import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, FlatList, Dimensions, ActivityIndicator, RefreshControl, Alert, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import PlusIcon from "@/assets/icons/plus-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import SearchIcon from "@/assets/icons/search-icon";
import { useInventoryStore } from "../zustand/inventory-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  inventory: { en: 'Inventory', fr: 'Inventaire', ar: 'المخزون' },
  products_count: { en: '{count} {unit} listed', fr: '{count} {unit} répertoriés', ar: 'تم إدراج {count} {unit}' },
  product_singular: { en: 'Product', fr: 'Produit', ar: 'منتج' },
  product_plural: { en: 'Products', fr: 'Produits', ar: 'منتجات' },
  my_orders: { en: 'My Orders', fr: 'Mes commandes', ar: 'طلباتي' },
  search_products: { en: 'Search products...', fr: 'Rechercher des produits...', ar: 'بحث عن منتجات...' },
  all_tab: { en: 'All', fr: 'Tout', ar: 'الكل' },
  active_tab: { en: 'Active', fr: 'Actif', ar: 'نشط' },
  oos_tab: { en: 'Out of Stock', fr: 'En rupture', ar: 'نفد المخزون' },
  draft_tab: { en: 'Draft', fr: 'Brouillon', ar: 'مسودة' },
  edit: { en: 'Edit', fr: 'Modifier', ar: 'تعديل' },
  hide: { en: 'Hide', fr: 'Masquer', ar: 'إخفاء' },
  show: { en: 'Show', fr: 'Afficher', ar: 'عرض' },
  delete: { en: 'Delete', fr: 'Supprimer', ar: 'حذف' },
  in_stock: { en: 'in stock', fr: 'en stock', ar: 'في المخزون' },
  delete_product: { en: 'Delete Product', fr: 'Supprimer le produit', ar: 'حذف المنتج' },
  confirm_delete_msg: { en: 'Are you sure you want to delete this product?', fr: 'Êtes-vous sûr de vouloir supprimer ce produit ?', ar: 'هل أنت متأكد أنك تريد حذف هذا المنتج؟' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  success: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  product_removed: { en: 'Product removed from inventory', fr: 'Produit retiré de l\'inventaire', ar: 'تم إزالة المنتج من المخزون' },
  error: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  failed_delete: { en: 'Failed to delete product', fr: 'Échec de la suppression du produit', ar: 'فشل في حذف المنتج' },
  failed_visibility: { en: 'Failed to update product visibility', fr: 'Échec de la mise à jour de la visibilité', ar: 'فشل في تحديث ظهور المنتج' },
  no_products_found: { en: 'No products found', fr: 'Aucun produit trouvé', ar: 'لم يتم العثور على منتجات' },
  adjusting_filters_msg: { en: 'Try adjusting your filters or search query', fr: 'Essayez d\'ajuster vos filtres ou votre recherche', ar: 'حاول ضبط الفلاتر أو استعلام البحث' },
};

export default function BusinessM1Navigation() {
  const navigation = useNavigation<any>();
  const auth = useAuthStore((s) => s.auth);
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
  const {
    products,
    total,
    nextPage,
    isLoading,
    isRefreshing,
    isLoadingMore,
    fetchInventory,
    updateProductLocal,
    deleteProductLocal
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const isFirstRender = useRef(true);

  const TABS = [
    { key: 'All', label: t('all_tab') },
    { key: 'Active', label: t('active_tab') },
    { key: 'Out of Stock', label: t('oos_tab') },
    { key: 'Draft', label: t('draft_tab') }
  ];

  const handleFetchInventory = useCallback(async (page: number = 1, shouldRefresh: boolean = false) => {
    await fetchInventory(page, shouldRefresh, searchQuery, activeTab);
  }, [searchQuery, activeTab, fetchInventory]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) return;
      handleFetchInventory(1, true);
    }, [handleFetchInventory])
  );

  useEffect(() => {
    // We can just rely on useFocusEffect for the initial load and tab changes if we change how handleFetchInventory is used
    handleFetchInventory(1);
  }, [activeTab]);

  // Debounced search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      handleFetchInventory(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    handleFetchInventory(1, true);
  };

  const onLoadMore = () => {
    if (nextPage && !isLoadingMore) {
      handleFetchInventory(nextPage);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      t('delete_product'),
      t('confirm_delete_msg'),
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('delete'),
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(buildRoute(ApiRoutes.products.destroy, { id: productId }));
              deleteProductLocal(productId);
              Alert.alert(t('success'), t('product_removed'));
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert(t('error'), t('failed_delete'));
            }
          }
        }
      ]
    );
  };

  const handleToggleVisibility = async (product: any) => {
    try {
      const newStatus = !product.isAvailable;
      await api.put(buildRoute(ApiRoutes.products.update, { id: product.id }), {
        is_available: newStatus
      });
      updateProductLocal(product.id, { isAvailable: newStatus });
    } catch (error) {
      console.error("Error toggling product visibility:", error);
      Alert.alert(t('error'), t('failed_visibility'));
    }
  };

  const getProductStatus = (item: any) => {
    if (!item.isAvailable) return { label: t('draft_tab'), bg: '#F1F5F9', color: '#64748B' };
    if (item.stock === 0) return { label: t('oos_tab'), bg: '#FEF2F2', color: '#EF4444' };
    return { label: t('active_tab'), bg: '#F0FDF4', color: '#16A34A' };
  };

  const renderProductItem = ({ item }: { item: any }) => {
    const status = getProductStatus(item);
    return (
      <View style={{
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        alignItems: language === 'ar' ? 'flex-end' : 'flex-start'
      }}>
        <TouchableOpacity
          style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 16, alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, { product: item })}
          activeOpacity={0.7}
        >
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            backgroundColor: '#F8F9FB',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F1F5F9',
            overflow: 'hidden',
          }}>
            {item.images && item.images.length > 0 ? (
              <Image
                source={{ uri: item.images[0].url }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            ) : (
              <Text style={{ fontSize: 36 }}>📦</Text>
            )}
          </View>

          <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <View style={{
              flexDirection: language === 'ar' ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
              width: '100%'
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}>{item.category?.code || t('product_singular')}</Text>
              <View style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
                { backgroundColor: status.bg }
              ]}>
                <Text style={[
                  { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
                  { color: status.color }
                ]}>{status.label}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>

            <View style={{
              flexDirection: language === 'ar' ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              width: '100%'
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#8B5CF6' }}>{item.price.toLocaleString()} DA</Text>
              <Text style={[{ fontSize: 12, fontWeight: '600', color: '#64748B' }, item.stock === 0 && { color: '#EF4444' }]}>
                {item.stock} {t('in_stock')}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 8, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); navigation.navigate(Routes.EditCreateProductScreen, { product: item }); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>{t('edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 8, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); handleToggleVisibility(item); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>{item.isAvailable ? t('hide') : t('show')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FEF2F2', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{
        flexDirection: language === 'ar' ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: paddingHorizontal,
        paddingTop: 8,
        marginBottom: 4,
        gap: 4,
      }}>
        <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>{t('inventory')}</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>
            {t('products_count', { count: total?.toString() || '0', unit: total === 1 ? t('product_singular') : t('product_plural') })}
          </Text>
        </View>
        {
          auth?.businessProfile?.category?.code === 'laboratory'
          &&
          <TouchableOpacity
            style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: '#F0F7FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', gap: 6 }}
            onPress={() => navigation.navigate(Routes.LabOrdersScreen)}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#137FEC' }}>🛍️ {t('my_orders')}</Text>
          </TouchableOpacity>
        }
      </View>

      <View style={{
        flexDirection: language === 'ar' ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingHorizontal: paddingHorizontal,
        marginBottom: 8,
        gap: 12,
      }}>
        <View style={{
          flex: 1, gap: 8,
          flexDirection: language === 'ar' ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: '#FFF',
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 48,
          borderWidth: 1,
          borderColor: '#E2E8F0',
        }}>
          <SearchIcon />
          <TextInput
            style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111', textAlign: language === 'ar' ? 'right' : 'left' }}
            placeholder={t('search_products')}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#8B5CF6',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen)}
        >
          <PlusIcon color="#F5F5F5" />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[ { gap: 10, paddingBottom: 4, paddingHorizontal: paddingHorizontal }, language === 'ar' && { flexDirection: 'row-reverse' } ]}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
                activeTab === tab.key && { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[{ fontSize: 14, fontWeight: '700', color: '#6B7280' }, activeTab === tab.key && { color: '#FFF' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: paddingHorizontal, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color="#8B5CF6" style={{ paddingVertical: 20 }} /> : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>{t('no_products_found')}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>{t('adjusting_filters_msg')}</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}