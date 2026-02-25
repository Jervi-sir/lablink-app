import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";

const { width } = Dimensions.get('window');

export default function BusinessM5Navigation() {
  const navigation = useNavigation<any>();
  const [isOnline, setIsOnline] = useState(true);

  const LAB_INFO = {
    name: 'Advanced Bio-Research Lab',
    type: 'Commercial Laboratory',
    location: 'USTHB Tech Park, Algiers',
    rating: 4.8,
    reviews: 124,
    avatar: '🔬'
  };

  const MENU_SECTIONS = [
    {
      title: 'Laboratory Management',
      items: [
        { id: 'edit_profile', title: 'Edit Lab Profile', icon: '🏢', route: Routes.EditLabProfileScreen },
        { id: 'edit_contacts', title: 'Edit Contact Details', icon: '📞', route: Routes.EditContactScreen },
        { id: 'manage_inventory', title: 'Inventory Analytics', icon: '📊', route: Routes.InventoryAnalyticsScreen },
        { id: 'business_hours', title: 'Operating Hours', icon: '⏰', route: Routes.OperatingHoursScreen },
      ]
    },
    {
      title: 'Finance & Orders',
      items: [
        { id: 'payouts', title: 'Payout History', icon: '💰', route: Routes.PayoutHistoryScreen },
        { id: 'tax_docs', title: 'Tax Documents', icon: '📝', route: Routes.TaxDocumentsScreen },
        { id: 'subscription', title: 'Pro Plan Status', icon: '💎', route: Routes.ProPlanStatusScreen },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { id: 'help', title: 'Business Support', icon: '🎧', route: Routes.BusinessSupportScreen },
        { id: 'terms', title: 'Service Agreement', icon: '📜', route: Routes.ServiceAgreementsScreen },
      ]
    }
  ];

  const renderMenuItem = (item: any, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={() => item.route && navigation.navigate(item.route)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconBox}>
          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <View style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 1. Profile Header Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarLarge}>
                <Text style={{ fontSize: 40 }}>{LAB_INFO.avatar}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={{ fontSize: 10 }}>✓</Text>
              </View>
            </View>
            <View style={styles.heroMeta}>
              <Text style={styles.labName}>{LAB_INFO.name}</Text>
              <Text style={styles.labType}>{LAB_INFO.type}</Text>
              <View style={styles.ratingRow}>
                <Text style={{ fontSize: 12 }}>⭐</Text>
                <Text style={styles.ratingText}>{LAB_INFO.rating} ({LAB_INFO.reviews} reviews)</Text>
              </View>
            </View>
          </View>

          {/* Availability Toggle */}
          <View style={styles.availabilityBox}>
            <View>
              <Text style={styles.availTitle}>Instant Booking</Text>
              <Text style={styles.availSub}>Accept orders automatically</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
            />
          </View>
        </View>

        {/* 2. Business Performance Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>452k</Text>
            <Text style={styles.statLabel}>Revenue (DA)</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>86%</Text>
            <Text style={styles.statLabel}>Fulfillment</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>1.2k</Text>
            <Text style={styles.statLabel}>Profile Views</Text>
          </View>
        </View>

        {/* 3. Menu Sections */}
        {MENU_SECTIONS.map((section, sIdx) => (
          <View key={sIdx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuGroup}>
              {section.items.map((item, iIdx) =>
                renderMenuItem(item, iIdx === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* 4. Dangerous Zone */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out Business Account</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>LabLink for Business • v2.4.0 (Alpha)</Text>
          <Text style={styles.copyrightText}>© 2026 LabLink Technologies Inc.</Text>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  scrollContent: { paddingBottom: 60 },
  heroCard: { backgroundColor: '#FFF', padding: 24, paddingTop: Platform.OS === 'ios' ? 20 : 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  avatarContainer: { position: 'relative' },
  avatarLarge: { width: 90, height: 90, borderRadius: 32, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  verifiedBadge: { position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  heroMeta: { flex: 1, gap: 4 },
  labName: { fontSize: 22, fontWeight: '900', color: '#111' },
  labType: { fontSize: 14, color: '#8B5CF6', fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  availabilityBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  availTitle: { fontSize: 15, fontWeight: '800', color: '#111' },
  availSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
  statsGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -30, zIndex: 10 },
  statBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 5, borderWidth: 1, borderColor: '#F1F5F9' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#111' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 4, textAlign: 'center' },
  section: { marginTop: 32, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
  menuGroup: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  menuItemTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  chevron: { width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] },
  logoutBtn: { marginHorizontal: 20, marginTop: 40, height: 58, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '800', color: '#EF4444' },
  footer: { marginTop: 40, alignItems: 'center', gap: 4 },
  versionText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  copyrightText: { fontSize: 11, color: '#CBD5E1', fontWeight: '500' }
});