import React from "react";
import { SearchScreen, DiscoverySection } from "./search-screen";
import { ApiRoutes } from "@/utils/api/api";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  products: { en: 'Products', fr: 'Produits', ar: 'منتجات' },
  suppliers: { en: 'Suppliers', fr: 'Fournisseurs', ar: 'موردون' },
  featured_suppliers: { en: 'Featured Suppliers', fr: 'Fournisseurs en vedette', ar: 'الموردون المميزون' },
  discovery_selection: { en: 'Discovery Selection', fr: 'Sélection découverte', ar: 'اختيار الاكتشاف' },
  new_equipment: { en: 'New Equipment', fr: 'Nouvel équipement', ar: 'معدات جديدة' },
  search_placeholder: { en: 'Search equipment, suppliers, production...', fr: 'Rechercher équipement, fournisseurs...', ar: 'بحث عن معدات، موردين...' },
};

export default function BusinessM2Navigation() {
  const { language } = useLanguageStore();
  const t = (key: keyof typeof translations) => translations[key][language as 'en' | 'fr' | 'ar'] || translations[key]['en'];

  const tabs: any[] = [
    {
      label: t('products'),
      key: "products",
      component: "ProductGrid",
    },
    {
      label: t('suppliers'),
      key: "suppliers",
      component: "LabGrid",
    },
  ];

  const discoverySections: DiscoverySection[] = [
    {
      title: t('featured_suppliers'),
      route: ApiRoutes.businesses.featuredSuppliers,
      type: "horizontal-business",
    },
    {
      title: t('discovery_selection'),
      route: ApiRoutes.searchLaboratoryRandom,
      type: "horizontal-business",
    },
    {
      title: t('new_equipment'),
      route: ApiRoutes.searchProducts + "?business_category_code=supplier",
      type: "vertical-products",
    },
  ];

  return (
    <SearchScreen
      placeholder={t('search_placeholder')}
      apiRoute={ApiRoutes.searchLaboratory}
      recentSearchesKey="business_recent_searches"
      discoverySections={discoverySections}
      tabs={tabs}
      accentColor="#8B5CF6"
    />
  );
}