import React, { useState, useEffect, useCallback } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, LayoutAnimation, UIManager, ActivityIndicator, RefreshControl, Share, Image, FlatList, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import ShareIcon from "@/assets/icons/share-icon";
import SaveIcon from "@/assets/icons/save-icon";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useLanguageStore } from "@/zustand/language-store";
import { useConversationStore } from "@/zustand/conversation-store";
import MessageIcon from "@/assets/icons/message-icon"; // Assuming this exists or I'll use a placeholder

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const translations = {
  specifications: { en: 'Specifications', fr: 'Spécifications', ar: 'المواصفات' },
  description: { en: 'Description', fr: 'Description', ar: 'الوصف' },
  safety_data: { en: 'Safety Data (MSDS)', fr: 'Données de sécurité (MSDS)', ar: 'بيانات السلامة (MSDS)' },
  reviews: { en: 'Reviews', fr: 'Avis', ar: 'المراجعات' },
  added_to_request: { en: 'Added to request', fr: 'Ajouté à la demande', ar: 'تم الإضافة إلى الطلب' },
  now_in_request: { en: '{name} is now in your request for {lab}.', fr: '{name} est maintenant dans votre demande pour {lab}.', ar: '{name} موجود الآن في طلبك لـ {lab}.' },
  discover_more: { en: 'Discover more from lab', fr: 'Découvrir plus du laboratoire', ar: 'اكتشف المزيد من المختبر' },
  start_new_request: { en: 'Start New Request', fr: 'Démarrer une nouvelle demande', ar: 'بدء طلب جديد' },
  request_exists_desc: { en: 'A request for {name} doesn\'t exist yet. Would you like to create one for this item?', fr: 'Une demande pour {name} n\'existe pas encore. Souhaitez-vous en créer une pour cet article ?', ar: 'لا يوجد طلب لـ {name} بعد. هل ترغب في إنشاء واحد لهذا العنصر؟' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  create: { en: 'Create', fr: 'Créer', ar: 'إنشاء' },
  loading_product: { en: 'Loading product...', fr: 'Chargement du produit...', ar: 'جاري تحميل المنتج...' },
  product_not_found: { en: 'Product not found', fr: 'Produit non trouvé', ar: 'المنتج غير موجود' },
  product_not_found_desc: { en: 'The product you\'re looking for doesn\'t exist or has been removed.', fr: 'Le produit que vous recherchez n\'existe pas ou a été supprimé.', ar: 'المنتج الذي تبحث عنه غير موجود أو تمت إزالته.' },
  go_back: { en: 'Go Back', fr: 'Retourner', ar: 'العودة' },
  share_title: { en: 'Check out {name} on LabLink!', fr: 'Découvrez {name} sur LabLink !', ar: 'تحقق من {name} على LabLink!' },
  share_message: { en: 'I found {name} from {lab} on LabLink! Check it out!', fr: 'J\'ai trouvé {name} de {lab} sur LabLink ! Regardez ça !', ar: 'وجدت {name} من {lab} على LabLink! تحقق من ذلك!' },
  in_stock: { en: 'IN STOCK', fr: 'EN STOCK', ar: 'متوفر' },
  out_of_stock: { en: 'OUT OF STOCK', fr: 'RUPTURE DE STOCK', ar: 'غير متوفر' },
  sku: { en: 'SKU', fr: 'SKU', ar: 'رمز التخزين' },
  vat_applicable: { en: '+ VAT applicable', fr: '+ TVA applicable', ar: '+ ضريبة القيمة المضافة' },
  location_na: { en: 'Location N/A', fr: 'Emplacement N/A', ar: 'الموقع غير متوفر' },
  spec_lab: { en: 'Specialized Laboratory', fr: 'Laboratoire spécialisé', ar: 'مختبر متخصص' },
  cert_supplier: { en: 'Certified Supplier', fr: 'Fournisseur certifié', ar: 'مورد معتمد' },
  quick_summary: { en: 'Quick Summary', fr: 'Résumé rapide', ar: 'ملخص سريع' },
  unit_label: { en: 'Unit: {unit}', fr: 'Unité : {unit}', ar: 'الوحدة: {unit}' },
  safety_label: { en: 'Safety: L{level}', fr: 'Sécurité : L{level}', ar: 'السلامة: L{level}' },
  update_request: { en: 'Update Request', fr: 'Mettre à jour la demande', ar: 'تحديث الطلب' },
  add_to_request: { en: 'Add to Request', fr: 'Ajouter à la demande', ar: 'إضافة إلى الطلب' },
  unavailable: { en: 'Unavailable', fr: 'Indisponible', ar: 'غير متوفر' },
  order_now: { en: 'Order Now', fr: 'Commander maintenant', ar: 'اطلب الآن' },
  send_proposal: { en: 'Send Proposal', fr: 'Envoyer la proposition', ar: 'إرسال مقترح' },
  no_specs: { en: 'No specifications available.', fr: 'Aucune spécification disponible.', ar: 'لا توجد مواصفات متاحة.' },
  no_desc: { en: 'No description available.', fr: 'Aucune description disponible.', ar: 'لا يوجد وصف متاح.' },
  mat_safety_sheet: { en: 'Material Safety Data Sheet', fr: 'Fiche de données de sécurité', ar: 'صحيفة بيانات سلامة المواد' },
  pdf_doc: { en: 'PDF Document', fr: 'Document PDF', ar: 'مستند PDF' },
  doc_manuals: { en: 'Documentation & Manuals', fr: 'Documentation et manuels', ar: 'التوثيق والكتيبات' },
  no_safety_data: { en: 'No safety data available.', fr: 'Aucune donnée de sécurité disponible.', ar: 'لا توجد بيانات سلامة متاحة.' },
  no_reviews: { en: 'No reviews yet. Be the first to review!', fr: 'Aucun avis pour le moment. Soyez le premier à donner votre avis !', ar: 'لا توجد مراجعات بعد. كن أول من يقيم!' },
  review: { en: 'review', fr: 'avis', ar: 'مراجعة' },
  reviews_plural: { en: 'reviews', fr: 'avis', ar: 'مراجعات' },
  anonymous: { en: 'Anonymous', fr: 'Anonyme', ar: 'مجهول' },
  no_image: { en: 'No image available', fr: 'Aucune image disponible', ar: 'لا توجد صورة متاحة' },
};

export default function ProductScreen() {
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

  const SECTIONS = [
    { id: '1', title: t('specifications'), icon: 'specs' },
    { id: '2', title: t('description'), icon: 'desc' },
    { id: '3', title: t('safety_data'), icon: 'msds' },
    { id: '4', title: t('reviews'), icon: 'reviews' },
  ];
  const { product: navProduct, labCartMode = false, lab: routeLab } = route.params || {};

  const [product, setProduct] = useState<any>(navProduct || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const carts = useLabCartStore((state) => state.carts);
  const upsertItem = useLabCartStore((state) => state.upsertItem);
  const { auth, authType } = useAuthStore();
  const { createConversation, setActiveConversation } = useConversationStore();

  const isBusiness = authType === 'business';
  const isLaboratory = auth?.businessProfile?.category?.code === 'laboratory';
  const showOrderNow = isBusiness && isLaboratory;

  const productId = navProduct?.id;
  const currentLab = routeLab || product?.business || navProduct?.business;

  // Check if the owner of this product is a laboratory
  const isLaboratoryOwner = product?.business?.category?.code === 'laboratory' ||
    navProduct?.business?.category?.code === 'laboratory' ||
    currentLab?.category?.code === 'laboratory';

  // Lab cart mode is enforced for laboratory products, or if explicitly requested
  const effectiveLabCartMode = isLaboratoryOwner || (labCartMode && product?.business?.category?.code !== 'supplier');

  const currentCart = carts[Number(currentLab?.id)];
  const cartEntry = currentCart?.items.find((item) => item.productId === Number(productId));

  const labName = product?.business?.name || 'Unknown Lab';
  const productPrice = typeof product?.price === 'number' ? `${product.price.toLocaleString()} DA` : product?.price || '0 DA';
  const productPriceValue = typeof product?.price === 'number' ? product.price : parseFloat(String(product?.price || '0').replace(/[^0-9.]/g, '')) || 0;
  const isInStock = product?.isAvailable && product?.stock > 0;

  const saveToLabCart = useCallback(() => {
    if (!currentLab || !productId || !product) {
      return;
    }

    const targetBusiness = {
      id: Number(currentLab.id),
      name: currentLab.name || labName,
      logo: currentLab.logo || null,
    };

    const commit = () => {
      upsertItem(targetBusiness, {
        productId: Number(productId),
        businessId: Number(targetBusiness.id),
        name: product.name,
        productType: product.productType || product.product_type || 'product',
        unit: product.unit || null,
        price: productPriceValue,
        quantity,
        imageUrl: product.images?.find((image: any) => image.isMain)?.url || product.images?.[0]?.url || null,
      });

      Alert.alert(
        t('added_to_request'),
        t('now_in_request', { name: product.name, lab: targetBusiness.name }),
        [
          { text: 'OK', style: 'default' },
          {
            text: t('discover_more'),
            onPress: () => navigation.navigate(Routes.BusinessScreen, {
              labId: targetBusiness.id,
              labName: targetBusiness.name,
              lab: currentLab
            })
          }
        ]
      );
    };

    if (!currentCart) {
      Alert.alert(
        t('start_new_request'),
        t('request_exists_desc', { name: targetBusiness.name }),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('create'),
            onPress: commit
          }
        ]
      );
      return;
    }

    commit();
  }, [currentCart, currentLab, labName, product, productId, productPriceValue, quantity, upsertItem, navigation]);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const response = await api.get(buildRoute(ApiRoutes.products.show, { id: productId }));
      if (response && response.data) {
        setProduct(response.data);
        setIsSaved(response.data.isSaved || false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProduct();
    setRefreshing(false);
  }, [fetchProduct]);

  const toggleSave = useCallback(async () => {
    if (!productId || savingToggle) return;
    try {
      setSavingToggle(true);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));
      if (response) {
        setIsSaved(response.isSaved);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSavingToggle(false);
    }
  }, [productId, savingToggle]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (effectiveLabCartMode && cartEntry?.quantity) {
      setQuantity(cartEntry.quantity);
    }
  }, [cartEntry?.quantity, effectiveLabCartMode]);

  const toggleSection = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: 12, color: i <= rating ? '#F59E0B' : '#D1D5DB' }}>★</Text>
      );
    }
    return stars;
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case '1':
        // Specifications
        const specs = product?.specifications;
        if (specs && typeof specs === 'object' && Object.keys(specs).length > 0) {
          return (
            <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
              {Object.entries(specs).map(([key, value], index) => (
                <View key={index} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                  <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>{key}</Text>
                  <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{String(value)}</Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('no_specs')}</Text>
          </View>
        );

      case '2':
        // Description
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>
              {product?.description || t('no_desc')}
            </Text>
          </View>
        );

      case '3':
        // Safety Data
        if (product?.msdsPath || product?.documentations) {
          return (
            <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
              {product?.msdsPath && (
                <TouchableOpacity style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#EF4444' }}>⚠</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('mat_safety_sheet')}</Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{t('pdf_doc')}</Text>
                  </View>
                </TouchableOpacity>
              )}
              {product?.documentations && (
                <TouchableOpacity style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#3B82F6' }}>📄</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('doc_manuals')}</Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{t('pdf_doc')}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('no_safety_data')}</Text>
          </View>
        );

      case '4':
        // Reviews
        const reviews = product?.reviews || [];
        if (reviews.length === 0) {
          return (
            <View style={{ padding: 16, paddingTop: 0 }}>
              <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('no_reviews')}</Text>
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            {/* Average Rating Summary */}
            {product?.avgRating && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#111' }}>{product.avgRating}</Text>
                <View style={{ gap: 2, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>{renderStars(Math.round(product.avgRating))}</View>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{product.reviewCount} {product.reviewCount !== 1 ? t('reviews_plural') : t('review')}</Text>
                </View>
              </View>
            )}
            {/* Individual Reviews */}
            {reviews.map((review: any) => (
              <View key={review.id} style={{ gap: 8, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
                    {review.user?.studentProfile?.fullName || review.user?.email || t('anonymous')}
                  </Text>
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>{renderStars(review.rating)}</View>
                </View>
                <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{review.comment}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>{t('loading_product')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!product) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8, textAlign: 'center' }}>{t('product_not_found')}</Text>
          <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500', textAlign: 'center' }}>{t('product_not_found_desc')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: '#137FEC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }


  const handleShare = async () => {
    try {
      if (!product) return;

      const shareOptions = {
        title: t('share_title', { name: product.name }),
        message: t('share_message', { name: product.name, lab: labName }),
      };

      const result = await Share.share(shareOptions);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      {/* Top Navigation - Overlay */}
      <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 50 : 10, left: 0, right: 0, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56, zIndex: 50 }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}
          onPress={() => navigation.goBack()}
        >
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12 }}>
          {/* Save Button */}
          <TouchableOpacity
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}
            onPress={toggleSave}
            disabled={savingToggle}
          >
            {savingToggle ? (
              <ActivityIndicator size="small" color="#137FEC" />
            ) : (
              <SaveIcon isActive={isSaved} />
            )}
          </TouchableOpacity>
          {/* Message Button */}
          {auth?.id !== currentLab?.user_id && (
            <TouchableOpacity
              style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}
              onPress={async () => {
                if (!currentLab?.user_id) return;
                try {
                  const conv = await createConversation(currentLab.user_id);
                  setActiveConversation(conv);
                  navigation.navigate('ShowConversation', { id: conv.id });
                } catch (err) {
                  Alert.alert("Error", "Could not start conversation");
                }
              }}
            >
               <MessageIcon size={24} color="#111" />
            </TouchableOpacity>
          )}

          {/* Share Button */}
          <TouchableOpacity
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}
            onPress={handleShare}
          >
            <ShareIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#137FEC" />
        }
      >
        {/* Product Image Card */}
        <View style={{ width: width, aspectRatio: 1.1, backgroundColor: '#FFF', marginTop: 0, overflow: 'hidden' }}>
          {product.images && product.images.length > 0 ? (
            <>
              <FlatList
                data={product.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e: any) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }: { item: any }) => (
                  <ScrollView
                    maximumZoomScale={3}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ width: width, height: '100%' }}
                  >
                    <View style={{ width: width, height: '100%', backgroundColor: '#F9FAFB' }}>
                      <Image
                        source={{ uri: item.url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    </View>
                  </ScrollView>
                )}
                keyExtractor={(_: any, index: number) => index.toString()}
              />
              {product.images.length > 1 && (
                <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', gap: 6, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                  {product.images.map((_: any, idx: number) => (
                    <View
                      key={idx}
                      style={[
                        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
                        idx === activeImageIndex && { width: 16, backgroundColor: '#137FEC' }
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={{ flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ gap: 8, alignItems: 'center' }}>
                <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>🔬</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '600' }}>{t('no_image')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={{ padding: 24, gap: 8 }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.BusinessScreen, {
                labId: currentLab?.id,
                labName: currentLab?.name || labName,
                lab: currentLab
              })}
              style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC', letterSpacing: 0.5 }}>{labName}</Text>
              <Text style={{ fontSize: 12, color: '#137FEC', transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>→</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: isInStock ? '#E9F7EF' : '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: isInStock ? '#27AE60' : '#EF4444' }}>
                {isInStock ? t('in_stock') : t('out_of_stock')}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32, textAlign: language === 'ar' ? 'right' : 'left' }}>{product.name}</Text>
          {product.sku && <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('sku')}: #{product.sku}</Text>}

          <View style={{ marginTop: 12, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{productPrice}</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>{t('vat_applicable')}</Text>
          </View>

          {/* Rating badge */}
          {product.avgRating && (
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>{renderStars(Math.round(product.avgRating))}</View>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{product.avgRating} ({product.reviewCount})</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.BusinessScreen, {
              labId: currentLab?.id,
              labName: currentLab?.name || labName,
              lab: currentLab
            })}
            style={{
              marginTop: 12,
              padding: 16,
              backgroundColor: '#F8FAFC',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              flexDirection: language === 'ar' ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.02,
              shadowRadius: 4,
              elevation: 2
            }}
          >
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', flex: 1, gap: 16 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: currentLab?.logo || 'https://via.placeholder.com/60' }}
                  style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9' }}
                  resizeMode="contain"
                />
                <View style={{ position: 'absolute', bottom: -2, right: language === 'ar' ? undefined : -2, left: language === 'ar' ? -2 : undefined, width: 18, height: 18, borderRadius: 9, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                   <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' }} />
                </View>
              </View>

              <View style={{ flex: 1, gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{labName}</Text>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14 }}>📍</Text>
                  <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>
                    {currentLab?.wilaya?.[language] || currentLab?.wilaya?.name || t('location_na')}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#137FEC', fontWeight: '700', marginTop: 2 }}>
                  {isLaboratoryOwner ? t('spec_lab') : t('cert_supplier')}
                </Text>
              </View>
            </View>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
               <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '800', transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Summary */}
        {product.summary && (
          <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 8, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>{t('quick_summary')}</Text>
            <Text style={{ fontSize: 15, color: '#5D6575', lineHeight: 22, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>
              {product.summary}
            </Text>
          </View>
        )}

        {/* Offer Type & Unit */}
        {(product.offerType || product.unit) && (
          <View style={{ paddingHorizontal: 24, paddingBottom: 20, flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12 }}>
            {product.offerType && (
              <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#3B82F6', textTransform: 'capitalize' }}>{product.offerType}</Text>
              </View>
            )}
            {product.unit && (
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#22C55E' }}>{t('unit_label', { unit: product.unit })}</Text>
              </View>
            )}
            {product.safetyLevel > 0 && (
              <View style={{ backgroundColor: product.safetyLevel >= 3 ? '#FEF2F2' : '#FFFBEB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: product.safetyLevel >= 3 ? '#EF4444' : '#F59E0B' }}>{t('safety_label', { level: String(product.safetyLevel) })}</Text>
              </View>
            )}
          </View>
        )}

        {/* Accordion Sections */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {SECTIONS.map((section) => {
            const isExpanded = expandedId === section.id;
            return (
              <View key={section.id} style={[
                { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 12 },
                isExpanded && { borderColor: '#E2E8F0', backgroundColor: '#FFF', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }
              ]}>
                <TouchableOpacity
                  style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={[{ fontSize: 16, fontWeight: '700', color: '#334155' }, isExpanded && { color: '#111' }]}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] },
                    isExpanded && { transform: [{ rotate: language === 'ar' ? '225deg' : '45deg' }], borderColor: '#137FEC' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 20
      }}>
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, alignItems: 'center' }}>
          {/* Professional Quantity Selector */}
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 54 }}>
            <TouchableOpacity style={{ width: 38, height: 54, justifyContent: 'center', alignItems: 'center' }} onPress={decrementQty}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#64748B' }}>−</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#0F172A', width: 28, textAlign: 'center' }}>{quantity}</Text>
            <TouchableOpacity style={{ width: 38, height: 54, justifyContent: 'center', alignItems: 'center' }} onPress={incrementQty}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#64748B' }}>+</Text>
            </TouchableOpacity>
          </View>

          {effectiveLabCartMode ? (
            <View style={{ flex: 1, flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 10 }}>
              <TouchableOpacity
                style={{
                  width: 54,
                  height: 54,
                  backgroundColor: '#EFF6FF',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#DBEAFE'
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(Routes.LabEstimationScreen, { businessId: currentLab?.id, lab: currentLab })}
              >
                <Text style={{ fontSize: 20 }}>📋</Text>
                {cartEntry && (
                  <View style={{ position: 'absolute', top: -5, right: language === 'ar' ? undefined : -5, left: language === 'ar' ? -5 : undefined, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' }}>
                    <Text style={{ fontSize: 10, fontWeight: '900', color: '#FFF' }}>{cartEntry.quantity}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 54,
                  backgroundColor: isInStock ? '#137FEC' : '#94A3B8',
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.8}
                disabled={!isInStock}
                onPress={saveToLabCart}
              >
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#FFF', letterSpacing: -0.2 }}>
                  {isInStock ? (cartEntry ? t('update_request') : t('add_to_request')) : t('unavailable')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
                height: 54,
                backgroundColor: isInStock ? '#137FEC' : '#94A3B8',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.8}
              disabled={!isInStock}
              onPress={() => navigation.navigate(Routes.CheckoutScreen, { product, quantity })}
            >
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>
                {isInStock
                  ? (showOrderNow ? t('order_now') : t('send_proposal'))
                  : t('unavailable')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
