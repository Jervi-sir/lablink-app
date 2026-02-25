import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";

const MENU_ITEMS = [
  { id: '1', title: 'Lab Profile', icon: '🧪', route: Routes.LabProfileScreen },
  { id: '2', title: 'Inventory Analytics', icon: '📊', route: Routes.InventoryAnalyticsScreen },
  { id: '3', title: 'Operating Hours', icon: '⏰', route: Routes.OperatingHoursScreen },
  { id: '4', title: 'Payout History', icon: '💰', route: Routes.PayoutHistoryScreen },
  { id: '5', title: 'Pro Plan Status', icon: '🚀', route: Routes.ProPlanStatusScreen },
  { id: '6', title: 'Tax Documents', icon: '📄', route: Routes.TaxDocumentsScreen },
  { id: '7', title: 'Business Support', icon: '🎧', route: Routes.BusinessSupportScreen },
  { id: '8', title: 'Service Agreements', icon: '⚖️', route: Routes.ServiceAgreementsScreen },
];

export default function BusinessM5Navigation() {
  const navigation = useNavigation<any>();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={{ backgroundColor: '#111', padding: 24, borderRadius: 32, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Text style={{ fontSize: 32 }}>🔬</Text>
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#111' }}>
                <Text style={{ fontSize: 10, color: '#FFF' }}>✓</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>RATING</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Text style={{ fontSize: 18, color: '#FFF', fontWeight: '800' }}>4.9</Text>
                <Text style={{ color: '#F59E0B' }}>★</Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFF' }}>Advanced Bio-Research Lab</Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: 4 }}>Commercial Laboratory • Algiers</Text>
          </View>

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Instant Booking</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginTop: 2 }}>Orders are auto-accepted</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#8B5CF6' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Active Orders', val: '12', color: '#8B5CF6' },
            { label: 'Inquiries', val: '28', color: '#10B981' },
            { label: 'Views', val: '1.4k', color: '#3B82F6' },
            { label: 'Earnings', val: '245k', color: '#F59E0B' }
          ].map((stat, i) => (
            <View key={i} style={{ width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: stat.color }}>{stat.val}</Text>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 }}>Lab Management</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 28, padding: 8, borderWidth: 1, borderColor: '#F1F5F9' }}>
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[{ flexDirection: 'row', alignItems: 'center', padding: 16 }, idx < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }]}
                onPress={() => item.route && navigation.navigate(item.route)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 16 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{item.title}</Text>
                </View>
                <Text style={{ fontSize: 18, color: '#CBD5E1', fontWeight: '600' }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={{ height: 64, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 16 }}>Logout Account</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', opacity: 0.4 }}>
          <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '700' }}>LabLink Business v2.4.0</Text>
          <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 4 }}>© 2024 LabLink Platforms. All rights reserved.</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}