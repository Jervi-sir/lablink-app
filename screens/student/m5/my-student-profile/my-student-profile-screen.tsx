import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

export default function MyStudentProfileScreen() {
  const navigation = useNavigation<any>();

  const MENU_ITEMS = [
    {
      id: 'saved_products',
      title: 'Saved Products',
      icon: '🔖',
      route: Routes.StudentSavedProductsScreen,
      count: '12'
    },
    {
      id: 'saved_labs',
      title: 'Saved Laboratories',
      icon: '🏢',
      route: Routes.StudentSavedBusinessesScreen,
      count: '5'
    },
    {
      id: 'followed_facilities',
      title: 'Followed Facilities',
      icon: '👥',
      route: Routes.StudentFollowedBusinessesScreen,
      count: '8'
    },
  ];

  const SETTINGS_ITEMS = [
    { id: 'edit_profile', title: 'Edit Profile', icon: '👤', route: Routes.EditProfileScreen },
    { id: 'notifications', title: 'Notifications', icon: '🔔', route: Routes.NotificationsScreen },
    { id: 'language', title: 'Language', icon: '🌐', value: 'English', route: Routes.LanguageScreen },
    { id: 'privacy', title: 'Privacy & Security', icon: '🛡️', route: Routes.PrivacySecurityScreen },
    { id: 'support', title: 'Help & Support', icon: '❓', route: Routes.HelpSupportScreen },
  ];

  const renderMenuItem = (item: any, isFirst: boolean, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
        isLast && { borderBottomWidth: 0 }
      ]}
      activeOpacity={0.6}
      onPress={() => item.route && navigation.navigate(item.route)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{item.title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {item.count && (
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC', backgroundColor: '#F0F7FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
            {item.count}
          </Text>
        )}
        {item.value && <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>{item.value}</Text>}
        <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

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
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#64748B' }}>A</Text>
              </View>
              <TouchableOpacity style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                <Text style={{ fontSize: 12 }}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Dr. Amine Kherroubi</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>Master Reseacher • USTHB</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Biological Sciences</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingVertical: 16 }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>24</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Orders</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>12</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Saved</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>8</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Following</Text>
            </View>
          </View>
        </View>

        {/* Collections Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 }}>My COLLECTIONS</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
            {MENU_ITEMS.map((item, index) =>
              renderMenuItem(item, index === 0, index === MENU_ITEMS.length - 1)
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 }}>Account Settings</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
            {SETTINGS_ITEMS.map((item, index) =>
              renderMenuItem(item, index === 0, index === SETTINGS_ITEMS.length - 1)
            )}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={{ marginTop: 32, marginHorizontal: 20, height: 56, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.8}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#EF4444' }}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>LabLink Alpha v0.1.2</Text>

      </ScrollView>
    </ScreenWrapper>
  );
}