import React from "react";
import { SearchScreen, DiscoverySection } from "./search-screen";
import { ApiRoutes } from "@/utils/api/api";

export default function BusinessM2Navigation() {
  const tabs: any[] = [
    {
      label: "Products",
      key: "products",
      component: "ProductGrid",
    },
    {
      label: "Suppliers",
      key: "suppliers",
      component: "LabGrid",
    },
  ];

  const discoverySections: DiscoverySection[] = [
    {
      title: "Featured Suppliers",
      route: ApiRoutes.businesses.featuredSuppliers,
      type: "horizontal-business",
    },
    {
      title: "Discovery Selection",
      route: ApiRoutes.searchLaboratoryRandom,
      type: "horizontal-business",
    },
    {
      title: "New Equipment",
      route: ApiRoutes.searchProducts + "?business_category_code=supplier",
      type: "vertical-products",
    },
  ];

  return (
    <SearchScreen
      placeholder="Search equipment, suppliers, production..."
      apiRoute={ApiRoutes.searchLaboratory}
      recentSearchesKey="business_recent_searches"
      discoverySections={discoverySections}
      tabs={tabs}
      accentColor="#8B5CF6"
    />
  );
}