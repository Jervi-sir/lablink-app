import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import type { Wilaya } from "@/utils/types";
import {
  defaultStudentCatalogFilters,
  STUDENT_CATALOG_MAX_PRICE,
  useStudentCatalogStore,
} from "@/zustand/student-catalog-store";
import {
  defaultStudentBusinessFilters,
  useStudentBusinessSearchStore,
} from "@/zustand/student-business-search-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import type { TaxonomyItem } from "@/action-sheets/taxonomy-selector-sheet";

const SAFETY_LEVELS = [1, 2, 3, 4, 5];

const PRODUCT_SORT_OPTIONS = [
  { label: "Newest", value: "recent" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

const BUSINESS_SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Newest", value: "recent" },
  { label: "A to Z", value: "name" },
] as const;

export default function FilterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mode: 'products' | 'businesses' = route.params?.mode === 'businesses' ? 'businesses' : 'products';

  const savedProductFilters = useStudentCatalogStore((state) => state.filters);
  const setProductFilters = useStudentCatalogStore((state) => state.setFilters);
  const resetProductFilters = useStudentCatalogStore((state) => state.resetFilters);

  const savedBusinessFilters = useStudentBusinessSearchStore((state) => state.filters);
  const setBusinessFilters = useStudentBusinessSearchStore((state) => state.setFilters);
  const resetBusinessFilters = useStudentBusinessSearchStore((state) => state.resetFilters);

  const [categories, setCategories] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [productFilters, setLocalProductFilters] = useState(savedProductFilters);
  const [businessFilters, setLocalBusinessFilters] = useState(savedBusinessFilters);

  useEffect(() => {
    setLocalProductFilters(savedProductFilters);
  }, [savedProductFilters]);

  useEffect(() => {
    setLocalBusinessFilters(savedBusinessFilters);
  }, [savedBusinessFilters]);

  useEffect(() => {
    const loadTaxonomies = async () => {
      try {
        const types = mode === 'products' ? 'product_categories,wilayas' : 'wilayas';
        const response = await api.get(buildRoute(ApiRoutes.taxonomies), {
          params: { types },
        });

        setCategories(response?.product_categories || []);
        setWilayas(response?.wilayas || []);
      } catch (error) {
        console.error('Error loading filter taxonomies:', error);
      }
    };

    loadTaxonomies();
  }, [mode]);

  const selectedProductWilaya = wilayas.find((wilaya) => wilaya.id === productFilters.wilayaId);
  const selectedBusinessWilaya = wilayas.find((wilaya) => wilaya.id === businessFilters.wilayaId);

  const productSummary = useMemo(() => {
    const parts: string[] = [];

    if (productFilters.productType !== 'all') parts.push(productFilters.productType === 'product' ? 'Products' : 'Services');
    if (selectedProductWilaya) parts.push(selectedProductWilaya.en || selectedProductWilaya.code);
    if (productFilters.categoryIds.length > 0) parts.push(`${productFilters.categoryIds.length} categories`);
    if (productFilters.safetyLevels.length > 0) parts.push(`${productFilters.safetyLevels.length} safety levels`);
    if (productFilters.minPrice > 0 || productFilters.maxPrice < STUDENT_CATALOG_MAX_PRICE) {
      parts.push(`${productFilters.minPrice.toLocaleString()}-${productFilters.maxPrice.toLocaleString()} DA`);
    }

    return parts;
  }, [productFilters, selectedProductWilaya]);

  const businessSummary = useMemo(() => {
    const parts: string[] = [];

    if (businessFilters.businessType !== 'all') {
      parts.push(businessFilters.businessType === 'laboratory' ? 'Laboratories' : 'Suppliers');
    }
    if (selectedBusinessWilaya) parts.push(selectedBusinessWilaya.en || selectedBusinessWilaya.code);
    if (businessFilters.sortBy !== 'featured') parts.push(businessFilters.sortBy === 'recent' ? 'Newest' : 'A to Z');

    return parts;
  }, [businessFilters, selectedBusinessWilaya]);

  const openWilayaSheet = (currentId: number | null, onSelect: (item: Wilaya) => void) => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: 'Select Wilaya',
        items: wilayas,
        selectedId: currentId,
        onSelect: (item: TaxonomyItem) => onSelect(item as Wilaya),
      },
    });
  };

  const renderSummary = (items: string[]) => items.length > 0 ? (
    <View style={{ backgroundColor: '#0F172A', borderRadius: 20, padding: 18 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>Active Filters</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 }}>
        {items.map((item) => (
          <View key={item} style={{ backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFF' }}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  ) : null;

  const renderWilayaBlock = (selectedWilaya: Wilaya | undefined, onPress: () => void, onClear: () => void) => (
    <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
      <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Wilaya</Text>
      <TouchableOpacity
        onPress={onPress}
        style={{ marginTop: 16, height: 52, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: selectedWilaya ? '#0F172A' : '#94A3B8' }}>
          {selectedWilaya ? `${selectedWilaya.number} - ${selectedWilaya.code}` : 'Select wilaya'}
        </Text>
        <Text style={{ fontSize: 18, color: '#64748B' }}>⌄</Text>
      </TouchableOpacity>
      {selectedWilaya ? (
        <TouchableOpacity onPress={onClear} style={{ marginTop: 10, alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC' }}>Clear wilaya</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '900', color: '#0F172A' }}>{mode === 'products' ? 'Filter Products' : 'Filter Businesses'}</Text>
        <TouchableOpacity
          onPress={() => {
            if (mode === 'products') {
              resetProductFilters();
            } else {
              resetBusinessFilters();
            }
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        {mode === 'products' ? (
          <>
            {renderSummary(productSummary)}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Type</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                {[{ label: 'All', value: 'all' }, { label: 'Products', value: 'product' }, { label: 'Services', value: 'service' }].map((option) => {
                  const isActive = productFilters.productType === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => setLocalProductFilters((current) => ({ ...current, productType: option.value as any }))} style={{ flex: 1, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#137FEC' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderWilayaBlock(
              selectedProductWilaya,
              () => openWilayaSheet(productFilters.wilayaId, (item) => setLocalProductFilters((current) => ({ ...current, wilayaId: item.id }))),
              () => setLocalProductFilters((current) => ({ ...current, wilayaId: null }))
            )}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Categories</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, gap: 10 }}>
                {categories.map((category) => {
                  const isActive = productFilters.categoryIds.includes(category.id);
                  return (
                    <TouchableOpacity key={category.id} onPress={() => setLocalProductFilters((current) => ({ ...current, categoryIds: isActive ? current.categoryIds.filter((id) => id !== category.id) : [...current.categoryIds, category.id] }))} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: isActive ? '#DBEAFE' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: isActive ? '#137FEC' : '#475569' }}>{category.en || category.code}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Price Range</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', marginBottom: 8 }}>Min</Text>
                  <TextInput style={{ height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, color: '#0F172A', fontWeight: '700' }} keyboardType="numeric" value={String(productFilters.minPrice)} onChangeText={(value) => {
                    const parsed = Math.max(0, Math.min(STUDENT_CATALOG_MAX_PRICE, parseInt(value || '0', 10) || 0));
                    setLocalProductFilters((current) => ({ ...current, minPrice: Math.min(parsed, current.maxPrice) }));
                  }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', marginBottom: 8 }}>Max</Text>
                  <TextInput style={{ height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, color: '#0F172A', fontWeight: '700' }} keyboardType="numeric" value={String(productFilters.maxPrice)} onChangeText={(value) => {
                    const parsed = Math.max(0, Math.min(STUDENT_CATALOG_MAX_PRICE, parseInt(value || '0', 10) || 0));
                    setLocalProductFilters((current) => ({ ...current, maxPrice: Math.max(parsed, current.minPrice) }));
                  }} />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Safety Level</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, gap: 10 }}>
                {SAFETY_LEVELS.map((level) => {
                  const isActive = productFilters.safetyLevels.includes(level);
                  return (
                    <TouchableOpacity key={level} onPress={() => setLocalProductFilters((current) => ({ ...current, safetyLevels: isActive ? current.safetyLevels.filter((item) => item !== level) : [...current.safetyLevels, level] }))} style={{ width: 52, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#DBEAFE' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: isActive ? '#137FEC' : '#475569' }}>{level}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Sort By</Text>
              <View style={{ marginTop: 16, gap: 10 }}>
                {PRODUCT_SORT_OPTIONS.map((option) => {
                  const isActive = productFilters.sortBy === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => setLocalProductFilters((current) => ({ ...current, sortBy: option.value }))} style={{ height: 48, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? '#137FEC' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <>
            {renderSummary(businessSummary)}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Business Type</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                {[{ label: 'All', value: 'all' }, { label: 'Labs', value: 'laboratory' }, { label: 'Suppliers', value: 'supplier' }].map((option) => {
                  const isActive = businessFilters.businessType === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => setLocalBusinessFilters((current) => ({ ...current, businessType: option.value as any }))} style={{ flex: 1, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#137FEC' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderWilayaBlock(
              selectedBusinessWilaya,
              () => openWilayaSheet(businessFilters.wilayaId, (item) => setLocalBusinessFilters((current) => ({ ...current, wilayaId: item.id }))),
              () => setLocalBusinessFilters((current) => ({ ...current, wilayaId: null }))
            )}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Sort By</Text>
              <View style={{ marginTop: 16, gap: 10 }}>
                {BUSINESS_SORT_OPTIONS.map((option) => {
                  const isActive = businessFilters.sortBy === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => setLocalBusinessFilters((current) => ({ ...current, sortBy: option.value }))} style={{ height: 48, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? '#137FEC' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity
          style={{ height: 54, borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            if (mode === 'products') {
              setProductFilters(productFilters);
            } else {
              setBusinessFilters(businessFilters);
            }
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '900', color: '#FFF' }}>Apply Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 12, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            if (mode === 'products') {
              setLocalProductFilters(defaultStudentCatalogFilters);
            } else {
              setLocalBusinessFilters(defaultStudentBusinessFilters);
            }
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B' }}>Clear local changes</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
