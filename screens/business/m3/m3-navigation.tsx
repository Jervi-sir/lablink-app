import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, FlatList, Dimensions, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import moment from "moment";
import { paddingHorizontal } from "@/utils/variables/styles";
import SearchIcon from "@/assets/icons/search-icon";

const { width } = Dimensions.get('window');

export default function BusinessM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, processing: 0, ready: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const isFirstRender = useRef(true);



  const fetchOrders = useCallback(async (page: number = 1, shouldRefresh: boolean = false) => {
    if (page === 1 && !shouldRefresh) setIsLoading(true);
    if (page > 1) setIsLoadingMore(true);

    try {
      const response: any = await api.get(ApiRoutes.orders.businessOrders, {
        params: {
          page,
          search: searchQuery,
          status: activeTab,
          per_page: 10
        }
      });

      if (shouldRefresh || page === 1) {
        setOrders(response.data || []);
      } else {
        setOrders(prev => [...prev, ...(response.data || [])]);
      }
      setNextPage(response.next_page);
      if (response.counts) {
        setCounts(response.counts);
      }
    } catch (error) {
      console.error("Error fetching business orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    fetchOrders(1);
  }, [activeTab]);

  // Debounced search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchOrders(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    const amount = item.total_price ? `${item.total_price.toLocaleString()} DA` : '0 DA';
    const studentName = item.user?.studentProfile?.fullname || 'Unknown Researcher';

    // Get summary of items
    const itemsSummary = item.products?.map((p: any) => `${p.name} x${p.pivot?.quantity}`).join(', ') || 'No items';

    return (
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
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
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{studentName}</Text>
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 }} numberOfLines={1}>{itemsSummary}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Total</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{amount}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={{ flex: 2, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3FF' }}
            onPress={() => navigation.navigate(Routes.BusinessOrderDetailScreen, { order: item })}
          >
            <Text style={{ color: '#8B5CF6', fontSize: 13, fontWeight: '800' }}>Manage Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate(Routes.BusinessInvoiceScreen, { order: item })}
          >
            <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>Invoicing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* 1. Dashboard Header */}
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: paddingHorizontal, paddingTop: 16, marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>Order Hub</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>Manage procurement requests</Text>
        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' }}
          onPress={() => onRefresh()}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: counts.pending > 0 ? '#8B5CF6' : '#94A3B8', marginRight: 8 }} />
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#111' }}>{counts.pending} New</Text>
        </TouchableOpacity>
      </View> */}

      {/* 3. Search Bar */}
      <View style={{ paddingHorizontal: paddingHorizontal, marginTop: 8 }}>
        <View style={{
          flexDirection: 'row', gap: 8,
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
            placeholder="Search Order ID or Researcher..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 2. Quick Metrics Row */}
      <View style={{ paddingVertical: 8, }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: paddingHorizontal,
            gap: 12,
          }}
        >
          <MetricCard
            label="All"
            value={counts.pending + counts.processing + counts.ready + counts.completed}
            isActive={activeTab === 'All'}
            onPress={() => setActiveTab('All')}
          />
          <MetricCard
            label="Pending"
            value={counts.pending}
            color="#8B5CF6"
            isActive={activeTab === 'Pending'}
            onPress={() => setActiveTab('Pending')}
          />
          <MetricCard
            label="Processing"
            value={counts.processing}
            color="#F59E0B"
            isActive={activeTab === 'Processing'}
            onPress={() => setActiveTab('Processing')}
          />
          <MetricCard
            label="Ready"
            value={counts.ready}
            color="#10B981"
            isActive={activeTab === 'Ready'}
            onPress={() => setActiveTab('Ready')}
          />
          <MetricCard
            label="Done"
            value={counts.completed}
            color="#64748B"
            isActive={activeTab === 'Done'}
            onPress={() => setActiveTab('Done')}
          />
        </ScrollView>
      </View>

      {/* 4. Order List */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
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
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📂</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>No Orders Found</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Adjust your filters or search criteria</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

function MetricCard({ label, value, color, isActive, onPress }: { label: string, value: number, color?: string, isActive?: boolean, onPress?: () => void }) {
  const activeColor = color || '#8B5CF6';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        minWidth: 60,
        backgroundColor: isActive ? activeColor : '#FFF',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isActive ? activeColor : '#F1F5F9',
        shadowColor: activeColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isActive ? 0.3 : 0,
        shadowRadius: 10,
        elevation: isActive ? 4 : 0,
      }}>
      <Text style={{ fontSize: 14, fontWeight: 700, color: isActive ? 'rgba(255,255,255,0.7)' : '#94A3B8', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#FFF' : '#111' }}>({value})</Text>
    </TouchableOpacity>
  );
}