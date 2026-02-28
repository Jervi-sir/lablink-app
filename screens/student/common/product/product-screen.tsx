import React, { useState, useEffect, useCallback } from "react";
import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, LayoutAnimation, UIManager, ActivityIndicator, RefreshControl, Share, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import ShareIcon from "@/assets/icons/share-icon";
import SaveIcon from "@/assets/icons/save-icon";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const SECTIONS = [
  { id: '1', title: 'Specifications', icon: 'specs' },
  { id: '2', title: 'Description', icon: 'desc' },
  { id: '3', title: 'Safety Data (MSDS)', icon: 'msds' },
  { id: '4', title: 'Reviews', icon: 'reviews' },
];

export default function ProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product: navProduct } = route.params || {};

  const [product, setProduct] = useState<any>(navProduct || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productId = navProduct?.id;

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
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                  <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>{key}</Text>
                  <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{String(value)}</Text>
                </View>
              ))}
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500' }}>No specifications available.</Text>
          </View>
        );

      case '2':
        // Description
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
              {product?.description || 'No description available.'}
            </Text>
          </View>
        );

      case '3':
        // Safety Data
        if (product?.msdsPath || product?.documentations) {
          return (
            <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
              {product?.msdsPath && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#EF4444' }}>⚠</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Material Safety Data Sheet</Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>PDF Document</Text>
                  </View>
                </TouchableOpacity>
              )}
              {product?.documentations && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#3B82F6' }}>📄</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Documentation & Manuals</Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>PDF Document</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0 }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500' }}>No safety data available.</Text>
          </View>
        );

      case '4':
        // Reviews
        const reviews = product?.reviews || [];
        if (reviews.length === 0) {
          return (
            <View style={{ padding: 16, paddingTop: 0 }}>
              <Text style={{ fontSize: 14, color: '#94A3B8', fontStyle: 'italic', fontWeight: '500' }}>No reviews yet. Be the first to review!</Text>
            </View>
          );
        }
        return (
          <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
            {/* Average Rating Summary */}
            {product?.avgRating && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#111' }}>{product.avgRating}</Text>
                <View style={{ gap: 2 }}>
                  <View style={{ flexDirection: 'row' }}>{renderStars(Math.round(product.avgRating))}</View>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>{product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''}</Text>
                </View>
              </View>
            )}
            {/* Individual Reviews */}
            {reviews.map((review: any) => (
              <View key={review.id} style={{ gap: 8, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
                    {review.user?.studentProfile?.fullName || review.user?.email || 'Anonymous'}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>{renderStars(review.rating)}</View>
                </View>
                <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18, fontWeight: '500' }}>{review.comment}</Text>
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
          <Text style={{ marginTop: 12, fontSize: 14, color: '#94A3B8', fontWeight: '500' }}>Loading product...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!product) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 }}>Product not found</Text>
          <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500', textAlign: 'center' }}>The product you're looking for doesn't exist or has been removed.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, backgroundColor: '#137FEC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const labName = product.business?.name || 'Unknown Lab';
  const productPrice = typeof product.price === 'number' ? `${product.price.toLocaleString()} DA` : product.price || '0 DA';
  const isInStock = product.isAvailable && product.stock > 0;

  const handleShare = async () => {
    try {
      if (!product) return;

      const shareOptions = {
        title: `Check out ${product.name} on LabLink!`,
        message: `I found ${product.name} from ${labName} on LabLink! Check it out!`,
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
      <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 50 : 10, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 56, zIndex: 50 }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 }}
          onPress={() => navigation.goBack()}
        >
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 12 }}>
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
                <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '600' }}>No image available</Text>
              </View>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={{ padding: 24, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC', letterSpacing: 0.5 }}>{labName}</Text>
            <View style={{ backgroundColor: isInStock ? '#E9F7EF' : '#FEF2F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: isInStock ? '#27AE60' : '#EF4444' }}>
                {isInStock ? 'IN STOCK' : 'OUT OF STOCK'}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111', lineHeight: 32 }}>{product.name}</Text>
          {product.sku && <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>SKU: #{product.sku}</Text>}

          <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#111' }}>{productPrice}</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>+ VAT applicable</Text>
          </View>

          {/* Rating badge */}
          {product.avgRating && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <View style={{ flexDirection: 'row' }}>{renderStars(Math.round(product.avgRating))}</View>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{product.avgRating} ({product.reviewCount})</Text>
            </View>
          )}
        </View>

        {/* Quick Summary */}
        {product.summary && (
          <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>Quick Summary</Text>
            <Text style={{ fontSize: 15, color: '#5D6575', lineHeight: 22, fontWeight: '500' }}>
              {product.summary}
            </Text>
          </View>
        )}

        {/* Offer Type & Unit */}
        {(product.offerType || product.unit) && (
          <View style={{ paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', gap: 12 }}>
            {product.offerType && (
              <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#3B82F6', textTransform: 'capitalize' }}>{product.offerType}</Text>
              </View>
            )}
            {product.unit && (
              <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#22C55E' }}>Unit: {product.unit}</Text>
              </View>
            )}
            {product.safetyLevel > 0 && (
              <View style={{ backgroundColor: product.safetyLevel >= 3 ? '#FEF2F2' : '#FFFBEB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: product.safetyLevel >= 3 ? '#EF4444' : '#F59E0B' }}>Safety: L{product.safetyLevel}</Text>
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
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' }}
                  activeOpacity={0.7}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {/* <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={[{ width: 18, height: 18, backgroundColor: '#CBD5E1', borderRadius: 4 }, isExpanded && { backgroundColor: '#137FEC' }]} />
                    </View> */}
                    <Text style={[{ fontSize: 16, fontWeight: '700', color: '#334155' }, isExpanded && { color: '#111' }]}>{section.title}</Text>
                  </View>
                  <View style={[
                    { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#94A3B8', transform: [{ rotate: '-45deg' }] },
                    isExpanded && { transform: [{ rotate: '45deg' }], borderColor: '#137FEC' }
                  ]} />
                </TouchableOpacity>
                {isExpanded && renderSectionContent(section.id)}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, gap: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 4 }}>
          <TouchableOpacity style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={decrementQty}><Text style={{ fontSize: 20, fontWeight: '600', color: '#111' }}>-</Text></TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111', width: 30, textAlign: 'center' }}>{quantity}</Text>
          <TouchableOpacity style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={incrementQty}><Text style={{ fontSize: 20, fontWeight: '600', color: '#111' }}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: isInStock ? '#137FEC' : '#94A3B8', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
          disabled={!isInStock}
          onPress={() => navigation.navigate(Routes.CheckoutScreen, { product, quantity })}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>
            {isInStock ? 'Request Proposal' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}