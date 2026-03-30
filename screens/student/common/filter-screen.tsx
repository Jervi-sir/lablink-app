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
} from "@/screens/student/zustand/student-catalog-store";
import {
  defaultStudentBusinessFilters,
  useStudentBusinessSearchStore,
} from "@/screens/student/zustand/student-business-search-store";
import {
  defaultStudentLaboratoryServiceFilters,
  STUDENT_LABORATORY_SERVICE_MAX_PRICE,
  useStudentLaboratoryServiceStore,
} from "@/screens/student/zustand/student-laboratory-service-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import type { TaxonomyItem } from "@/action-sheets/taxonomy-selector-sheet";
import { useLanguageStore } from "@/zustand/language-store";

const SAFETY_LEVELS = [1, 2, 3, 4, 5];

const translations = {
  newest: { en: 'Newest', fr: 'Plus récent', ar: 'الأحدث' },
  price_low_high: { en: 'Price: Low to High', fr: 'Prix : Croissant', ar: 'السعر: من الأقل إلى الأعلى' },
  price_high_low: { en: 'Price: High to Low', fr: 'Prix : Décroissant', ar: 'السعر: من الأعلى إلى الأقل' },
  featured_first: { en: 'Featured First', fr: 'En vedette en premier', ar: 'المميزة أولاً' },
  a_z: { en: 'A to Z', fr: 'De A à Z', ar: 'من الألف إلى الياء' },
  products_title: { en: 'Products', fr: 'Produits', ar: 'المنتجات' },
  services_title: { en: 'Services', fr: 'Services', ar: 'الخدمات' },
  categories_unit: { en: 'categories', fr: 'catégories', ar: 'فئات' },
  safety_levels_unit: { en: 'safety levels', fr: 'niveaux de sécurité', ar: 'مستويات الأمان' },
  select_wilaya: { en: 'Select Wilaya', fr: 'Sélectionner la Wilaya', ar: 'اختر الولاية' },
  active_filters: { en: 'Active Filters', fr: 'Filtres actifs', ar: 'الفلاتر النشطة' },
  wilaya_label: { en: 'Wilaya', fr: 'Wilaya', ar: 'الولاية' },
  select_wilaya_placeholder: { en: 'Select wilaya', fr: 'Sélectionner la wilaya', ar: 'اختر ولاية' },
  clear_wilaya: { en: 'Clear wilaya', fr: 'Effacer la wilaya', ar: 'مسح الولاية' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  filter_businesses: { en: 'Filter Businesses', fr: 'Filtrer les entreprises', ar: 'تصفية الشركات' },
  filter_lab_services: { en: 'Filter Lab Services', fr: 'Filtrer les services de labo', ar: 'تصفية خدمات المختبر' },
  filter_products: { en: 'Filter Products', fr: 'Filtrer les produits', ar: 'تصفية المنتجات' },
  reset: { en: 'Reset', fr: 'Réinitialiser', ar: 'إعادة تعيين' },
  business_type: { en: 'Business Type', fr: 'Type d\'entreprise', ar: 'نوع العمل' },
  all: { en: 'All', fr: 'Tous', ar: 'الكل' },
  labs: { en: 'Labs', fr: 'Laboratoires', ar: 'مختبرات' },
  suppliers: { en: 'Suppliers', fr: 'Fournisseurs', ar: 'موردون' },
  sort_by: { en: 'Sort By', fr: 'Trier par', ar: 'فرز حسب' },
  type_label: { en: 'Type', fr: 'Type', ar: 'النوع' },
  categories_label: { en: 'Categories', fr: 'Catégories', ar: 'الفئات' },
  price_range: { en: 'Price Range', fr: 'Plage de prix', ar: 'نطاق السعر' },
  min_label: { en: 'Min', fr: 'Min', ar: 'الحد الأدنى' },
  max_label: { en: 'Max', fr: 'Max', ar: 'الحد الأقصى' },
  safety_level: { en: 'Safety Level', fr: 'Niveau de sécurité', ar: 'مستوى الأمان' },
  apply_filters: { en: 'Apply Filters', fr: 'Appliquer les filtres', ar: 'تطبيق الفلاتر' },
  clear_local: { en: 'Clear local changes', fr: 'Effacer les modifications locales', ar: 'مسح التعديلات المحلية' },
};

export default function FilterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;
  const mode: 'products' | 'businesses' | 'laboratory_services' = route.params?.mode || 'products';

  const PRODUCT_SORT_OPTIONS = [
    { label: t('newest'), value: "recent" },
    { label: t('price_low_high'), value: "price_asc" },
    { label: t('price_high_low'), value: "price_desc" },
  ] as const;

  const BUSINESS_SORT_OPTIONS = [
    { label: t('featured_first'), value: "featured" },
    { label: t('newest'), value: "recent" },
    { label: t('a_z'), value: "name" },
  ] as const;

  const savedProductFilters = useStudentCatalogStore((state) => state.filters);
  const setProductFilters = useStudentCatalogStore((state) => state.setFilters);
  const resetProductFilters = useStudentCatalogStore((state) => state.resetFilters);

  const savedBusinessFilters = useStudentBusinessSearchStore((state) => state.filters);
  const setBusinessFilters = useStudentBusinessSearchStore((state) => state.setFilters);
  const resetBusinessFilters = useStudentBusinessSearchStore((state) => state.resetFilters);

  const savedLabFilters = useStudentLaboratoryServiceStore((state) => state.filters);
  const setLabFilters = useStudentLaboratoryServiceStore((state) => state.setFilters);
  const resetLabFilters = useStudentLaboratoryServiceStore((state) => state.resetFilters);

  const [categories, setCategories] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [productFilters, setLocalProductFilters] = useState(savedProductFilters);
  const [businessFilters, setLocalBusinessFilters] = useState(savedBusinessFilters);
  const [labFilters, setLocalLabFilters] = useState(savedLabFilters);

  useEffect(() => {
    setLocalProductFilters(savedProductFilters);
  }, [savedProductFilters]);

  useEffect(() => {
    setLocalBusinessFilters(savedBusinessFilters);
  }, [savedBusinessFilters]);

  useEffect(() => {
    setLocalLabFilters(savedLabFilters);
  }, [savedLabFilters]);

  useEffect(() => {
    const loadTaxonomies = async () => {
      try {
        const types = mode === 'businesses' ? 'wilayas' : 'product_categories,wilayas';
        const response: any = await api.get(buildRoute(ApiRoutes.taxonomies), {
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
  const selectedLabWilaya = wilayas.find((wilaya) => wilaya.id === labFilters.wilayaId);

  const productSummary = useMemo(() => {
    const parts: string[] = [];

    if (productFilters.productType !== 'all') parts.push(productFilters.productType === 'product' ? t('products_title') : t('services_title'));
    if (selectedProductWilaya) parts.push(selectedProductWilaya[language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en')] || selectedProductWilaya.code);
    if (productFilters.categoryIds.length > 0) parts.push(`${productFilters.categoryIds.length} ${t('categories_unit')}`);
    if (productFilters.safetyLevels.length > 0) parts.push(`${productFilters.safetyLevels.length} ${t('safety_levels_unit')}`);
    if (productFilters.minPrice > 0 || productFilters.maxPrice < STUDENT_CATALOG_MAX_PRICE) {
      parts.push(`${productFilters.minPrice.toLocaleString()}-${productFilters.maxPrice.toLocaleString()} DA`);
    }

    return parts;
  }, [productFilters, selectedProductWilaya, language, t]);

  const businessSummary = useMemo(() => {
    const parts: string[] = [];
    if (businessFilters.businessType !== 'all') parts.push(businessFilters.businessType === 'laboratory' ? t('labs') : t('suppliers'));
    if (selectedBusinessWilaya) parts.push(selectedBusinessWilaya[language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en')] || selectedBusinessWilaya.code);
    return parts;
  }, [businessFilters, selectedBusinessWilaya, language, t]);

  const labSummary = useMemo(() => {
    const parts: string[] = [];

    if (labFilters.productType !== 'all') parts.push(labFilters.productType === 'product' ? t('products_title') : t('services_title'));
    if (selectedLabWilaya) parts.push(selectedLabWilaya[language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en')] || selectedLabWilaya.code);
    if (labFilters.categoryIds.length > 0) parts.push(`${labFilters.categoryIds.length} ${t('categories_unit')}`);
    if (labFilters.minPrice > 0 || labFilters.maxPrice < STUDENT_LABORATORY_SERVICE_MAX_PRICE) {
      parts.push(`${labFilters.minPrice.toLocaleString()}-${labFilters.maxPrice.toLocaleString()} DA`);
    }

    return parts;
  }, [labFilters, selectedLabWilaya, language, t]);

  const openWilayaSheet = (currentId: number | null, onSelect: (item: Wilaya) => void) => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: t('select_wilaya'),
        items: wilayas,
        selectedId: currentId,
        onSelect: (item: TaxonomyItem) => onSelect(item as Wilaya),
      },
    });
  };

  const renderSummary = (items: string[]) => items.length > 0 ? (
    <View style={{ backgroundColor: '#0F172A', borderRadius: 20, padding: 18 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('active_filters')}</Text>
      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 }}>
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
      <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('wilaya_label')}</Text>
      <TouchableOpacity
        onPress={onPress}
        style={{ marginTop: 16, height: 52, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: selectedWilaya ? '#0F172A' : '#94A3B8' }}>
          {selectedWilaya ? `${selectedWilaya.number} - ${selectedWilaya[language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en')] || selectedWilaya.code}` : t('select_wilaya_placeholder')}
        </Text>
        <Text style={{ fontSize: 18, color: '#64748B' }}>⌄</Text>
      </TouchableOpacity>
      {selectedWilaya ? (
        <TouchableOpacity onPress={onClear} style={{ marginTop: 10, alignSelf: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC' }}>{t('clear_wilaya')}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>{t('cancel')}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '900', color: '#0F172A' }}>
          {mode === 'businesses' ? t('filter_businesses') : mode === 'laboratory_services' ? t('filter_lab_services') : t('filter_products')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (mode === 'products') {
              resetProductFilters();
            } else if (mode === 'businesses') {
              resetBusinessFilters();
            } else {
              resetLabFilters();
            }
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>{t('reset')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        {mode === 'businesses' ? (
          <>
            {renderSummary(businessSummary)}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('business_type')}</Text>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 10, marginTop: 16 }}>
                {[{ label: t('all'), value: 'all' }, { label: t('labs'), value: 'laboratory' }, { label: t('suppliers'), value: 'supplier' }].map((option) => {
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
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('sort_by')}</Text>
              <View style={{ marginTop: 16, gap: 10 }}>
                {BUSINESS_SORT_OPTIONS.map((option) => {
                  const isActive = businessFilters.sortBy === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => setLocalBusinessFilters((current) => ({ ...current, sortBy: option.value }))} style={{ height: 48, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? '#137FEC' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <>
            {renderSummary(mode === 'products' ? productSummary : labSummary)}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('type_label')}</Text>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 10, marginTop: 16 }}>
                {[{ label: t('all'), value: 'all' }, { label: t('products_title'), value: 'product' }, { label: t('services_title'), value: 'service' }].map((option) => {
                  const filters_to_use = mode === 'products' ? productFilters : labFilters;
                  const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                  const isActive = filters_to_use.productType === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => set_filters_to_use((current: any) => ({ ...current, productType: option.value as any }))} style={{ flex: 1, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#137FEC' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {renderWilayaBlock(
              mode === 'products' ? selectedProductWilaya : selectedLabWilaya,
              () => {
                const filters_to_use = mode === 'products' ? productFilters : labFilters;
                const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                openWilayaSheet(filters_to_use.wilayaId, (item) => set_filters_to_use((current: any) => ({ ...current, wilayaId: item.id })));
              },
              () => {
                const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                set_filters_to_use((current: any) => ({ ...current, wilayaId: null }));
              }
            )}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('categories_label')}</Text>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap', marginTop: 16, gap: 10 }}>
                {categories.map((category) => {
                  const filters_to_use = mode === 'products' ? productFilters : labFilters;
                  const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                  const isActive = filters_to_use.categoryIds.includes(category.id);
                  return (
                    <TouchableOpacity key={category.id} onPress={() => set_filters_to_use((current: any) => ({ ...current, categoryIds: isActive ? current.categoryIds.filter((id: number) => id !== category.id) : [...current.categoryIds, category.id] }))} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: isActive ? '#DBEAFE' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: isActive ? '#137FEC' : '#475569' }}>{category[language === 'ar' ? 'ar' : (language === 'fr' ? 'fr' : 'en')] || category.code}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('price_range')}</Text>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, marginTop: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('min_label')}</Text>
                  <TextInput
                    style={{ height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, color: '#0F172A', fontWeight: '700', textAlign: language === 'ar' ? 'right' : 'left' }}
                    keyboardType="numeric"
                    value={String(mode === 'products' ? productFilters.minPrice : labFilters.minPrice)}
                    onChangeText={(value) => {
                      const max_limit = mode === 'products' ? STUDENT_CATALOG_MAX_PRICE : STUDENT_LABORATORY_SERVICE_MAX_PRICE;
                      const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                      const parsed = Math.max(0, Math.min(max_limit, parseInt(value || '0', 10) || 0));
                      set_filters_to_use((current: any) => ({ ...current, minPrice: Math.min(parsed, current.maxPrice) }));
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('max_label')}</Text>
                  <TextInput
                    style={{ height: 48, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, color: '#0F172A', fontWeight: '700', textAlign: language === 'ar' ? 'right' : 'left' }}
                    keyboardType="numeric"
                    value={String(mode === 'products' ? productFilters.maxPrice : labFilters.maxPrice)}
                    onChangeText={(value) => {
                      const max_limit = mode === 'products' ? STUDENT_CATALOG_MAX_PRICE : STUDENT_LABORATORY_SERVICE_MAX_PRICE;
                      const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                      const parsed = Math.max(0, Math.min(max_limit, parseInt(value || '0', 10) || 0));
                      set_filters_to_use((current: any) => ({ ...current, maxPrice: Math.max(parsed, current.minPrice) }));
                    }}
                  />
                </View>
              </View>
            </View>

            {mode === 'products' ? (
              <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
                <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('safety_level')}</Text>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap', marginTop: 16, gap: 10 }}>
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
            ) : null}

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('sort_by')}</Text>
              <View style={{ marginTop: 16, gap: 10 }}>
                {PRODUCT_SORT_OPTIONS.map((option) => {
                  const filters_to_use = mode === 'products' ? productFilters : labFilters;
                  const set_filters_to_use = mode === 'products' ? setLocalProductFilters : setLocalLabFilters;
                  const isActive = filters_to_use.sortBy === option.value;
                  return (
                    <TouchableOpacity key={option.value} onPress={() => set_filters_to_use((current: any) => ({ ...current, sortBy: option.value }))} style={{ height: 48, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
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
            } else if (mode === 'businesses') {
              setBusinessFilters(businessFilters);
            } else {
              setLabFilters(labFilters);
            }
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '900', color: '#FFF' }}>{t('apply_filters')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 12, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            if (mode === 'products') {
              setLocalProductFilters(defaultStudentCatalogFilters);
            } else if (mode === 'businesses') {
              setLocalBusinessFilters(defaultStudentBusinessFilters);
            } else {
              setLocalLabFilters(defaultStudentLaboratoryServiceFilters);
            }
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B' }}>{t('clear_local')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
