import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, ActivityIndicator, RefreshControl, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { ButtonTag } from "../components/buttons/button-tag";
import { BusinessCard1 } from "../components/cards/business-card-1";
import { ProductCard1 } from "../components/cards/product-card-1";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";
import SearchIcon from "@/assets/icons/search-icon";
import BellIcon from "@/assets/icons/bell-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { ProductGrid } from "../components/lists/product-grid";
import { LabGrid } from "../components/lists/lab-grid";
import { SearchInput } from "../components/inputs/search-input";

const { width } = Dimensions.get('window');

export default function StudentM1Navigation() {
  const navigation = useNavigation<any>();
  const auth = useAuthStore((s) => s.auth);

  // Discovery State
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [featuredLabs, setFeaturedLabs] = useState<any[]>([]);
  const [nextPageLabs, setNextPageLabs] = useState<number | null>(1);
  const [loadingLabs, setLoadingLabs] = useState(false);

  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [nextPageProducts, setNextPageProducts] = useState<number | null>(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  // Search State
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: any[], labs: any[] }>({ products: [], labs: [] });
  const [searchTab, setSearchTab] = useState('Products');
  const [searching, setSearching] = useState(false);

  const isSearching = search.length > 0;

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

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ products: [], labs: [] });
      return;
    }
    setSearching(true);
    try {
      const res: any = await api.get(ApiRoutes.search, { params: { q: query } });
      setSearchResults({
        products: res.products?.data || [],
        labs: res.labs?.data || []
      });
    } catch (error) {
      console.error("Search error in M1:", error);
    } finally {
      setSearching(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchProductCategories(),
      fetchFeaturedLabs(1),
      fetchTrendingProducts(1, selectedCategoryId)
    ]);
    setRefreshing(false);
  }, [fetchProductCategories, fetchFeaturedLabs, fetchTrendingProducts, selectedCategoryId]);

  const toggleSaveProduct = useCallback(async (productId: string) => {
    if (savingProductId) return;
    try {
      setSavingProductId(productId);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));
      if (response) {
        setTrendingProducts(prev =>
          prev.map(p => p.id.toString() === productId ? { ...p, isSaved: response.isSaved } : p)
        );
        // Also update search results if they exist
        setSearchResults(prev => ({
          ...prev,
          products: prev.products.map(p =>
            p.id.toString() === productId ? { ...p, isSaved: response.isSaved } : p
          )
        }));
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSavingProductId(null);
    }
  }, [savingProductId]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        performSearch(search);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, performSearch]);

  // Handle category change
  useEffect(() => {
    fetchTrendingProducts(1, selectedCategoryId);
  }, [selectedCategoryId]);

  // Initial load
  useEffect(() => {
    fetchProductCategories();
    fetchFeaturedLabs(1);
  }, []);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ paddingHorizontal: paddingHorizontal, flexDirection: 'row', gap: 8, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
        {/* Search & Filters */}
        <SearchInput
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
          <BellIcon />
          <View style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' }} />
        </TouchableOpacity>
      </View>

      {isSearching ? (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, gap: 12, paddingBottom: 8 }}>
            {['Products', 'Laboratories'].map(tab => (
              <ButtonTag
                key={tab}
                label={tab}
                isActive={searchTab === tab}
                onPress={() => setSearchTab(tab)}
              />
            ))}
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {searching ? (
              <View style={{ marginTop: 40 }}>
                <ActivityIndicator color="#137FEC" size="large" />
              </View>
            ) : (
              <>
                {searchTab === 'Products' ? (
                  searchResults.products.length > 0 ? (
                    <ProductGrid
                      products={searchResults.products}
                      onProductPress={(item) => navigation.navigate(Routes.ProductScreen, { product: item })}
                      onToggleSave={(id) => toggleSaveProduct(id)}
                      savingProductId={savingProductId}
                      paddingHorizontal={paddingHorizontal}
                    />
                  ) : (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                      <Text style={{ color: '#94A3B8' }}>No products found for "{search}"</Text>
                    </View>
                  )
                ) : (
                  searchResults.labs.length > 0 ? (
                    <LabGrid
                      labs={searchResults.labs}
                      onLabPress={(item) => navigation.navigate(Routes.BusinessScreen, { labId: item.id, labName: item.name })}
                      paddingHorizontal={paddingHorizontal}
                    />
                  ) : (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                      <Text style={{ color: '#94A3B8' }}>No laboratories found for "{search}"</Text>
                    </View>
                  )
                )}
              </>
            )}
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: paddingHorizontal }}
            style={{ flexGrow: 0, paddingVertical: 8 }}
          >
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, marginTop: 8 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#137FEC" />
            }
          >
            <View style={{ paddingHorizontal: paddingHorizontal, gap: 20 }}>
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 16,
                paddingVertical: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 2
              }}>
                <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Featured Labs</Text>
                  <TouchableOpacity onPress={() => navigation.navigate(Routes.FeaturedLabsScreen)}>
                    <Text style={{ color: '#137FEC', fontWeight: '700' }}>View all</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingHorizontal: 16, alignItems: 'center' }}>
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

              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Trending Products</Text>
                </View>

                <ProductGrid
                  products={trendingProducts}
                  onProductPress={(product) => navigation.navigate(Routes.ProductScreen, { product })}
                  onToggleSave={(id) => toggleSaveProduct(id)}
                  savingProductId={savingProductId}
                />

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
        </>
      )}
    </ScreenWrapper>
  );
}