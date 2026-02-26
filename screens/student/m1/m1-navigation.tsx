import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { ButtonTag } from "../components/buttons/button-tag";
import { BusinessCard1 } from "../components/cards/business-card-1";
import { ProductCard1 } from "../components/cards/product-card-1";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";

const { width } = Dimensions.get('window');

export default function StudentM1Navigation() {
  const navigation = useNavigation<any>();
  const auth = useAuthStore((s) => s.auth);

  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [featuredLabs, setFeaturedLabs] = useState<any[]>([]);
  const [nextPageLabs, setNextPageLabs] = useState<number | null>(1);
  const [loadingLabs, setLoadingLabs] = useState(false);

  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [nextPageProducts, setNextPageProducts] = useState<number | null>(1);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const fetchFeaturedLabs = useCallback(async (page: number) => {
    if (page === null) return;
    try {
      if (page === 1) setLoadingLabs(true);
      const response = await api.get(buildRoute(ApiRoutes.businesses.featuredLabs), {
        params: { page, per_page: 6 }
      });
      if (response && response.data) {
        const formattedLabs = response.data.map((lab: any) => ({
          id: lab.id.toString(),
          name: lab.name,
          ...lab
        }));
        setFeaturedLabs(prev => page === 1 ? formattedLabs : [...prev, ...formattedLabs]);
        setNextPageLabs(response.next_page);
      }
    } catch (error) {
      console.error("Error fetching featured labs:", error);
    } finally {
      setLoadingLabs(false);
    }
  }, []);

  const fetchProductCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get(buildRoute(ApiRoutes.taxonomies), {
        params: { types: 'product_categories' }
      });
      if (response && response.product_categories) {
        setProductCategories(response.product_categories);
      }
    } catch (error) {
      console.error("Error fetching product categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const fetchTrendingProducts = useCallback(async (page: number, catId = selectedCategoryId) => {
    if (page === null) return;
    try {
      if (page === 1) setLoadingProducts(true);
      const response = await api.get(buildRoute(ApiRoutes.products.trending), {
        params: {
          page,
          per_page: 10,
          product_category_id: catId === 'all' ? undefined : catId
        }
      });
      if (response && response.data) {
        const formattedProducts = response.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          lab: product.business?.name || 'Unknown Lab',
          price: `${product.price.toLocaleString()} DA`,
          ...product
        }));
        setTrendingProducts(prev => page === 1 ? formattedProducts : [...prev, ...formattedProducts]);
        setNextPageProducts(response.next_page);
      }
    } catch (error) {
      console.error("Error fetching trending products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategoryId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProductCategories(),
      fetchFeaturedLabs(1),
      fetchTrendingProducts(1, selectedCategoryId)
    ]);
    setRefreshing(false);
  }, [fetchProductCategories, fetchFeaturedLabs, fetchTrendingProducts, selectedCategoryId]);

  // Handle category change
  useEffect(() => {
    fetchTrendingProducts(1, selectedCategoryId);
  }, [selectedCategoryId]);

  // Initial load
  useEffect(() => {
    fetchProductCategories();
    fetchFeaturedLabs(1);
    // Trending is already handled by the category effect on mount
  }, []);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#137FEC" />
        }
      >
        <View style={{ paddingHorizontal: 16, gap: 20, paddingTop: 16 }}>

          {/* 1. Enhanced Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Good Morning,</Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>{auth?.studentProfile?.fullName || 'User'} 👋</Text>
            </View>
            <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
              <View style={{ width: 22, height: 22, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, backgroundColor: '#111' }} />
              <View style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' }} />
            </TouchableOpacity>
          </View>

          {/* 2. Search & Filters */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFF',
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 56,
              gap: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
              elevation: 4,
            }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#137FEC' }}>
              <View style={{ position: 'absolute', bottom: -3, right: -3, width: 8, height: 2, backgroundColor: '#137FEC', transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={{ flex: 1, color: '#9CA3AF', fontSize: 15, fontWeight: '500' }}>Search for equipment or labs...</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.FilterScreen)}
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}
            >
              <View style={{ gap: 3 }}>
                <View style={{ width: 14, height: 2, backgroundColor: '#111', borderRadius: 1 }} />
                <View style={{ width: 10, height: 2, backgroundColor: '#111', borderRadius: 1, alignSelf: 'center' }} />
                <View style={{ width: 14, height: 2, backgroundColor: '#111', borderRadius: 1 }} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* 3. Promo Banner */}
          <View style={{ backgroundColor: '#137FEC', borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }}>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>LAB ACCESS</Text>
              </View>
              <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800', lineHeight: 26 }}>Get 20% Off on{'\n'}PCR Testing Kits</Text>
              <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={{ color: '#137FEC', fontWeight: '800', fontSize: 12 }}>Claim Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, position: 'absolute', right: -20, bottom: -20 }} />
          </View>

          {/* 4. Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <ButtonTag
              label="All"
              isActive={selectedCategoryId === 'all'}
              onPress={() => setSelectedCategoryId('all')}
            />
            {productCategories.map((cat) => (
              <ButtonTag
                key={cat.id}
                label={cat.name || cat.code}
                isActive={selectedCategoryId === cat.id.toString()}
                onPress={() => setSelectedCategoryId(cat.id.toString())}
              />
            ))}
          </ScrollView>

          {/* 3. Featured Labs */}
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Featured Labs</Text>
              <TouchableOpacity onPress={() => navigation.navigate(Routes.FeaturedLabsScreen)}>
                <Text style={{ color: '#137FEC', fontWeight: '700' }}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, alignItems: 'center' }}>
              {featuredLabs.map((lab) => (
                <BusinessCard1
                  key={lab.id}
                  lab={lab}
                  onPress={() => navigation.navigate(Routes.BusinessScreen, { lab })}
                />
              ))}
              {nextPageLabs && (
                <TouchableOpacity
                  onPress={() => fetchFeaturedLabs(nextPageLabs)}
                  style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                >
                  {loadingLabs ? (
                    <ActivityIndicator size="small" color="#137FEC" />
                  ) : (
                    <Text style={{ color: '#137FEC', fontWeight: '600', fontSize: 12 }}>Load more</Text>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* 4. Trending Products */}
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Trending Products</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {trendingProducts.map((product) => (
                <ProductCard1
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate(Routes.ProductScreen, { product })}
                />
              ))}
            </View>

            {nextPageProducts && (
              <TouchableOpacity
                onPress={() => fetchTrendingProducts(nextPageProducts)}
                style={{
                  backgroundColor: '#FFF',
                  padding: 14,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  marginTop: 8
                }}
              >
                {loadingProducts ? (
                  <ActivityIndicator size="small" color="#137FEC" />
                ) : (
                  <Text style={{ color: '#111', fontWeight: '700', fontSize: 14 }}>View more products</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}