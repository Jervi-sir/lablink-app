import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Routes } from "@/utils/helpers/routes";
import { ButtonTag } from "../components/buttons/button-tag";
import { BusinessCard1 } from "../components/cards/business-card-1";
import { ProductCard1 } from "../components/cards/product-card-1";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProductGrid } from "../components/lists/product-grid";
import { LabGrid } from "../components/lists/lab-grid";
import { SearchInput } from "../components/inputs/search-input";
import { paddingHorizontal } from "@/utils/variables/styles";

const RECENT_SEARCHES_KEY = 'lablink_recent_searches';

export default function StudentM2Navigation() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Products');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[], labs: any[] }>({ products: [], labs: [] });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [topLabs, setTopLabs] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  const isSearching = search.length > 0;

  useEffect(() => {
    loadRecentSearches();
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [labsRes, productsRes]: any = await Promise.all([
        api.get(ApiRoutes.businesses.topLabs),
        api.get(ApiRoutes.products.recent)
      ]);
      setTopLabs(labsRes.data || []);
      setRecentProducts(productsRes.data || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const toggleSaveProduct = useCallback(async (productId: string) => {
    if (savingProductId) return;
    try {
      setSavingProductId(productId);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));
      if (response) {
        setRecentProducts(prev =>
          prev.map(p => p.id.toString() === productId ? { ...p, isSaved: response.isSaved } : p)
        );
        setResults(prev => ({
          ...prev,
          products: prev.products.map(p =>
            p.id.toString() === productId ? { ...p, isSaved: response.isSaved } : p
          ),
        }));
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSavingProductId(null);
    }
  }, [savingProductId]);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearch = async (term: string) => {
    if (!term.trim()) return;
    try {
      const filtered = recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    let isActive = true;

    if (!search.trim()) {
      setResults({ products: [], labs: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res: any = await api.get(ApiRoutes.search, { params: { q: search } });
        if (isActive) {
          setResults({
            products: res.products?.data || [],
            labs: res.labs?.data || []
          });
          setIsLoading(false);
        }
      } catch (error) {
        if (isActive) {
          console.error("Search error:", error);
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [search]);

  const handleSearchSubmit = () => {
    if (search.trim()) {
      saveRecentSearch(search.trim());
    }
  };

  const renderDiscovery = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 1. Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={{ marginTop: 8, paddingHorizontal: paddingHorizontal }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}><Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>Clear</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {recentSearches.map(item => (
              <ButtonTag
                key={item}
                label={item}
                onPress={() => setSearch(item)}
                style={{ paddingHorizontal: 16, paddingVertical: 8 }}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 2. Top Laboratories */}
      <View style={{ marginTop: 24 }}>
        <View style={{ paddingHorizontal: paddingHorizontal }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Top Laboratories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingHorizontal: paddingHorizontal }}>
          {topLabs.map(lab => (
            <BusinessCard1
              key={lab.id}
              lab={lab}
              onPress={() => navigation.navigate(Routes.BusinessScreen, { labId: lab.id, labName: lab.name })}
            />
          ))}
        </ScrollView>
      </View>

      {/* 3. Recent Products */}
      <View style={{ marginTop: 24, paddingHorizontal: paddingHorizontal }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Recent Products</Text>
        <ProductGrid
          products={recentProducts}
          onProductPress={(item) => navigation.navigate(Routes.ProductScreen, { product: item })}
          onToggleSave={(id) => toggleSaveProduct(id)}
          savingProductId={savingProductId}
        />
      </View>
    </ScrollView>
  );

  const renderResults = () => (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Tab Switcher */}
      <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, gap: 12, paddingVertical: 8 }}>
        {['Products', 'Laboratories'].map(tab => (
          <ButtonTag
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {isLoading ? (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator color="#137FEC" size="large" />
          </View>
        ) : (
          <>
            {activeTab === 'Products' ? (
              results.products.length > 0 ? (
                <ProductGrid
                  products={results.products}
                  onProductPress={(item) => {
                    saveRecentSearch(search);
                    navigation.navigate(Routes.ProductScreen, { product: item });
                  }}
                  onToggleSave={(id) => toggleSaveProduct(id)}
                  savingProductId={savingProductId}
                  paddingHorizontal={20}
                />
              ) : (
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                  <Text style={{ color: '#94A3B8' }}>No products found for "{search}"</Text>
                </View>
              )
            ) : (
              results.labs.length > 0 ? (
                <LabGrid
                  labs={results.labs}
                  onLabPress={(item) => {
                    saveRecentSearch(search);
                    navigation.navigate(Routes.BusinessScreen, { labId: item.id, labName: item.name });
                  }}
                  paddingHorizontal={20}
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
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Dynamic Header */}
      <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, paddingVertical: 8, alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search equipment, labs, chemicals..."
        />
      </View>

      {isSearching ? renderResults() : renderDiscovery()}
    </ScreenWrapper>
  );
}