import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch, ActivityIndicator, RefreshControl, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useCallback, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

const SECTIONS = [
  {
    title: 'Profile & Contact',
    items: [
      { id: '1-1', title: 'Lab Public Profile', icon: '🏢', route: Routes.LabProfileScreen, color: '#F0F9FF', iconColor: '#0EA5E9' },
      { id: '1-2', title: 'Edit Lab Details', icon: '📝', route: Routes.EditLabProfileScreen, color: '#F5F3FF', iconColor: '#8B5CF6' },
      { id: '1-3', title: 'Contact Information', icon: '📞', route: Routes.EditContactScreen, color: '#ECFDF5', iconColor: '#10B981' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: '2-1', title: 'Operating Hours', icon: '⏰', route: Routes.OperatingHoursScreen, color: '#FFF7ED', iconColor: '#F59E0B' },
      { id: '2-2', title: 'Inventory Analytics', icon: '📊', route: Routes.InventoryAnalyticsScreen, color: '#FDF2F8', iconColor: '#EC4899' },
      { id: '2-3', title: 'Service Agreements', icon: '⚖️', route: Routes.ServiceAgreementsScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  },
  {
    title: 'Financials & Plan',
    items: [
      { id: '3-1', title: 'Payout History', icon: '💰', route: Routes.PayoutHistoryScreen, color: '#F0FDF4', iconColor: '#22C55E' },
      { id: '3-2', title: 'Tax Documents', icon: '📄', route: Routes.TaxDocumentsScreen, color: '#FEF2F2', iconColor: '#EF4444' },
      { id: '3-3', title: 'Pro Plan Status', icon: '🚀', route: Routes.ProPlanStatusScreen, color: '#FFFBEB', iconColor: '#D97706' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: '4-1', title: 'Notification Settings', icon: '🔔', route: Routes.BusinessNotificationsScreen, color: '#EFF6FF', iconColor: '#3B82F6' },
      { id: '4-2', title: 'Language', icon: '🌐', route: Routes.BusinessLanguageScreen, color: '#F5F3FF', iconColor: '#8B5CF6' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: '5-1', title: 'Business Support', icon: '🎧', route: Routes.BusinessSupportScreen, color: '#F0FDFA', iconColor: '#14B8A6' },
    ]
  }
];

export default function BusinessM5Navigation() {
  const navigation = useNavigation<any>();
  const [isAvailable, setIsAvailable] = useState(true);
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState<any>({ active_orders: 0, products: 0, followers: 0, earnings: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfileAndStats = useCallback(async () => {
    try {
      const [profileRes, statsRes]: any = await Promise.all([
        api.get(ApiRoutes.auth.business.me),
        api.get(ApiRoutes.stats)
      ]);
      setBusiness(profileRes.user?.businessProfile || null);
      setStats(statsRes || { active_orders: 0, products: 0, followers: 0, earnings: 0 });
    } catch (error) {
      console.error("Error fetching profile/stats:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndStats();
  }, [fetchProfileAndStats]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProfileAndStats();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.AuthSelectorScreen }],
      });
      await api.post(ApiRoutes.auth.business.logout).catch(() => { });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  const businessName = business?.name || 'My Laboratory';
  const categoryName = business?.category?.code || 'Business';
  const wilayaName = business?.wilaya?.name || 'Location';

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />}
      >
        {/* Modern Header / Profile Card */}
        <View style={{ backgroundColor: '#FFF', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 }}>
          <View style={{ backgroundColor: '#111', padding: 24, paddingTop: 60, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#FFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 }}>
                  <Text style={{ fontSize: 32 }}>🔬</Text>
                  <View style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111' }}>
                    <Text style={{ fontSize: 8, color: '#FFF' }}>✓</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFF' }}>{businessName}</Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>{categoryName} • {wilayaName}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#F59E0B', fontSize: 12 }}>★</Text>
                <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>4.9</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 24 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Store Availability</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Receive new orders instantly</Text>
              </View>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#8B5CF6' }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Quick StatsRow */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: -20, paddingHorizontal: 20 }}>
            {[
              { label: 'Orders', val: stats?.active_orders || '0', color: '#8B5CF6' },
              { label: 'Products', val: stats?.products || '0', color: '#10B981' },
              { label: 'Followers', val: stats?.followers || '0', color: '#3B82F6' },
              { label: 'Earnings', val: `${stats?.earnings || 0}`, color: '#F59E0B' }
            ].map((stat, i) => (
              <View key={i} style={{ backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, alignItems: 'center', minWidth: 80, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '900', color: '#111' }}>{stat.val}</Text>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 20, paddingTop: 10 }}>
          {SECTIONS.map((section, sIdx) => (
            <View key={sIdx} style={{ marginBottom: 28 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 4 }}>
                {section.title}
              </Text>
              <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' }}>
                {section.items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[{ flexDirection: 'row', alignItems: 'center', padding: 12 }, idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }]}
                    onPress={() => item.route && navigation.navigate(item.route)}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 }}>
                      <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: item.color, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{item.title}</Text>
                    </View>
                    <View style={{ opacity: 0.3 }}>
                      <ArrowIcon size={18} color="#64748B" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              height: 60,
              borderRadius: 20,
              backgroundColor: '#FEF2F2',
              borderWidth: 1,
              borderColor: '#FEE2E2',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              marginTop: 10,
              marginBottom: 32
            }}
          >
            <Text style={{ fontSize: 20 }}>🚪</Text>
            <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 16 }}>Logout Account</Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center', opacity: 0.5, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6' }} />
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '800' }}>LabLink Business Premium</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6' }} />
            </View>
            <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 4 }}>v2.4.0 • Built with Passion</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}