import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, FlatList, Dimensions, ActivityIndicator, RefreshControl, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import PlusIcon from "@/assets/icons/plus-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import SearchIcon from "@/assets/icons/search-icon";
import { useInventoryStore } from "../zustand/inventory-store";
import { useAuthStore } from "@/zustand/auth-store";

export default function BusinessM1Navigation() {
  const navigation = useNavigation<any>();
  const auth = useAuthStore((s) => s.auth);
  const {
    products,
    total,
    nextPage,
    isLoading,
    isRefreshing,
    isLoadingMore,
    fetchInventory,
    updateProductLocal,
    deleteProductLocal
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const isFirstRender = useRef(true);

  const TABS = ['All', 'Active', 'Out of Stock', 'Draft'];

  const handleFetchInventory = useCallback(async (page: number = 1, shouldRefresh: boolean = false) => {
    await fetchInventory(page, shouldRefresh, searchQuery, activeTab);
  }, [searchQuery, activeTab, fetchInventory]);

  useEffect(() => {
    handleFetchInventory(1);
  }, [activeTab]);

  // Debounced search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      handleFetchInventory(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    handleFetchInventory(1, true);
  };

  const onLoadMore = () => {
    if (nextPage && !isLoadingMore) {
      handleFetchInventory(nextPage);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(buildRoute(ApiRoutes.products.destroy, { id: productId }));
              deleteProductLocal(productId);
              Alert.alert("Success", "Product removed from inventory");
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product");
            }
          }
        }
      ]
    );
  };

  const handleToggleVisibility = async (product: any) => {
    try {
      const newStatus = !product.isAvailable;
      await api.put(buildRoute(ApiRoutes.products.update, { id: product.id }), {
        is_available: newStatus
      });
      updateProductLocal(product.id, { isAvailable: newStatus });
    } catch (error) {
      console.error("Error toggling product visibility:", error);
      Alert.alert("Error", "Failed to update product visibility");
    }
  };

  const getProductStatus = (item: any) => {
    if (!item.isAvailable) return 'Draft';
    if (item.stock === 0) return 'Out of Stock';
    return 'Active';
  };

  const renderProductItem = ({ item }: { item: any }) => {
    const status = getProductStatus(item);
    return (
      <View style={{
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
      }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, { product: item })}
          activeOpacity={0.7}
        >
          {/* Image */}
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            backgroundColor: '#F8F9FB',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F1F5F9',
            overflow: 'hidden',
          }}>
            {item.images && item.images.length > 0 ? (
              <Image
                source={{ uri: item.images[0].url }}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            ) : (
              <Text style={{ fontSize: 36 }}>📦</Text>
            )}
          </View>

          {/* Details & Actions */}
          <View style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#94A3B8',
                textTransform: 'uppercase',
              }}>{item.category?.code || 'Product'}</Text>
              <View style={[
                { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
                status === 'Active' ? { backgroundColor: '#F0FDF4' } :
                  status === 'Draft' ? { backgroundColor: '#F1F5F9' } : { backgroundColor: '#FEF2F2' }
              ]}>
                <Text style={[
                  { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
                  status === 'Active' ? { color: '#16A34A' } :
                    status === 'Draft' ? { color: '#64748B' } : { color: '#EF4444' }
                ]}>{status}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#8B5CF6' }}>{item.price.toLocaleString()} DA</Text>
              <Text style={[{ fontSize: 12, fontWeight: '600', color: '#64748B' }, item.stock === 0 && { color: '#EF4444' }]}>
                {item.stock} in stock
              </Text>
            </View>

            {/* Action Buttons as horizontal pills */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 8, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); navigation.navigate(Routes.EditCreateProductScreen, { product: item }); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 8, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); handleToggleVisibility(item); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>{item.isAvailable ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FEF2F2', borderRadius: 8, alignItems: 'center' }}
                onPress={(e) => { e.stopPropagation(); handleDeleteProduct(item.id); }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* 1. Header Section */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: paddingHorizontal,
        paddingTop: 8,
        marginBottom: 4,
        gap: 4,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>Inventory</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>
            {total} {total === 1 ? 'Product' : 'Products'} listed
          </Text>
        </View>
        {
          auth?.businessProfile?.category?.code === 'laboratory'
          &&
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', gap: 6 }}
            onPress={() => navigation.navigate(Routes.LabOrdersScreen)}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#137FEC' }}>🛍️ My Orders</Text>
          </TouchableOpacity>
        }
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: paddingHorizontal,
        marginBottom: 8,
        gap: 12,
      }}>
        <View style={{
          flex: 1, gap: 8,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFF',
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 48,
          borderWidth: 1,
          borderColor: '#E2E8F0',
        }}>
          <SearchIcon />
          <TextInput
            style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111' }}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#8B5CF6',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen)}
        >
          <PlusIcon color="#F5F5F5" />
        </TouchableOpacity>
      </View>

      {/* 2. Search & Filters */}
      <View style={{ marginBottom: 4 }}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4, paddingHorizontal: paddingHorizontal }}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
                activeTab === tab && { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[{ fontSize: 14, fontWeight: '700', color: '#6B7280' }, activeTab === tab && { color: '#FFF' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Product List */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: paddingHorizontal, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color="#8B5CF6" style={{ paddingVertical: 20 }} /> : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>No products found</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Try adjusting your filters or search query</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}