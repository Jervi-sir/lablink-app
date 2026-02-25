import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";

const RECENT_ORDERS = [
  { id: '1', name: 'TechScience Labs', details: '2 Items • $1,240', status: 'PENDING', statusBg: '#FFFBE6', statusColor: '#D46B08' },
  { id: '2', name: 'BioUni Research', details: '5 Items • $450', status: 'PAID', statusBg: '#F6FFED', statusColor: '#389E0D' },
];

export default function StatsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* User Profil Bar */}
      <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F2F5' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 36, height: 36, backgroundColor: '#D9D9D9', borderRadius: 18 }} />
          <View>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#111' }}>Welcome back</Text>
            <Text style={{ fontSize: 10, color: '#5D6575', fontWeight: '500' }}>Dr. Sarah Smith</Text>
          </View>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <View style={{ width: 18, height: 20, borderWidth: 2, borderColor: '#111', borderRadius: 2 }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>

        {/* Total Revenue Card */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 48, height: 48, backgroundColor: '#E7F2FD', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 24, height: 16, borderWidth: 2, borderColor: '#137FEC', borderRadius: 2 }} />
            </View>
            <View style={{ backgroundColor: '#E9F7EF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 }}>
              <Text style={{ color: '#27AE60', fontSize: 12, fontWeight: '700' }}>+12%</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: '#5D6575', fontWeight: '600' }}>Total Revenue</Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#111' }}>$45,231</Text>
        </View>

        {/* Small Stats Cards */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ width: 32, height: 32, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 14, height: 14, backgroundColor: '#6B7280', borderRadius: 2 }} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>124</Text>
            <Text style={{ fontSize: 12, color: '#5D6575', fontWeight: '600' }}>Active Listings</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ width: 32, height: 32, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 16, height: 16, borderColor: '#137FEC', borderWidth: 2, borderBottomLeftRadius: 4 }} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>8</Text>
            <Text style={{ fontSize: 12, color: '#5D6575', fontWeight: '600' }}>New Orders</Text>
          </View>
        </View>

        {/* Sales Overview / Chart Mockup */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Sales Overview</Text>
              <Text style={{ fontSize: 12, color: '#5D6575', fontWeight: '500' }}>Last 7 Days</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#E7F2FD', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100 }}>
              <Text style={{ color: '#137FEC', fontSize: 12, fontWeight: '700' }}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 180, gap: 8 }}>
            {/* Mock chart line graphic */}
            <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
              <View style={{ height: 3, backgroundColor: '#137FEC', width: '100%', borderRadius: 2, transform: [{ rotate: '-10deg' }] }} />
              <View style={{ position: 'absolute', bottom: 0, width: '100%', height: '60%', backgroundColor: 'rgba(19, 127, 236, 0.05)' }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF' }}>MON</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF' }}>WED</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF' }}>FRI</Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#9CA3AF' }}>SUN</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Quick Actions</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E70E8', padding: 18, borderRadius: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 22, fontWeight: '600' }}>+</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>Add New Product</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Create listing for reagents</Text>
            </View>
          </View>
          <View style={{ width: 8, height: 8, borderRightWidth: 2, borderTopWidth: 2, borderColor: '#FFF', transform: [{ rotate: '45deg' }] }} />
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 18, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 18, height: 14, borderWidth: 2, borderColor: '#111', borderRadius: 2 }} />
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Manage Inventory</Text>
              <Text style={{ fontSize: 12, color: '#5D6575' }}>Update stock levels</Text>
            </View>
          </View>
          <View style={{ width: 8, height: 8, borderRightWidth: 2, borderTopWidth: 2, borderColor: '#9CA3AF', transform: [{ rotate: '45deg' }] }} />
        </TouchableOpacity>

        {/* Recent Orders List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 12, color: '#137FEC', fontWeight: '700' }}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12 }}>
          {RECENT_ORDERS.map((order) => (
            <View key={order.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 }}>
              <View style={{ width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#6B7280' }}>{order.name.substring(0, 2).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>{order.name}</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '600' }}>{order.details}</Text>
              </View>
              <View style={[{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }, { backgroundColor: order.statusBg }]}>
                <Text style={[{ fontSize: 10, fontWeight: '800' }, { color: order.statusColor }]}>{order.status}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}