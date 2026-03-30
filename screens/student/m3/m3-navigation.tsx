import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Routes } from "@/utils/helpers/routes";
import { OrderCard1 } from "../../../components/cards/order-card-1";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import moment from "moment";
import { Image } from "react-native";

const VIEW_TABS = ['Orders', 'Estimations', 'Cart'] as const;

const getStatusColor = (status: unknown) => {
  if (typeof status !== 'string') {
    return '#64748B';
  }

  switch (status.toLowerCase()) {
    case 'pending': return '#F59E0B';
    case 'confirmed': return '#137FEC';
    case 'shipped': return '#8B5CF6';
    case 'delivered': return '#10B981';
    case 'completed': return '#10B981';
    case 'quoted': return '#137FEC';
    case 'reviewed': return '#8B5CF6';
    case 'cancelled': return '#EF4444';
    default: return '#64748B';
  }
};

const capitalize = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'Unknown';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function StudentM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<(typeof VIEW_TABS)[number]>('Orders');
  const carts = useLabCartStore((state) => state.carts);
  const [items, setItems] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchItems = useCallback(async (page: number | null, refreshing = false) => {
    if (activeTab === 'Cart') return;
    if (page === null) return;

    if (refreshing) setIsRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const route = activeTab === 'Orders'
        ? ApiRoutes.orders.index
        : ApiRoutes.estimationRequests.index;

      const response: any = await api.get(route, {
        params: {
          page,
        }
      });

      const newItems = response.data || [];
      if (refreshing || page === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      setNextPage(response.next_page);
    } catch (error) {
      console.error(`Error fetching ${activeTab?.toLowerCase()}:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems(1);
  }, [activeTab, fetchItems]);

  const onRefresh = () => {
    fetchItems(1, true);
  };

  const loadMore = () => {
    if (!isLoadingMore && nextPage) {
      fetchItems(nextPage);
    }
  };

  const navigateToDetail = (order: any) => {
    navigation.navigate(Routes.OrderDetailScreen, { order });
  };

  const formatOrderData = (item: any) => ({
    id: item.code,
    date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: capitalize(item.status?.code) || 'Unknown',
    statusColor: getStatusColor(item.status?.code),
    lab: item.products?.[0]?.business?.name || 'Laboratory',
    product: item.products?.[0]?.name + (item.products?.length > 1 ? ` (+${item.products.length - 1} more)` : ''),
    price: `${item.total_price?.toLocaleString()} DA`,
    original: item,
    productImages: (item.products || []).slice(0, 3).map((p: any) => p.images?.[0]?.url).filter(Boolean),
    totalProducts: item.products?.length || 0,
  });

  const formatEstimationData = (item: any) => ({
    id: item.code,
    date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: capitalize(item.status) || 'Unknown',
    statusColor: getStatusColor(item.status),
    lab: item.business?.name || 'Laboratory',
    product: item.items?.[0]?.productName
      ? item.items[0].productName + (item.items.length > 1 ? ` (+${item.items.length - 1} more)` : '')
      : `${item.itemCount || 0} selected item${item.itemCount === 1 ? '' : 's'}`,
    price: item.estimatedTotal ? `${Number(item.estimatedTotal).toLocaleString()} DA` : 'Awaiting estimate',
    original: item,
    productImages: (item.items || []).slice(0, 3).map((it: any) => it.product?.images?.[0]?.url).filter(Boolean),
    totalProducts: item.items?.length || 0,
  });

  const renderOrder = ({ item }: { item: any }) => (
    <OrderCard1
      item={activeTab === 'Orders' ? formatOrderData(item) : formatEstimationData(item)}
      onPress={() => {
        if (activeTab === 'Orders') {
          navigateToDetail(item);
          return;
        }

        navigation.navigate(Routes.EstimationDetailScreen, { estimation: item });
      }}
    />
  );

  const renderCart = ({ item }: { item: any }) => {
    const business = item.business;
    const itemsCount = item.items.length;
    const total = item.items.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0);
    const date = moment(item.updatedAt).fromNow();

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.LabEstimationScreen, { businessId: business.id })}
        style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
            {business.logo ? (
              <Image source={{ uri: business.logo }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
            ) : (
              <Text style={{ fontSize: 20 }}>🏢</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{business.name}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{date} • {itemsCount} items</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC' }}>{total.toLocaleString()} DA</Text>
            <View style={{ marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#EFF6FF', borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#137FEC' }}>DRAFT</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, paddingBottom: 16, paddingTop: 10, gap: 10 }}>
        {VIEW_TABS.map(tab => {
          const isActive = activeTab === tab;

          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isActive ? '#137FEC' : '#FFF',
                borderWidth: 1,
                borderColor: isActive ? '#137FEC' : '#E2E8F0',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'Cart' ? Object.values(carts) : items}
          renderItem={activeTab === 'Cart' ? renderCart : renderOrder}
          keyExtractor={item => (activeTab === 'Cart' ? item.business.id.toString() : item.id.toString())}
          contentContainerStyle={{ padding: paddingHorizontal, paddingTop: 0, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator style={{ marginVertical: 20 }} color="#137FEC" />
            ) : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '600' }}>
                {activeTab === 'Orders' ? 'No orders found' : activeTab === 'Estimations' ? 'No estimation requests found' : 'Your cart is empty'}
              </Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}
