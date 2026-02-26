import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Routes } from "@/utils/helpers/routes";
import { OrderCard1 } from "../components/cards/order-card-1";
import { ButtonTag } from "../components/buttons/button-tag";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";

const { width } = Dimensions.get('window');

const TABS = ['All', 'In Progress', 'Completed'];

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'in progress': return '#137FEC';
    case 'pending': return '#F59E0B';
    case 'completed': return '#10B981';
    case 'cancelled': return '#EF4444';
    default: return '#64748B';
  }
};

export default function StudentM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = useCallback(async (page: number | null, refreshing = false) => {
    if (page === null) return;

    if (refreshing) setIsRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      let statusParam = undefined;
      if (activeTab === 'In Progress') statusParam = 'pending';
      else if (activeTab === 'Completed') statusParam = 'delivered';

      const response: any = await api.get(ApiRoutes.orders.index, {
        params: {
          page,
          status: statusParam
        }
      });

      const newOrders = response.data || [];
      if (refreshing || page === 1) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }
      setNextPage(response.next_page);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const onRefresh = () => {
    fetchOrders(1, true);
  };

  const loadMore = () => {
    if (!isLoadingMore && nextPage) {
      fetchOrders(nextPage);
    }
  };

  const navigateToDetail = (order: any) => {
    navigation.navigate(Routes.OrderDetailScreen, { order });
  };

  const formatOrderData = (item: any) => ({
    id: item.code,
    date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: item.status?.name || 'Unknown',
    statusColor: getStatusColor(item.status?.name),
    lab: item.products?.[0]?.business?.name || 'Laboratory',
    product: item.products?.[0]?.name + (item.products?.length > 1 ? ` (+${item.products.length - 1} more)` : ''),
    price: `${item.total_price?.toLocaleString()} DA`,
    original: item,
  });

  const renderOrder = ({ item }: { item: any }) => (
    <OrderCard1
      item={formatOrderData(item)}
      onPress={() => navigateToDetail(item)}
    />
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>My Orders</Text>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        {TABS.map(tab => (
          <ButtonTag
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {isLoading && orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
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
              <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '600' }}>No orders found</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}