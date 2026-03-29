import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import moment from "moment";
import { paddingHorizontal } from "@/utils/variables/styles";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function LabOrdersScreen() {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);

  const fetchOrders = useCallback(async (page: number = 1, shouldRefresh: boolean = false) => {
    if (page === 1 && !shouldRefresh) setIsLoading(true);
    if (page > 1) setIsLoadingMore(true);

    try {
      const response: any = await api.get(buildRoute(ApiRoutes.orders.laboratoryOrders), {
        params: { page, per_page: 10 }
      });

      const data = response.data?.data || response.data || [];
      const np = response.data?.next_page || response.next_page;

      if (shouldRefresh || page === 1) {
        setOrders(data);
      } else {
        setOrders(prev => [...prev, ...data]);
      }
      setNextPage(np);
    } catch (error) {
      console.error("Error fetching laboratory orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(1, true);
  };

  const onLoadMore = () => {
    if (nextPage && !isLoadingMore) {
      fetchOrders(nextPage);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#F5F3FF', text: '#8B5CF6' };
      case 'processing': return { bg: '#FFF7ED', text: '#F59E0B' };
      case 'ready': return { bg: '#ECFDF5', text: '#10B981' };
      case 'done': return { bg: '#F1F5F9', text: '#64748B' };
      case 'cancelled': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F8FAFC', text: '#94A3B8' };
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status?.code);
    const date = item.created_at ? moment(item.created_at).format('DD MMM, HH:mm') : 'N/A';
    const amount = item.total_price ? `${parseFloat(item.total_price).toLocaleString()} DA` : '0 DA';
    const supplierName = item.products?.[0]?.business?.name || 'Supplier';

    return (
      <TouchableOpacity 
        style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.OrderDetailScreen, { orderId: item.id, order: item })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{item.code}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{date}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: statusStyle.bg }}>
            <Text style={{ fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: statusStyle.text }}>{item.status?.code || 'Unknown'}</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 14 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
            {item.products && item.products[0]?.images && item.products[0].images.length > 0 ? (
              <Image
                source={{ uri: item.products[0].images[0].url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 24 }}>📦</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{supplierName}</Text>
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 }}>{item.products?.length} items</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Total Paid</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginLeft: 12 }}>My Lab Orders</Text>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: paddingHorizontal, paddingBottom: 40 }}
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
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>No Orders Yet</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Orders you place to suppliers will appear here.</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}
