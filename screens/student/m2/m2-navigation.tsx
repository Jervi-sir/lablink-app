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
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

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

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults({ products: [], labs: [] });
      return;
    }
    setIsLoading(true);
    try {
      const res: any = await api.get(ApiRoutes.search, { params: { q: query } });
      setResults({
        products: res.products?.data || [],
        labs: res.labs?.data || []
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        performSearch(search);
      }
    }, 500);
    return () => clearTimeout(timer);
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
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
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
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Top Laboratories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
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
      <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Recent Products</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
          {recentProducts.map(item => (
            <ProductCard1
              key={item.id}
              product={{
                ...item,
                lab: item.business?.name || 'Unknown Lab',
                price: `${item.price.toLocaleString()} DA`
              }}
              onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderResults = () => (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Tab Switcher */}
      <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
        {['Products', 'Laboratories'].map(tab => (
          <ButtonTag
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#137FEC" size="large" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'Products' ? results.products : results.labs}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          key={activeTab} // Force re-render when switching tabs if needed for column layout consistency
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40, width: '100%' }}>
              <Text style={{ color: '#94A3B8' }}>No results found for "{search}"</Text>
            </View>
          }
          renderItem={({ item }) => {
            if (activeTab === 'Products') {
              return (
                <ProductCard1
                  product={{
                    ...item,
                    lab: item.business?.name || 'Lab',
                    price: `${item.price.toLocaleString()} DA`
                  }}
                  onPress={() => {
                    saveRecentSearch(search);
                    navigation.navigate(Routes.ProductScreen, { product: item });
                  }}
                  style={{ marginBottom: 16 }}
                />
              );
            }
            return (
              <TouchableOpacity
                style={{
                  width: COLUMN_WIDTH,
                  backgroundColor: '#FFF',
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#F1F5F9',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2
                }}
                onPress={() => {
                  saveRecentSearch(search);
                  navigation.navigate(Routes.BusinessScreen, { labId: item.id, labName: item.name });
                }}
              >
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 32 }}>🏢</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', textAlign: 'center' }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 4, textTransform: 'uppercase' }}>{item.wilaya?.name || 'Laboratory'}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Dynamic Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, marginRight: 10 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' }}
            placeholder="Search equipment, labs, chemicals..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ fontSize: 16, color: '#94A3B8', padding: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? renderResults() : renderDiscovery()}
    </ScreenWrapper>
  );
}