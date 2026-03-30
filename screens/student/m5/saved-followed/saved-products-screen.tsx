import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { ProductCard1 } from "@/components/cards/product-card-1";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  saved_products: { en: 'Saved Products', fr: 'Produits enregistrés', ar: 'المنتجات المحفوظة' },
  no_saved_products: { en: 'No saved products yet.', fr: 'Pas encore de produits enregistrés.', ar: 'لا توجد منتجات محفوظة حتى الآن.' },
  unknown_lab: { en: 'Unknown Lab', fr: 'Laboratoire inconnu', ar: 'مختبر غير معروف' },
};

export default function StudentSavedProductsScreen() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  const fetchSavedProducts = useCallback(async () => {
    try {
      const response: any = await api.get(ApiRoutes.collections.savedProducts);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching saved products:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedProducts();
  }, [fetchSavedProducts]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchSavedProducts();
  };

  const toggleSaveProduct = useCallback(async (productId: string) => {
    if (savingProductId) return;
    try {
      setSavingProductId(productId);
      const response = await api.post(buildRoute(ApiRoutes.products.toggleSave, { id: productId }));
      if (response && !response.isSaved) {
        setProducts(prev => prev.filter(p => p.id.toString() !== productId));
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setSavingProductId(null);
    }
  }, [savingProductId]);

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard1
      product={{
        ...item,
        lab: item.business?.name || t('unknown_lab'),
        price: typeof item.price === 'number' ? `${item.price.toLocaleString()} DA` : item.price || '0 DA',
        isSaved: true,
      }}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
      onToggleSave={() => toggleSaveProduct(item.id.toString())}
      isSaving={savingProductId === item.id.toString()}
      style={{ marginBottom: 16 }}
    />
  );

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('saved_products')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#137FEC" size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: paddingHorizontal, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between', flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, height: 400, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15, textAlign: 'center' }}>{t('no_saved_products')}</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

