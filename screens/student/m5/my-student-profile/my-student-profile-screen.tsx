import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
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
        styles.menuItem,
        isFirst && styles.menuItemFirst,
        isLast && styles.menuItemLast
      ]}
      activeOpacity={0.6}
      onPress={() => item.route && navigation.navigate(item.route)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconBg}>
          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.count && <Text style={styles.menuCount}>{item.count}</Text>}
        {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
        <View style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>A</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Text style={{ fontSize: 12 }}>✏️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Dr. Amine Kherroubi</Text>
              <Text style={styles.userRole}>Master Reseacher • USTHB</Text>
              <View style={styles.tagContainer}>
                <View style={styles.deptTag}>
                  <Text style={styles.deptTagText}>Biological Sciences</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Collections Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My COLLECTIONS</Text>
          <View style={styles.menuGroup}>
            {MENU_ITEMS.map((item, index) =>
              renderMenuItem(item, index === 0, index === MENU_ITEMS.length - 1)
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuGroup}>
            {SETTINGS_ITEMS.map((item, index) =>
              renderMenuItem(item, index === 0, index === SETTINGS_ITEMS.length - 1)
            )}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>LabLink Alpha v0.1.2</Text>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
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
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: '#64748B',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  deptTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deptTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuItemFirst: {},
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#137FEC',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  menuValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#CBD5E1',
    transform: [{ rotate: '-45deg' }],
  },
  logoutBtn: {
    marginTop: 32,
    marginHorizontal: 20,
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  }
});