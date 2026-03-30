import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { SearchInput } from "@/components/inputs/search-input";
import { ProductGrid } from "@/components/lists/product-grid";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import {
  defaultStudentLaboratoryServiceFilters,
  STUDENT_LABORATORY_SERVICE_MAX_PRICE,
  useStudentLaboratoryServiceStore,
} from "@/screens/student/zustand/student-laboratory-service-store";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const TYPE_TABS = [
  { label: 'all', value: 'all' },
  { label: 'products', value: 'product' },
  { label: 'services', value: 'service' },
] as const;

const translations = {
  laboratories: { en: 'Laboratories', fr: 'Laboratoires', ar: 'المختبرات' },
  explore_services: { en: 'Explore services and products from laboratories.', fr: 'Explorez les services et produits des laboratoires.', ar: 'استكشف الخدمات والمنتجات من المختبرات.' },
  search_placeholder: { en: 'Search laboratory services, tests, or products...', fr: 'Rechercher des services de laboratoire, des tests ou des produits...', ar: 'البحث عن خدمات المختبر أو الاختبارات أو المنتجات...' },
  all: { en: 'All', fr: 'Tout', ar: 'الكل' },
  products: { en: 'Products', fr: 'Produits', ar: 'المنتجات' },
  services: { en: 'Services', fr: 'Services', ar: 'الخدمات' },
  recent_searches: { en: 'Recent Searches', fr: 'Recherches récentes', ar: 'عمليات البحث الأخيرة' },
  clear: { en: 'Clear', fr: 'Effacer', ar: 'مسح' },
  results_for: { en: 'Results for', fr: 'Résultats pour', ar: 'نتائج البحث عن' },
  all_services: { en: 'All Services', fr: 'Tous les services', ar: 'جميع الخدمات' },
  loaded: { en: 'loaded', fr: 'chargé(s)', ar: 'تم التحميل' },
  no_matching: { en: 'No matching items', fr: 'Aucun article correspondant', ar: 'لا توجد عناصر مطابقة' },
  try_another: { en: 'Try another keyword or adjust your filters to discover more laboratory services and products.', fr: 'Essayez un autre mot-clé ou ajustez vos filtres pour découvrir davantage de services et produits de laboratoire.', ar: 'جرب كلمة رئيسية أخرى أو اعدل الفلاتر لاكتشاف المزيد من خدمات ومنتجات المختبر.' },
  load_more: { en: 'Load more', fr: 'Charger plus', ar: 'تحميل المزيد' },
};

