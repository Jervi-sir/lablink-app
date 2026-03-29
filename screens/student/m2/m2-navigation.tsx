import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { SearchInput } from "@/components/inputs/search-input";
import { LabGrid } from "@/components/lists/lab-grid";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import {
  defaultStudentBusinessFilters,
  useStudentBusinessSearchStore,
} from "@/zustand/student-business-search-store";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

const TYPE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Laboratories', value: 'laboratory' },
  { label: 'Suppliers', value: 'supplier' },
] as const;

export default function StudentM2Navigation() {
  const navigation = useNavigation<any>();
  const filters = useStudentBusinessSearchStore((state) => state.filters);
  const recentSearches = useStudentBusinessSearchStore((state) => state.recentSearches);
  const setFilters = useStudentBusinessSearchStore((state) => state.setFilters);
  const addRecentSearch = useStudentBusinessSearchStore((state) => state.addRecentSearch);
  const clearRecentSearches = useStudentBusinessSearchStore((state) => state.clearRecentSearches);

  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const blurTimeoutRef = useRef<any>(null);

  const fetchBusinesses = useCallback(async (page: number | null, refreshingList = false, query = search) => {
    if (page === null) return;

    if (refreshingList) setRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response: any = await api.get(buildRoute(ApiRoutes.searchBusinesses), {
        params: {
          page,
          per_page: 12,
          q: query.trim() || undefined,
          business_type: filters.businessType === 'all' ? undefined : filters.businessType,
          wilaya_id: filters.wilayaId ?? undefined,
          sort_by: filters.sortBy,
        },
      });

      const newItems = response?.data || [];
      setBusinesses((current) => (page === 1 ? newItems : [...current, ...newItems]));
      setNextPage(response?.next_page ?? null);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [filters, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBusinesses(1, false, search);
    }, search.trim() ? 350 : 0);

    return () => clearTimeout(timer);
  }, [fetchBusinesses, search]);

  useEffect(() => () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.businessType !== defaultStudentBusinessFilters.businessType) count += 1;
    if (filters.wilayaId !== defaultStudentBusinessFilters.wilayaId) count += 1;
    if (filters.sortBy !== defaultStudentBusinessFilters.sortBy) count += 1;
    return count;
  }, [filters]);

  const onRefresh = () => fetchBusinesses(1, true);

  const handleLoadMore = () => {
    if (!isLoadingMore && nextPage) fetchBusinesses(nextPage);
  };

  const handleSearchSubmit = () => {
    const term = search.trim();
    if (term) addRecentSearch(term);
    fetchBusinesses(1, false, term);
    setIsSearchFocused(false);
  };

  const handleRecentSearchPress = (term: string) => {
    setSearch(term);
    addRecentSearch(term);
    fetchBusinesses(1, false, term);
    setIsSearchFocused(false);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ paddingHorizontal: paddingHorizontal, paddingTop: 10, paddingBottom: 8 }}>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A' }}>Businesses</Text>
        <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '600', color: '#64748B' }}>
          Explore all businesses, laboratories, and suppliers.
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
            fetchBusinesses(1, false, '');
          }}
          placeholder="Search laboratories, suppliers, or services..."
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.FilterScreen, { mode: 'businesses' })}
          style={{ width: 52, height: 48, borderRadius: 16, backgroundColor: activeFilterCount > 0 ? '#137FEC' : '#FFF', borderWidth: 1, borderColor: activeFilterCount > 0 ? '#137FEC' : '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '900', color: activeFilterCount > 0 ? '#FFF' : '#475569' }}>
            {activeFilterCount > 0 ? activeFilterCount : '≡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: paddingHorizontal, paddingBottom: 14 }}>
        {TYPE_TABS.map((tab) => {
          const isActive = filters.businessType === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilters({ ...filters, businessType: tab.value })}
              style={{ flex: 1, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#0F172A' : '#FFF', borderWidth: 1, borderColor: isActive ? '#0F172A' : '#E2E8F0' }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{tab.label}</Text>
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
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>Clear</Text>
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
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{search.trim() ? `Results for "${search.trim()}"` : 'All Businesses'}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8' }}>{businesses.length} loaded</Text>
          </View>
        </View>

        <LabGrid
          labs={businesses}
          onLabPress={(business) => navigation.navigate(Routes.BusinessScreen, { labId: business.id, labName: business.name, lab: business })}
          isLoading={isLoading && businesses.length === 0}
          paddingHorizontal={paddingHorizontal}
        />

        {!isLoading && businesses.length === 0 ? (
          <View style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 80 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>No matching businesses</Text>
            <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center' }}>
              Try another keyword or adjust your filters to discover more laboratories and suppliers.
            </Text>
          </View>
        ) : null}

        {nextPage ? (
          <View style={{ paddingHorizontal: paddingHorizontal, marginTop: 8 }}>
            <TouchableOpacity onPress={handleLoadMore} style={{ height: 52, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}>
              {isLoadingMore ? <ActivityIndicator size="small" color="#137FEC" /> : <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>Load more</Text>}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
}
