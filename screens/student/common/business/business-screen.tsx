import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, ActivityIndicator, RefreshControl, Image, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { ProductCard1 } from "@/components/cards/product-card-1";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import { useLanguageStore } from "@/zustand/language-store";
import { useConversationStore } from "@/zustand/conversation-store";
import { useAuthStore } from "@/zustand/auth-store";

const { width } = Dimensions.get('window');

const translations = {
  loading_lab: { en: 'Loading laboratory...', fr: 'Chargement du laboratoire...', ar: 'جاري تحميل المختبر...' },
  lab_not_found: { en: 'Laboratory not found', fr: 'Laboratoire non trouvé', ar: 'المختبر غير موجود' },
  go_back: { en: 'Go Back', fr: 'Retourner', ar: 'العودة' },
  verified: { en: '✓ VERIFIED', fr: '✓ VÉRIFIÉ', ar: '✓ تم التحقق' },
  products: { en: 'Products', fr: 'Produits', ar: 'المنتجات' },
  followers: { en: 'Followers', fr: 'Abonnés', ar: 'المتابعين' },
  location: { en: 'Location', fr: 'Emplacement', ar: 'الموقع' },
  cart_mode: { en: 'Cart Mode', fr: 'Mode Panier', ar: 'وضع السلة' },
  build_estimation: { en: 'Build one estimation request for this lab.', fr: "Créez une demande d'estimation pour ce laboratoire.", ar: 'أنشئ طلب تقدير لهذا المختبر.' },
  cart_desc: { en: 'Add products or services you are interested in, review the cart, then send the request directly to', fr: 'Ajoutez les produits ou services qui vous intéressent, vérifiez le panier, puis envoyez la demande directement à', ar: 'أضف المنتجات أو الخدمات التي تهمك، راجع السلة، ثم أرسل الطلب مباشرة إلى' },
  about_facility: { en: 'About Facility', fr: "À propos de l'établissement", ar: 'حول المنشأة' },
  operating_license: { en: 'Operating License', fr: "Licence d'exploitation", ar: 'رخصة التشغيل' },
  verified_certificate: { en: 'Verified Certificate', fr: 'Certificat vérifié', ar: 'شهادة معتمدة' },
  connectivity: { en: 'Connectivity', fr: 'Connectivité', ar: 'الاتصال' },
  following: { en: 'Following', fr: 'Abonné', ar: 'متابع' },
  follow: { en: 'Follow', fr: "S'abonner", ar: 'متابعة' },
  message: { en: 'Message', fr: 'Message', ar: 'مراسلة' },
  available_products: { en: 'Available Products & Services', fr: 'Produits et services disponibles', ar: 'المنتجات والخدمات المتاحة' },
  items: { en: 'items', fr: 'articles', ar: 'عناصر' },
  added: { en: 'Added', fr: 'Ajouté', ar: 'تم الإضافة' },
  add: { en: 'Add', fr: 'Ajouter', ar: 'إضافة' },
  no_products: { en: 'No products available yet.', fr: 'Aucun produit disponible pour le moment.', ar: 'لا توجد منتجات متاحة بعد.' },
  active_lab_cart: { en: 'Active Lab Cart', fr: 'Panier de laboratoire actif', ar: 'سلة المختبر النشطة' },
  selected_item: { en: 'selected item', fr: 'article sélectionné', ar: 'عنصر مختار' },
  selected_items: { en: 'selected items', fr: 'articles sélectionnés', ar: 'عناصر مختارة' },
  estimated_total: { en: 'Estimated total', fr: 'Total estimé', ar: 'الإجمالي التقديري' },
  finalize: { en: 'Finalize', fr: 'Finaliser', ar: 'إنهاء' },
  cart_exists_title: { en: 'Cart does not exist', fr: 'Le panier n\'existe pas', ar: 'السلة غير موجودة' },
  cart_exists_desc: { en: 'A cart for {name} does not exist yet. Please press Create to continue.', fr: 'Un panier pour {name} n\'existe pas encore. Veuillez appuyer sur Créer pour continuer.', ar: 'سلة {name} غير موجودة بعد. يرجى الضغط على إنشاء للمتابعة.' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  create: { en: 'Create', fr: 'Créer', ar: 'إنشاء' },
  unknown_lab: { en: 'Laboratory', fr: 'Laboratoire', ar: 'مختبر' },
};

export default function BusinessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];
  const { lab, labId, labName } = route.params || {};

  // Resolve the business ID from various navigation params
  const businessId = labId || lab?.id;

  const [business, setBusiness] = useState<any>(lab || null);
  const [products, setProducts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [togglingFollow, setTogglingFollow] = useState(false);
  const [togglingSave, setTogglingSave] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const { createConversation, setActiveConversation } = useConversationStore();
  const { auth } = useAuthStore();

  const carts = useLabCartStore((state) => state.carts);
  const upsertItem = useLabCartStore((state) => state.upsertItem);
  const clearCart = useLabCartStore((state) => state.clearCart);

  const currentCart = carts[Number(businessId)];
  const cartItems = Array.isArray(currentCart?.items) ? currentCart.items : [];

  const isSupplier = business?.category?.code === 'supplier' || business?.business_category_code === 'supplier';
  const isCartForThisLab = !!currentCart && !isSupplier;
  const cartItemCount = isCartForThisLab ? cartItems.reduce((total: number, item: any) => total + (item.quantity || 0), 0) : 0;
  const cartEstimatedTotal = isCartForThisLab ? cartItems.reduce((total: number, item: any) => total + (item.price || 0) * (item.quantity || 0), 0) : 0;

  const fetchBusiness = useCallback(async () => {
    if (!businessId) return;
    try {
      const response = await api.get(buildRoute(ApiRoutes.businesses.show, { id: businessId }));
      if (response) {
        setBusiness(response.data);
        setIsFollowed(response.data?.isFollowed || false);
        setIsSaved(response.data?.isSaved || false);
        setFollowerCount(response.data?.followerCount || 0);
        setProducts(response.products || []);
        setNextPage(response.products_next_page || null);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const fetchMoreProducts = useCallback(async () => {
    if (!businessId || !nextPage || loadingMore) return;
    try {
      setLoadingMore(true);
      const response = await api.get(buildRoute(ApiRoutes.businesses.products, { id: businessId }), {
        params: { page: nextPage, per_page: 10 }
      });
      if (response && response.data) {
        setProducts(prev => [...prev, ...response.data]);
        setNextPage(response.next_page || null);
      }
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [businessId, nextPage, loadingMore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBusiness();
    setRefreshing(false);
  }, [fetchBusiness]);

  const toggleFollow = useCallback(async () => {
    if (!businessId || togglingFollow) return;
    try {
      setTogglingFollow(true);
      const response = await api.post(buildRoute(ApiRoutes.businesses.toggleFollow, { id: businessId }));
      if (response) {
        setIsFollowed(response.isFollowed);
        setFollowerCount(response.followerCount);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setTogglingFollow(false);
    }
  }, [businessId, togglingFollow]);

  const toggleSaveBusiness = useCallback(async () => {
    if (!businessId || togglingSave) return;
    try {
      setTogglingSave(true);
      const response = await api.post(buildRoute(ApiRoutes.businesses.toggleSave, { id: businessId }));
      if (response) {
        setIsSaved(response.isSaved);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setTogglingSave(false);
    }
  }, [businessId, togglingSave]);

  const toggleSaveProduct = useCallback(async (productId: string) => {
    if (savingProductId) return;
    try {
      setSavingProductId(productId);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));
      if (response) {
        setProducts(prev =>
          prev.map(p => p.id.toString() === productId ? { ...p, isSaved: response.isSaved } : p)
        );
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSavingProductId(null);
    }
  }, [savingProductId]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const addProductToCart = useCallback((item: any) => {
    if (!businessId || !business) {
      return;
    }

    const targetBusiness = {
      id: Number(businessId),
      name: business.name || labName || t('unknown_lab'),
      logo: business.logo || null,
    };

    const commit = () => {
      upsertItem(targetBusiness, {
        productId: Number(item.id),
        businessId: Number(businessId),
        name: item.name,
        productType: item.productType || item.product_type || 'product',
        unit: item.unit || null,
        price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0)) || 0,
        quantity: 1,
        imageUrl: item.images?.find((image: any) => image.isMain)?.url || item.images?.[0]?.url || null,
      });
    };

    if (!currentCart) {
      Alert.alert(
        t('cart_exists_title'),
        t('cart_exists_desc').replace('{name}', targetBusiness.name),
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

    if (isSupplier) {
      navigation.navigate(Routes.CheckoutScreen, { product: item, quantity: 1 });
      return;
    }

    commit();
  }, [business, businessId, currentCart, isSupplier, labName, upsertItem, t]);

  const displayName = business?.name || labName || t('unknown_lab');

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>{t('loading_lab')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!business) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 }}>{t('lab_not_found')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: '#137FEC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const renderHeader = () => (
    <View style={{ padding: 20 }}>
      {/* Bio & Intro Section */}
      <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', position: 'relative', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            {business?.logo ? (
              business.logo.startsWith('http') ? (
                <Image source={{ uri: business.logo }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              ) : (
                <Text style={{ fontSize: 36 }}>{business?.logo}</Text>
              )
            ) : (
              <View style={{ flex: 1, width: '100%', borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#CBD5E1' }}>{business?.name?.charAt(0)}</Text>
              </View>
            )}
            <View style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFF' }} />
          </View>
          <View style={{ flex: 1, gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111', textAlign: language === 'ar' ? 'right' : 'left' }}>{business.name}</Text>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8, flexWrap: 'wrap' }}>
              {business.isFeatured && (
                <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>{t('verified')}</Text>
                </View>
              )}
              {business.labCategory && (
                <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#3B82F6' }}>{business.labCategory.code}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', marginTop: 20, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{business.productCount || 0}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>{t('products')}</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{followerCount}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>{t('followers')}</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{business.wilaya?.name || '—'}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>{t('location')}</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={{ marginTop: 20, backgroundColor: '#0F172A', borderRadius: 22, padding: 18, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>{t('cart_mode')}</Text>
        <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '900', color: '#FFF', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('build_estimation')}</Text>
        <Text style={{ marginTop: 6, fontSize: 13, lineHeight: 20, color: '#CBD5E1', fontWeight: '600', textAlign: language === 'ar' ? 'right' : 'left' }}>
          {t('cart_desc')} {displayName}.
        </Text>
      </View>

      {business.description && (
        <View style={{ marginTop: 24, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>{t('about_facility')}</Text>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', marginTop: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>
            {business.description}
          </Text>
        </View>
      )}

      {/* Certificate */}
      {business.certificateUrl && (
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 24 }}>📜</Text></View>
          <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('operating_license')} {business.nif ? `#${business.nif}` : ''}</Text>
            <Text style={{ fontSize: 11, color: '#64748B' }}>{t('verified_certificate')}</Text>
          </View>
        </View>
      )}

      {/* Connectivity */}
      {(business.address || (business.contacts && business.contacts.length > 0)) && (
        <View style={{ marginTop: 24, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>{t('connectivity')}</Text>
          <View style={{ marginTop: 12, gap: 12, width: '100%' }}>
            {business.address && (
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 16 }}>📍</Text></View>
                <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('location')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{business.address}</Text>
                </View>
              </View>
            )}
            {business.contacts && business.contacts.map((contact: any, idx: number) => (
              <View key={idx} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16 }}>
                    {contact.platform?.code === 'phone' || contact.platform?.code === 'mobile' ? '📞' :
                      contact.platform?.code === 'whatsapp' ? '💬' :
                        contact.platform?.code === 'email' ? '✉️' :
                          contact.platform?.code === 'website' ? '🌐' : '🔗'}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{contact.platform?.code || 'Contact'}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{contact.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CTA Area */}
      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', marginTop: 24, gap: 12 }}>
        <TouchableOpacity
          onPress={toggleFollow}
          disabled={togglingFollow}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: isFollowed ? '#137FEC' : '#E2E8F0',
            backgroundColor: isFollowed ? '#EFF6FF' : '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {togglingFollow ? (
            <ActivityIndicator size="small" color="#137FEC" />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: '700', color: isFollowed ? '#137FEC' : '#1E293B', textAlign: 'center' }}>
              {isFollowed ? t('following') : t('follow')}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, height: 50, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
          onPress={async () => {
             const targetUserId = business?.user_id;
             if (!targetUserId) return;
             try {
                const conv = await createConversation(targetUserId);
                setActiveConversation(conv);
                navigation.navigate(Routes.ChatDetailScreen, { id: conv.id });
             } catch (err) {
                Alert.alert("Error", "Could not start conversation");
             }
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>{t('message')}</Text>
        </TouchableOpacity>
      </View>

      {/* Products Header */}
      <View style={{ marginTop: 24, marginBottom: 16 }}>
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('available_products')}</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>{products.length} {t('items')}</Text>
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard1
      product={{
        ...item,
        lab: item.business?.name || business.name || t('unknown_lab'),
        price: typeof item.price === 'number' ? `${item.price.toLocaleString()} DA` : item.price || '0 DA',
      }}
      onPress={() => navigation.navigate(Routes.ProductScreen, {
        product: item,
        labCartMode: !isSupplier,
        lab: business,
      })}
      onToggleSave={() => toggleSaveProduct(item.id.toString())}
      actionLabel={isSupplier ? undefined : (cartItems.some((cartItem: any) => cartItem.productId === Number(item.id) && cartItem.businessId === Number(businessId)) ? t('added') : t('add'))}
      onActionPress={() => addProductToCart(item)}
      actionDisabled={!isSupplier && cartItems.some((cartItem: any) => cartItem.productId === Number(item.id) && cartItem.businessId === Number(businessId))}
      isSaving={savingProductId === item.id.toString()}
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Header */}
      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', maxWidth: width - 150 }} numberOfLines={1}>{displayName}</Text>
        <TouchableOpacity
          onPress={toggleSaveBusiness}
          disabled={togglingSave}
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: isSaved ? '#FEF2F2' : '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
        >
          {togglingSave ? (
            <ActivityIndicator size="small" color="#137FEC" />
          ) : (
            <Text style={{ fontSize: 18 }}>{isSaved ? '❤️' : '🤍'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}
        contentContainerStyle={{ paddingBottom: isCartForThisLab ? 140 : 40 }}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreProducts}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#137FEC" />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#137FEC" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500', textAlign: 'center' }}>{t('no_products')}</Text>
            </View>
          ) : null
        }
      />

      {isCartForThisLab && cartItems.length > 0 ? (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18, backgroundColor: '#0F172A', borderRadius: 22, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 10 }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: language === 'ar' ? 0 : 12, paddingLeft: language === 'ar' ? 12 : 0, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>{t('active_lab_cart')}</Text>
              <Text style={{ marginTop: 4, fontSize: 16, fontWeight: '900', color: '#FFF' }}>{cartItemCount} {cartItemCount !== 1 ? t('selected_items') : t('selected_item')}</Text>
              <Text style={{ marginTop: 4, fontSize: 13, color: '#CBD5E1', fontWeight: '600' }}>{t('estimated_total')} {cartEstimatedTotal.toLocaleString()} DA</Text>
            </View>
            <TouchableOpacity
              style={{ height: 48, paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.navigate(Routes.LabEstimationScreen, { businessId })}
            >
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#FFF' }}>{t('finalize')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </ScreenWrapper>
  );
}