export default function StudentM2Navigation() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const filters = useStudentLaboratoryServiceStore((state) => state.filters);
  const recentSearches = useStudentLaboratoryServiceStore((state) => state.recentSearches);
  const setFilters = useStudentLaboratoryServiceStore((state) => state.setFilters);
  const addRecentSearch = useStudentLaboratoryServiceStore((state) => state.addRecentSearch);
  const clearRecentSearches = useStudentLaboratoryServiceStore((state) => state.clearRecentSearches);

  const t = (key: keyof typeof translations) => translations[key][language];

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  const blurTimeoutRef = useRef<any>(null);

  const fetchProducts = useCallback(async (page: number | null, refreshingList = false, query = search) => {
    if (page === null) return;

    if (refreshingList) setRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response: any = await api.get(buildRoute(ApiRoutes.searchLaboratoryProducts), {
        params: {
          page,
          per_page: 12,
          q: query.trim() || undefined,
          product_type: filters.productType === 'all' ? undefined : filters.productType,
          wilaya_id: filters.wilayaId ?? undefined,
          product_category_ids: filters.categoryIds,
          min_price: filters.minPrice,
          max_price: filters.maxPrice < STUDENT_LABORATORY_SERVICE_MAX_PRICE ? filters.maxPrice : undefined,
          safety_levels: filters.safetyLevels,
          sort_by: filters.sortBy,
        },
      });

      const newItems = response?.data || [];
      setProducts((current) => (page === 1 ? newItems : [...current, ...newItems]));
      setNextPage(response?.next_page ?? null);
    } catch (error) {
      console.error('Error fetching laboratory products:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [filters, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1, false, search);
    }, search.trim() ? 350 : 0);

    return () => clearTimeout(timer);
  }, [fetchProducts, search]);

  useEffect(() => () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.productType !== defaultStudentLaboratoryServiceFilters.productType) count += 1;
    if (filters.wilayaId !== defaultStudentLaboratoryServiceFilters.wilayaId) count += 1;
    if (filters.categoryIds.length > 0) count += 1;
    if (filters.safetyLevels.length > 0) count += 1;
    if (filters.minPrice !== 0 || filters.maxPrice !== STUDENT_LABORATORY_SERVICE_MAX_PRICE) count += 1;
    if (filters.sortBy !== defaultStudentLaboratoryServiceFilters.sortBy) count += 1;
    return count;
  }, [filters]);

  const onRefresh = () => fetchProducts(1, true);

  const handleLoadMore = () => {
    if (!isLoadingMore && nextPage) fetchProducts(nextPage);
  };

  const handleSearchSubmit = () => {
    const term = search.trim();
    if (term) addRecentSearch(term);
    fetchProducts(1, false, term);
    setIsSearchFocused(false);
  };

  const handleRecentSearchPress = (term: string) => {
    setSearch(term);
    addRecentSearch(term);
    fetchProducts(1, false, term);
    setIsSearchFocused(false);
  };

  const toggleSaveProduct = useCallback(async (productId: string) => {
    if (savingProductId) return;

    try {
      setSavingProductId(productId);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));

      if (response) {
        setProducts((current) => current.map((product) => (
          product.id.toString() === productId
            ? { ...product, isSaved: response.isSaved }
            : product
        )));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setSavingProductId(null);
    }
  }, [savingProductId]);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ paddingHorizontal: paddingHorizontal, paddingTop: 10, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A' }}>{t('laboratories')}</Text>
        <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '600', color: '#64748B' }}>
          {t('explore_services')}
        </Text>
      </View>

      <View style={{ paddingHorizontal: paddingHorizontal, flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 10 }}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          onFocus={() => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
            setIsSearchFocused(true);
          }}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => setIsSearchFocused(false), 180);
          }}
          onClear={() => {
            setSearch('');
            fetchProducts(1, false, '');
          }}
          placeholder={t('search_placeholder')}
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.FilterScreen, { mode: 'laboratory_services' })}
          style={{ width: 52, height: 48, borderRadius: 16, backgroundColor: activeFilterCount > 0 ? '#137FEC' : '#FFF', borderWidth: 1, borderColor: activeFilterCount > 0 ? '#137FEC' : '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: activeFilterCount > 0 ? '#FFF' : '#475569' }}>
            {activeFilterCount > 0 ? activeFilterCount : '≡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: paddingHorizontal, paddingBottom: 14 }}>
        {TYPE_TABS.map((tab) => {
          const isActive = filters.productType === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilters({ ...filters, productType: tab.value })}
              style={{ flex: 1, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#0F172A' : '#FFF', borderWidth: 1, borderColor: isActive ? '#0F172A' : '#E2E8F0' }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{t(tab.label as any)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#137FEC" />}
      >
        {isSearchFocused && recentSearches.length > 0 ? (
          <View style={{ paddingHorizontal: paddingHorizontal, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{t('recent_searches')}</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{t('clear')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {recentSearches.map((term) => (
                <TouchableOpacity key={term} onPress={() => handleRecentSearchPress(term)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: paddingHorizontal, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{search.trim() ? `${t('results_for')} "${search.trim()}"` : t('all_services')}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8' }}>{products.length} {t('loaded')}</Text>
          </View>
        </View>

        <ProductGrid
          products={products}
          onProductPress={(product) => navigation.navigate(Routes.ProductScreen, { product })}
          onToggleSave={toggleSaveProduct}
          savingProductId={savingProductId}
          isLoading={isLoading && products.length === 0}
          paddingHorizontal={paddingHorizontal}
        />

        {!isLoading && products.length === 0 ? (
          <View style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 80 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('no_matching')}</Text>
            <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center' }}>
              {t('try_another')}
            </Text>
          </View>
        ) : null}

        {nextPage ? (
          <View style={{ paddingHorizontal: paddingHorizontal, marginTop: 8 }}>
            <TouchableOpacity onPress={handleLoadMore} style={{ height: 52, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
              {isLoadingMore ? <ActivityIndicator size="small" color="#137FEC" /> : <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{t('load_more')}</Text>}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}
