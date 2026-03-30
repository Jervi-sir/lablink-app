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
  defaultStudentCatalogFilters,
  STUDENT_CATALOG_MAX_PRICE,
  useStudentCatalogStore,
} from "@/screens/student/zustand/student-catalog-store";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const TYPE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Products', value: 'product' },
  { label: 'Services', value: 'service' },
] as const;

const translations = {
  suppliers: { en: 'Suppliers', fr: 'Fournisseurs', ar: 'الموردين' },
  browse_equipment: { en: 'Browse equipment from Suppliers.', fr: "Parcourir l'équipement des fournisseurs.", ar: 'تصفح المعدات من الموردين.' },
  search_placeholder: { en: 'Search products, services, or labs...', fr: 'Rechercher des produits, des services ou des laboratoires...', ar: 'البحث عن المنتجات أو الخدمات أو المختبرات...' },
  recent_searches: { en: 'Recent Searches', fr: 'Recherches récentes', ar: 'عمليات البحث الأخيرة' },
  clear: { en: 'Clear', fr: 'Effacer', ar: 'مسح' },
  results_for: { en: 'Results for', fr: 'Résultats pour', ar: 'نتائج البحث عن' },
  catalog: { en: 'Catalog', fr: 'Catalogue', ar: 'الكتالوج' },
  loaded: { en: 'loaded', fr: 'chargé(s)', ar: 'تم التحميل' },
  no_matching: { en: 'No matching items', fr: 'Aucun article correspondant', ar: 'لا توجد عناصر مطابقة' },
  try_another: { en: 'Try another search term or adjust your filters to explore more products and services.', fr: 'Essayez un autre terme de recherche ou ajustez vos filtres pour explorer plus de produits et de services.', ar: 'جرب مصطلح بحث آخر أو اعدل الفلاتر لاستكشاف المزيد من المنتجات والخدمات.' },
  load_more: { en: 'Load more', fr: 'Charger plus', ar: 'تحميل المزيد' },
};

export default function StudentM1Navigation() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const filters = useStudentCatalogStore((state) => state.filters);
  const recentSearches = useStudentCatalogStore((state) => state.recentSearches);
  const setFilters = useStudentCatalogStore((state) => state.setFilters);
  const addRecentSearch = useStudentCatalogStore((state) => state.addRecentSearch);
  const clearRecentSearches = useStudentCatalogStore((state) => state.clearRecentSearches);


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
    if (page === null) {
      return;
    }

    if (refreshingList) setRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response: any = await api.get(buildRoute(ApiRoutes.searchProducts), {
        params: {
          page,
          per_page: 12,
          q: query.trim() || undefined,
          product_type: filters.productType === 'all' ? undefined : filters.productType,
          wilaya_id: filters.wilayaId ?? undefined,
          product_category_ids: filters.categoryIds,
          min_price: filters.minPrice,
          max_price: filters.maxPrice < STUDENT_CATALOG_MAX_PRICE ? filters.maxPrice : undefined,
          safety_levels: filters.safetyLevels,
          sort_by: filters.sortBy,
          business_category_code: 'supplier',
        },
      });

      const newItems = response?.data || [];
      setProducts((current) => (page === 1 ? newItems : [...current, ...newItems]));
      setNextPage(response?.next_page ?? null);
    } catch (error) {
      console.error('Error fetching catalog products:', error);
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

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.productType !== defaultStudentCatalogFilters.productType) count += 1;
    if (filters.wilayaId !== defaultStudentCatalogFilters.wilayaId) count += 1;
    if (filters.categoryIds.length > 0) count += 1;
    if (filters.safetyLevels.length > 0) count += 1;
    if (filters.minPrice !== 0 || filters.maxPrice !== STUDENT_CATALOG_MAX_PRICE) count += 1;
    if (filters.sortBy !== defaultStudentCatalogFilters.sortBy) count += 1;

    return count;
  }, [filters]);

  const onRefresh = () => fetchProducts(1, true);

  const handleLoadMore = () => {
    if (!isLoadingMore && nextPage) {
      fetchProducts(nextPage);
    }
  };

  const handleSearchSubmit = () => {
    const term = search.trim();

    if (term) {
      addRecentSearch(term);
    }

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
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A' }}>{t('suppliers')}</Text>
        <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '600', color: '#64748B' }}>
          {t('browse_equipment')}
        </Text>
      </View>

      <View style={{ paddingHorizontal: paddingHorizontal, flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 16 }}>
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
          onPress={() => navigation.navigate(Routes.FilterScreen)}
          style={{
            width: 52,
            height: 48,
            borderRadius: 16,
            backgroundColor: activeFilterCount > 0 ? '#137FEC' : '#FFF',
            borderWidth: 1,
            borderColor: activeFilterCount > 0 ? '#137FEC' : '#E2E8F0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: activeFilterCount > 0 ? '#FFF' : '#475569' }}>
            {activeFilterCount > 0 ? activeFilterCount : '≡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: paddingHorizontal, paddingBottom: 14 }}>
        {TYPE_TABS.map((tab) => {
          const isActive = filters.productType === tab.value;

          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilters({ ...filters, productType: tab.value })}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isActive ? '#0F172A' : '#FFF',
                borderWidth: 1,
                borderColor: isActive ? '#0F172A' : '#E2E8F0',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View> */}

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
                <TouchableOpacity
                  key={term}
                  onPress={() => handleRecentSearchPress(term)}
                  style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: paddingHorizontal, marginBottom: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>
              {search.trim() ? `${t('results_for')} "${search.trim()}"` : t('catalog')}
            </Text>
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
            <TouchableOpacity
              onPress={handleLoadMore}
              style={{ height: 52, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
            >
              {isLoadingMore ? (
                <ActivityIndicator size="small" color="#137FEC" />
              ) : (
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{t('load_more')}</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}
