import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import ArrowIcon from "@/assets/icons/arrow-icon";
import RevenueIcon from "@/assets/icons/revenue-icon";
import ProductIcon from "@/assets/icons/product-icon";
import ProfileIcon from "@/assets/icons/profile-icon";
import OrderIcon from "@/assets/icons/order-icon";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 16) / 2;

export default function BusinessM1Navigation() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [profileRes, statsRes, ordersRes]: any = await Promise.all([
        api.get(ApiRoutes.auth.business.me),
        api.get(ApiRoutes.stats),
        api.get(ApiRoutes.orders.businessOrders, { params: { per_page: 5 } })
      ]);

      setBusiness(profileRes.user?.businessProfile);
      setStats(statsRes);
      setRecentOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const METRICS = [
    { id: '1', label: 'Est. Earnings', value: `${stats?.earnings || 0} DA`, icon: <RevenueIcon />, color: '#8B5CF6' },
    { id: '2', label: 'Active Orders', value: `${stats?.active_orders || 0}`, icon: <OrderIcon />, color: '#3B82F6' },
    { id: '3', label: 'Total Products', value: `${stats?.products || 0}`, icon: <ProductIcon />, color: '#F59E0B' },
    { id: '4', label: 'Lab Followers', value: `${stats?.followers || 0}`, icon: <ProfileIcon />, color: '#10B981' },
  ];

  if (loading && !refreshing) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: paddingHorizontal, paddingTop: 8, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />}
      >

        {/* 1. Dashboard Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Workspace</Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#1E293B', marginTop: 4 }} numberOfLines={1}>{business?.name || 'Laboratory Tool'}</Text>
          </View>
          <TouchableOpacity
            style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, borderWidth: 1, borderColor: '#F1F5F9' }}
            onPress={() => navigation.navigate(Routes.BusinessM5Navigation)}
          >
            <Text style={{ fontSize: 22 }}>🔬</Text>
            <View style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#10B981', borderWidth: 3, borderColor: '#FFF' }} />
          </TouchableOpacity>
        </View>

        {/* 2. Key Metrics Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          {METRICS.map(stat => (
            <View key={stat.id} style={{
              width: CARD_WIDTH,
              backgroundColor: '#FFF',
              padding: 18,
              borderRadius: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.03,
              shadowRadius: 10,
              elevation: 2,
              borderWidth: 1,
              borderColor: '#F8FAFC'
            }}>
              <View style={{ width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 14, backgroundColor: stat.color + '10' }}>
                {stat.icon}
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', marginBottom: 6 }}>{stat.label}</Text>
              <Text style={{ fontSize: 19, fontWeight: '900', color: '#1E293B' }}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* 3. Quick Actions Banner */}
        <View style={{ backgroundColor: '#111827', borderRadius: 28, padding: 24, flexDirection: 'row', overflow: 'hidden', marginBottom: 32, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 6 }}>
          <View style={{ flex: 1, zIndex: 2 }}>
            <View style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 }}>
              <Text style={{ color: '#A78BFA', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>Growth</Text>
            </View>
            <Text style={{ color: '#FFF', fontSize: 19, fontWeight: '900', marginBottom: 8 }}>Ready to expand?</Text>
            <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 20, marginBottom: 20, fontWeight: '500' }}>Upload new inventory items to reach more researchers in your region.</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 22, paddingVertical: 14, borderRadius: 16, alignSelf: 'flex-start', shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }}
              onPress={() => navigation.navigate(Routes.EditCreateProductScreen)}
            >
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '800' }}>Add New Product</Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: 'absolute', right: -40, top: -20, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(139, 92, 246, 0.1)' }} />
        </View>

        {/* 4. Recent Orders (Proposals) */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 19, fontWeight: '900', color: '#1E293B' }}>Recent Orders</Text>
              {recentOrders.length > 0 && <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}><Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>{recentOrders.length}</Text></View>}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(Routes.BusinessOrdersNavigation)}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#8B5CF6' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length === 0 ? (
            <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderStyle: 'dashed' }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 24 }}>📥</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#64748B' }}>No orders yet</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>New orders will appear here</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: '#F8FAFC' }}>
              {recentOrders.map((order, index) => (
                <TouchableOpacity
                  key={order.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderBottomWidth: index === recentOrders.length - 1 ? 0 : 1,
                    borderBottomColor: '#F8FAFC'
                  }}
                  onPress={() => navigation.navigate(Routes.BusinessOrderDetailScreen, { orderId: order.id })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B', textTransform: 'capitalize' }}>{order.user?.studentProfile?.fullname || 'Student Researcher'}</Text>
                    <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: '600' }}>{order.code} • {order.total_price} DA</Text>
                  </View>
                  <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                    backgroundColor: order.status?.code === 'pending' ? '#FEF3C7' : (order.status?.code === 'done' ? '#DCFCE7' : '#EFF6FF')
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      color: order.status?.code === 'pending' ? '#D97706' : (order.status?.code === 'done' ? '#16A34A' : '#3B82F6')
                    }}>{order.status?.code || 'New'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 5. Inventory Health Summary */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 19, fontWeight: '900', color: '#1E293B', marginBottom: 18 }}>Inventory Health</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: '#F8FAFC' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Total Items</Text>
              </View>
              <Text style={{ fontSize: 17, fontWeight: '900', color: '#1E293B' }}>{stats?.products || 0}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Active Listings</Text>
              </View>
              <Text style={{ fontSize: 17, fontWeight: '900', color: '#10B981' }}>{stats?.products || 0}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />
            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 }}
              onPress={() => navigation.navigate(Routes.BusinessStoreNavigation)}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#8B5CF6' }}>Manage Inventory</Text>
              <ArrowIcon size={14} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}