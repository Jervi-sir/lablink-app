import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { Routes } from "@/utils/helpers/routes";
import { ButtonTag } from "@/components/buttons/button-tag";
import { BusinessCard1 } from "@/components/cards/business-card-1";
import { ProductGrid } from "@/components/lists/product-grid";
import { LabGrid } from "@/components/lists/lab-grid";
import { SearchInput } from "@/components/inputs/search-input";
import { paddingHorizontal } from "@/utils/variables/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageStore } from "@/zustand/language-store";

export interface DiscoverySection {
  title: string;
  route: string;
  type: "horizontal-business" | "vertical-products";
}

interface SearchScreenProps {
  placeholder?: string;
  apiRoute: string;
  recentSearchesKey: string;
  discoverySections?: DiscoverySection[];
  tabs: {
    label: string;
    key: string;
    component: "ProductGrid" | "LabGrid";
  }[];
  accentColor?: string;
  onToggleSave?: (productId: string) => Promise<void>;
  savingProductId?: string | null;
}

const translations = {
  search_placeholder: { en: 'Search...', fr: 'Rechercher...', ar: 'بحث...' },
  recent_searches: { en: 'Recent Searches', fr: 'Recherches récentes', ar: 'عمليات البحث الأخيرة' },
  clear: { en: 'Clear', fr: 'Effacer', ar: 'مسح' },
  no_results_prefix: { en: 'No', fr: 'Aucun(e)', ar: 'لا يوجد' },
  no_results_suffix: { en: 'found for', fr: 'trouvé pour', ar: 'تم العثور عليه لـ' },
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  placeholder: propPlaceholder,
  apiRoute,
  recentSearchesKey,
  discoverySections = [],
  tabs,
  accentColor = "#137FEC",
  onToggleSave,
  savingProductId,
}) => {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;

  const [search, setSearch] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [discoveryData, setDiscoveryData] = useState<Record<string, any[]>>({});

  const isSearching = search.length > 0;
  const activeTab = tabs[activeTabIndex];
  const placeholder = propPlaceholder || t('search_placeholder');

  useEffect(() => {
    loadRecentSearches();
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const uniqueRoutes = [...new Set(discoverySections.map((s) => s.route))];
      const responses = await Promise.all(uniqueRoutes.map((r) => api.get(r)));

      const dataMap: Record<string, any[]> = {};
      uniqueRoutes.forEach((route, index) => {
        dataMap[route] = responses[index]?.data || [];
      });

      setDiscoveryData(dataMap);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(recentSearchesKey);
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
      const filtered = recentSearches.filter(
        (s) => s.toLowerCase() !== term.toLowerCase()
      );
      const updated = [term, ...filtered].slice(0, 10);
      setRecentSearches(updated);
      await AsyncStorage.setItem(recentSearchesKey, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(recentSearchesKey);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  // Debounced search
  useEffect(() => {
    let isActive = true;

    if (!search.trim()) {
      setResults({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res: any = await api.get(apiRoute, { params: { q: search } });
        if (isActive) {
          setResults(res || {});
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* 1. Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={{ marginTop: 8, paddingHorizontal: paddingHorizontal }}>
          <View
            style={{
              flexDirection: language === 'ar' ? 'row-reverse' : 'row',
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {t('recent_searches')}
            </Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: accentColor }}>
                {t('clear')}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}
          >
            {recentSearches.map((item) => (
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

      {/* Discovery Sections */}
      {discoverySections.map((section, index) => {
        const data = discoveryData[section.route] || [];
        if (data.length === 0) return null;

        if (section.type === "horizontal-business") {
          return (
            <View key={index} style={{ marginTop: 24 }}>
              <View style={{ paddingHorizontal: paddingHorizontal }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "800",
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 12,
                    textAlign: language === 'ar' ? 'right' : 'left',
                  }}
                >
                  {section.title}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: paddingHorizontal,
                  flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                }}
              >
                {data.map((item) => (
                  <BusinessCard1
                    key={item.id}
                    lab={item}
                    onPress={() =>
                      navigation.navigate(Routes.BusinessScreen, {
                        labId: item.id,
                        labName: item.name,
                      })
                    }
                  />
                ))}
              </ScrollView>
            </View>
          );
        }

        if (section.type === "vertical-products") {
          return (
            <View
              key={index}
              style={{ marginTop: 24, paddingHorizontal: paddingHorizontal }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "800",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 12,
                  textAlign: language === 'ar' ? 'right' : 'left',
                }}
              >
                {section.title}
              </Text>
              <ProductGrid
                products={data}
                onProductPress={(item) =>
                  navigation.navigate(Routes.ProductScreen, { product: item })
                }
                onToggleSave={onToggleSave}
                savingProductId={savingProductId}
              />
            </View>
          );
        }

        return null;
      })}
    </ScrollView>
  );

  const renderResults = () => {
    const tabData = results[activeTab.key]?.data || [];

    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        {/* Tab Switcher */}
        <View
          style={{
            flexDirection: language === 'ar' ? 'row-reverse' : 'row',
            paddingHorizontal: paddingHorizontal,
            gap: 12,
            paddingVertical: 8,
          }}
        >
          {tabs.map((tab, index) => (
            <ButtonTag
              key={tab.key}
              label={tab.label}
              isActive={activeTabIndex === index}
              onPress={() => setActiveTabIndex(index)}
            />
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {isLoading ? (
            <View style={{ marginTop: 40 }}>
              <ActivityIndicator color={accentColor} size="large" />
            </View>
          ) : (
            <>
              {tabData.length > 0 ? (
                activeTab.component === "ProductGrid" ? (
                  <ProductGrid
                    products={tabData}
                    onProductPress={(item) => {
                      saveRecentSearch(search);
                      navigation.navigate(Routes.ProductScreen, { product: item });
                    }}
                    onToggleSave={onToggleSave}
                    savingProductId={savingProductId}
                    paddingHorizontal={20}
                  />
                ) : (
                  <LabGrid
                    labs={tabData}
                    onLabPress={(item) => {
                      saveRecentSearch(search);
                      navigation.navigate(Routes.BusinessScreen, {
                        labId: item.id,
                        labName: item.name,
                      });
                    }}
                    paddingHorizontal={20}
                  />
                )
              ) : (
                <View style={{ alignItems: "center", marginTop: 40, paddingHorizontal: 20 }}>
                  <Text style={{ color: "#94A3B8", textAlign: 'center' }}>
                    {t('no_results_prefix')} {activeTab.label.toLowerCase()} {t('no_results_suffix')} "{search}"
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#F8F9FB" }}>
      {/* Dynamic Header */}
      <View
        style={{
          flexDirection: language === 'ar' ? 'row-reverse' : 'row',
          paddingHorizontal: paddingHorizontal,
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          placeholder={placeholder}
        />
      </View>

      {isSearching ? renderResults() : renderDiscovery()}
    </ScreenWrapper>
  );
};

export default SearchScreen;
