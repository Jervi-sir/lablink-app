import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../components/options/option-settings";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

export default function MyStudentProfileScreen() {
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
    { label: 'Saved Products', icon: '🔖', onPress: () => navigation.navigate(Routes.StudentSavedProductsScreen), count: stats?.saved_products?.toString() || '0' },
    { label: 'Saved Laboratories', icon: '🏢', onPress: () => navigation.navigate(Routes.StudentSavedBusinessesScreen), count: stats?.saved_laboratories?.toString() || '0' },
    { label: 'Followed Facilities', icon: '👥', onPress: () => navigation.navigate(Routes.StudentFollowedBusinessesScreen), count: stats?.followed_facilities?.toString() || '0' },
  ];

  const SETTINGS_ITEMS = [
    { label: 'Edit Profile', icon: '👤', onPress: () => navigation.navigate(Routes.EditProfileScreen) },
    { label: 'Notifications', icon: '🔔', onPress: () => navigation.navigate(Routes.NotificationsScreen) },
    { label: 'Language', icon: '🌐', value: 'English', onPress: () => navigation.navigate(Routes.LanguageScreen) },
    { label: 'Privacy & Security', icon: '🛡️', onPress: () => navigation.navigate(Routes.PrivacySecurityScreen) },
    { label: 'Help & Support', icon: '❓', onPress: () => navigation.navigate(Routes.HelpSupportScreen) },
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
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />}
      >

        {/* Profile Card */}
        <View style={{
          backgroundColor: '#FFF',
          padding: 24,
          paddingTop: Platform.OS === 'ios' ? 20 : 40,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          elevation: 5,
          zIndex: 10,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <View style={{ position: 'relative' }}>
              <View style={{ width: 80, height: 80, borderRadius: 30, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#F8FAFC' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#137FEC' }}>{initial}</Text>
              </View>
              <TouchableOpacity style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <Text style={{ fontSize: 12 }}>✏️</Text>
              </TouchableOpacity>
            </View>
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

        {/* Collections Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <OptionSettings
            title="My COLLECTIONS"
            items={MENU_ITEMS}
          />
        </View>

        {/* Settings Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <OptionSettings
            title="Account Settings"
            items={SETTINGS_ITEMS}
          />
        </View>


        {/* Logout */}
        <TouchableOpacity
          style={{ marginTop: 32, marginHorizontal: 20, height: 56, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#EF4444' }}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>LabLink Alpha v0.1.2</Text>

      </ScrollView>
    </ScreenWrapper>
  );
}