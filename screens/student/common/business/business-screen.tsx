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

const { width } = Dimensions.get('window');

export default function BusinessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
      name: business.name || labName || 'Laboratory',
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
        'Cart does not exist',
        `A cart for ${targetBusiness.name} does not exist yet. Please press Create to continue.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create',
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
  }, [business, businessId, currentCart, isSupplier, labName, upsertItem]);

  const displayName = business?.name || labName || 'Laboratory';

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>Loading laboratory...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!business) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 }}>Laboratory not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: '#137FEC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const renderHeader = () => (
    <View style={{ padding: 20 }}>
      {/* Bio & Intro Section */}
      <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
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
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111' }}>{business.name}</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {business.isFeatured && (
                <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>✓ VERIFIED</Text>
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
        <View style={{ flexDirection: 'row', marginTop: 20, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{business.productCount || 0}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Products</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{followerCount}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Followers</Text>
          </View>
          <View style={{ width: 1, height: 16, backgroundColor: '#CBD5E1' }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{business.wilaya?.name || '—'}</Text>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 }}>Location</Text>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={{ marginTop: 20, backgroundColor: '#0F172A', borderRadius: 22, padding: 18 }}>
        <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>Cart Mode</Text>
        <Text style={{ marginTop: 8, fontSize: 18, fontWeight: '900', color: '#FFF' }}>Build one estimation request for this lab.</Text>
        <Text style={{ marginTop: 6, fontSize: 13, lineHeight: 20, color: '#CBD5E1', fontWeight: '600' }}>
          Add products or services you are interested in, review the cart, then send the request directly to {displayName}.
        </Text>
      </View>

      {business.description && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>About Facility</Text>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', marginTop: 8 }}>
            {business.description}
          </Text>
        </View>
      )}

      {/* Certificate */}
      {business.certificateUrl && (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 24 }}>📜</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>Operating License {business.nif ? `#${business.nif}` : ''}</Text>
            <Text style={{ fontSize: 11, color: '#64748B' }}>Verified Certificate</Text>
          </View>
        </View>
      )}

      {/* Connectivity */}
      {(business.address || (business.contacts && business.contacts.length > 0)) && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Connectivity</Text>
          <View style={{ marginTop: 12, gap: 12 }}>
            {business.address && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 16 }}>📍</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Location</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E293B' }}>{business.address}</Text>
                </View>
              </View>
            )}
            {business.contacts && business.contacts.map((contact: any, idx: number) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 16 }}>
                    {contact.platform?.code === 'phone' || contact.platform?.code === 'mobile' ? '📞' :
                      contact.platform?.code === 'whatsapp' ? '💬' :
                        contact.platform?.code === 'email' ? '✉️' :
                          contact.platform?.code === 'website' ? '🌐' : '🔗'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{contact.platform?.code || 'Contact'}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1E293B' }}>{contact.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CTA Area */}
      <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
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
            <Text style={{ fontSize: 14, fontWeight: '700', color: isFollowed ? '#137FEC' : '#1E293B' }}>
              {isFollowed ? 'Following' : 'Follow'}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, height: 50, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, { businessId: business.id, businessName: business.name })}
        >
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Products Header */}
      <View style={{ marginTop: 24, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Available Products & Services</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>{products.length} items</Text>
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard1
      product={{
        ...item,
        lab: item.business?.name || business.name || 'Lab',
        price: typeof item.price === 'number' ? `${item.price.toLocaleString()} DA` : item.price || '0 DA',
      }}
      onPress={() => navigation.navigate(Routes.ProductScreen, {
        product: item,
        labCartMode: !isSupplier,
        lab: business,
      })}
      onToggleSave={() => toggleSaveProduct(item.id.toString())}
      actionLabel={isSupplier ? null : (cartItems.some((cartItem: any) => cartItem.productId === Number(item.id) && cartItem.businessId === Number(businessId)) ? 'Added' : 'Add')}
      onActionPress={() => addProductToCart(item)}
      actionDisabled={!isSupplier && cartItems.some((cartItem: any) => cartItem.productId === Number(item.id) && cartItem.businessId === Number(businessId))}
      isSaving={savingProductId === item.id.toString()}
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Top Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }} numberOfLines={1}>{displayName}</Text>
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
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
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
              <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>No products available yet.</Text>
            </View>
          ) : null
        }
      />

      {isCartForThisLab && cartItems.length > 0 ? (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18, backgroundColor: '#0F172A', borderRadius: 22, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>Active Lab Cart</Text>
              <Text style={{ marginTop: 4, fontSize: 16, fontWeight: '900', color: '#FFF' }}>{cartItemCount} selected item{cartItemCount !== 1 ? 's' : ''}</Text>
              <Text style={{ marginTop: 4, fontSize: 13, color: '#CBD5E1', fontWeight: '600' }}>Estimated total {cartEstimatedTotal.toLocaleString()} DA</Text>
            </View>
            <TouchableOpacity
              style={{ height: 48, paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.navigate(Routes.LabEstimationScreen, { businessId })}
            >
              <Text style={{ fontSize: 14, fontWeight: '900', color: '#FFF' }}>Finalize</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </ScreenWrapper>
  );
}
