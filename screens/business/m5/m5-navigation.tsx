import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch, ActivityIndicator, RefreshControl, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useCallback, useEffect } from "react";
import { SheetManager } from "react-native-actions-sheet";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import ClockIcon from "@/assets/icons/clock-icon";
import StatsIcon from "@/assets/icons/stats-icon";
import PolicyIcon from "@/assets/icons/policy-icon";
import PhoneIcon from "@/assets/icons/phone-icon";
import OrderIcon from "@/assets/icons/order-icon";
import EditIcon from "@/assets/icons/edit-icon";
import BusinessCardIcon from "@/assets/icons/business-card-icon";
import RevenueIcon from "@/assets/icons/revenue-icon";
import BellIcon from "@/assets/icons/bell-icon";
import LanguageIcon from "@/assets/icons/language-icon";
import InfoIcon from "@/assets/icons/info-icon";
import { BusinessAuth } from "@/utils/types";

const { width } = Dimensions.get('window');

const SECTIONS = [
  {
    title: 'Profile & Contact',
    items: [
      { id: '1-2', title: 'Edit Lab Details', icon: <BusinessCardIcon />, route: Routes.EditLabProfileScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '1-3', title: 'Contact Information', icon: <PhoneIcon />, route: Routes.EditContactScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: '2-1', title: 'Operating Hours', icon: <ClockIcon />, route: Routes.OperatingHoursScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '2-2', title: 'Inventory Analytics', icon: <StatsIcon />, route: Routes.InventoryAnalyticsScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '2-3', title: 'Service Agreements', icon: <PolicyIcon />, route: Routes.ServiceAgreementsScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  },
  {
    title: 'Financials & Plan',
    items: [
      { id: '3-1', title: 'Payout History', icon: <RevenueIcon />, route: Routes.PayoutHistoryScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '3-2', title: 'Tax Documents', icon: <StatsIcon />, route: Routes.TaxDocumentsScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '3-3', title: 'Pro Plan Status', icon: <PolicyIcon />, route: Routes.ProPlanStatusScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: '4-1', title: 'Notification Settings', icon: <BellIcon />, route: Routes.BusinessNotificationsScreen, color: '#F8FAFC', iconColor: '#64748B' },
      { id: '4-2', title: 'Language', icon: <LanguageIcon />, route: Routes.BusinessLanguageScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: '5-1', title: 'Business Support', icon: <InfoIcon />, route: Routes.BusinessSupportScreen, color: '#F8FAFC', iconColor: '#64748B' },
    ]
  }
];

export default function BusinessM5Navigation() {
  const navigation = useNavigation<any>();
  const { auth, setAuthToken, setAuth } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [business, setBusiness] = useState<any>(auth?.businessProfile);
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
      if (profileRes.user) {
        setAuth(profileRes.user);
      }
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
      await setAuthToken(null);
      setAuth(null);
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
      <ScreenWrapper style={{ backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#8B5CF6" />
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
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} tintColor="#8B5CF6" />}
      >
        {/* Futuristic Minimal Header */}
        <View style={{ paddingHorizontal: paddingHorizontal, paddingTop: 5, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#111', letterSpacing: -0.5 }}>{businessName}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500', marginTop: 4 }}>{categoryName} • {wilayaName}</Text>
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
              <Image
                source={{ uri: business?.logo }}
                style={{ width: 48, height: 48, borderRadius: 16 }}
              />
              <View style={{ position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' }}>
                <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '900' }}>P</Text>
              </View>
            </View>
          </View>

          {/* Clean Stats Row */}
          <View style={{ backgroundColor: '#F8FAFC', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { label: 'Orders', val: stats?.active_orders || '0' },
                { label: 'Products', val: stats?.products || '0' },
                { label: 'Followers', val: stats?.followers || '0' }
              ].map((stat, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>{stat.val}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: 6, letterSpacing: 0.5 }}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* <View style={{ height: 1, backgroundColor: '#E2E8F0', opacity: 0.5, marginBottom: 20 }} /> */}

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Total Net Earnings</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#10B981' }}>{stats?.earnings?.toLocaleString() || 0} DA</Text>
            </View> */}
          </View>
        </View>

        {/* Availability Toggle - Glass Style */}
        <View style={{ marginHorizontal: paddingHorizontal, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>Operational Status</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{isAvailable ? 'Currently accepting new orders' : 'Currently closed for orders'}</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#F1F5F9', true: '#8B5CF6' }}
            thumbColor="#FFF"
          />
        </View>

        {/* Section List - Minimalist */}
        <View style={{ paddingHorizontal: paddingHorizontal }}>
          {SECTIONS.map((section, sIdx) => (
            <View key={sIdx} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 }}>
                {section.title}
              </Text>
              <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F8FAFC', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
                {section.items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderBottomWidth: idx === section.items.length - 1 ? 0 : 1,
                      borderBottomColor: '#F8FAFC'
                    }}
                    onPress={() => item.route && navigation.navigate(item.route)}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                      {item.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>{item.title}</Text>
                    </View>
                    <ArrowIcon size={14} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              SheetManager.show('logout-sheet', {
                payload: {
                  onLogout: handleLogout
                }
              });
            }}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: '#FEF2F2',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
              marginBottom: 40
            }}
          >
            <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 15 }}>Log out current session</Text>
          </TouchableOpacity>

          {/* Futuristic Footer */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{ width: 40, height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 }} />
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '700', letterSpacing: 1 }}>LABLINK FOR BUSINESS</Text>
            <Text style={{ fontSize: 9, color: '#94A3B8', fontWeight: '500', marginTop: 4 }}>VERSION 2.4.0 • PRODUCTION ENVIROMENT</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}