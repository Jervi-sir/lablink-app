import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, ActivityIndicator, RefreshControl, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../../components/options/option-settings";
import { useEffect, useState, useCallback, useRef } from "react";
import { SheetManager } from "react-native-actions-sheet";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paddingHorizontal } from "@/utils/variables/styles";

export default function StudentM5Navigation() {
  const navigation = useNavigation<any>();
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>({ orders: 0, saved_products: 0, saved_laboratories: 0, followed_facilities: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfileAndStats = useCallback(async () => {
    try {
      const [profileRes, statsRes]: any = await Promise.all([
        api.get(ApiRoutes.auth.student.me),
        api.get(ApiRoutes.stats)
      ]);
      setStudent(profileRes.user?.studentProfile || null);
      setStats(statsRes || { orders: 0, saved_products: 0, saved_laboratories: 0, followed_facilities: 0 });
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
      // Optimistically clear storage and navigate back to login
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.AuthSelectorScreen }],
      });
      // Optionally call logout API if needed
      await api.post(ApiRoutes.auth.student.logout).catch(() => { });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const MENU_ITEMS = [
    { label: 'Saved Products', onPress: () => navigation.navigate(Routes.StudentSavedProductsScreen), count: stats?.saved_products?.toString() || '0' },
    { label: 'Saved Laboratories', onPress: () => navigation.navigate(Routes.StudentSavedBusinessesScreen), count: stats?.saved_laboratories?.toString() || '0' },
    { label: 'Followed Facilities', onPress: () => navigation.navigate(Routes.StudentFollowedBusinessesScreen), count: stats?.followed_facilities?.toString() || '0' },
  ];

  const SETTINGS_ITEMS = [
    { label: 'Edit Profile', onPress: () => navigation.navigate(Routes.EditProfileScreen) },
    { label: 'Notifications', onPress: () => navigation.navigate(Routes.NotificationsScreen) },
    { label: 'Language', value: 'English', onPress: () => navigation.navigate(Routes.LanguageScreen) },
    { label: 'Privacy & Security', onPress: () => navigation.navigate(Routes.PrivacySecurityScreen) },
    { label: 'Help & Support', onPress: () => navigation.navigate(Routes.HelpSupportScreen) },
  ];

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </ScreenWrapper>
    );
  }

  const studentName = student?.fullName || 'Student';
  const initial = studentName.charAt(0).toUpperCase();

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: paddingHorizontal }}>
        {/* Profile Card */}
        <View style={{
          backgroundColor: '#FFF',
          padding: paddingHorizontal,
          paddingTop: 20,
          borderRadius: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 5,
          zIndex: 10,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>{studentName}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{student?.studentCardId || 'ID - Laboratory Researcher'}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>{student?.department?.name || 'Department'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingVertical: 16 }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.orders || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Orders</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.saved_products || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Saved</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.followed_facilities || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Following</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: paddingHorizontal, gap: 24 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />}
      >
        {/* Collections Section */}
        <View style={{ marginTop: 24 }}>
          <OptionSettings
            title="My COLLECTIONS"
            items={MENU_ITEMS}
          />
        </View>

        {/* Settings Section */}
        <View >
          <OptionSettings
            title="Account Settings"
            items={SETTINGS_ITEMS}
          />
        </View>


        {/* Logout */}
        <TouchableOpacity
          style={{ marginTop: 20, height: 56, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
          onPress={() => {
            SheetManager.show('logout-sheet', {
              payload: {
                onLogout: handleLogout
              }
            });
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#EF4444' }}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>LabLink Alpha v0.1.2</Text>

      </ScrollView>
    </ScreenWrapper>
  );

}