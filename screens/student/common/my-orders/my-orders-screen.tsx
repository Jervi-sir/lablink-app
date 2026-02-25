import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Dimensions, Image } from "react-native";

const FILTER_TABS = ['All', 'Processing', 'Shipped', 'Delivered'];

const ORDERS = [
  {
    id: '#ORD-2023-88',
    date: 'Oct 10, 2023 • 2:30 PM',
    items: 'Bunsen Burner, Tripod Stand, Wire Gauze, 500ml Beakers (x2)',
    itemCount: '4 Items',
    status: 'Delivered',
    statusType: 'success',
    action: 'Download Agreement',
    actionType: 'primary'
  },
  {
    id: '#ORD-2023-89',
    date: 'Oct 24, 2023 • 10:15 AM',
    items: 'Microscope Slides (Box of 50), Safety Goggles, Lab Coat...',
    itemCount: '3 Items',
    status: 'Shipped',
    statusType: 'info',
    action: 'Download Agreement',
    actionType: 'secondary'
  },
  {
    id: '#ORD-2023-90',
    date: 'Nov 01, 2023 • 9:45 AM',
    items: 'Petri Dishes (Sterile), Agar Powder (100g), Pipettes',
    itemCount: '3 Items',
    status: 'Processing',
    statusType: 'warning',
    action: 'Agreement Pending',
    actionType: 'pending'
  },
  {
    id: '#ORD-2023-45',
    date: 'Sep 15, 2023 • 4:20 PM',
    items: 'Digital Precision Scale, Calibration Weights',
    itemCount: '2 Items',
    status: 'Delivered',
    statusType: 'success',
    action: 'Download Agreement',
    actionType: 'primary'
  },
];

export default function MyOrdersScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ padding: 8 }}>
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#000', transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#000' }}>My Orders</Text>
        <TouchableOpacity>
          <View style={{ width: 20, height: 18, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search Bar */}
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 }}>
            <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#A0AEC0', marginRight: 8 }} />
            <TextInput
              placeholder="Search Order ID or item..."
              style={{ flex: 1, fontSize: 14, color: '#000' }}
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={{ marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {FILTER_TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[
                  { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
                  index === 0 && { backgroundColor: '#111', borderColor: '#111' }
                ]}
              >
                <Text style={[
                  { fontSize: 13, fontWeight: '700', color: '#374151' },
                  index === 0 && { color: '#FFF' }
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Order List */}
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {ORDERS.map((order, index) => (
            <View key={index} style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>{order.id}</Text>
                  <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>{order.date}</Text>
                </View>
                <View style={[
                  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
                  order.statusType === 'success' && { backgroundColor: '#E9F7EF' },
                  order.statusType === 'info' && { backgroundColor: '#E7F2FD' },
                  order.statusType === 'warning' && { backgroundColor: '#FFFBEB' },
                ]}>
                  <Text style={[
                    { fontSize: 11, fontWeight: '700' },
                    order.statusType === 'success' && { color: '#27AE60' },
                    order.statusType === 'info' && { color: '#137FEC' },
                    order.statusType === 'warning' && { color: '#F59E0B' },
                  ]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 64, height: 64, backgroundColor: '#1A2526', borderRadius: 10 }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#000', lineHeight: 20 }} numberOfLines={2}>{order.items}</Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>{order.itemCount}</Text>
                </View>
              </View>

              <TouchableOpacity style={[
                { flexDirection: 'row', height: 44, backgroundColor: '#137FEC', borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8 },
                order.actionType === 'secondary' && { backgroundColor: '#E7F2FD' },
                order.actionType === 'pending' && { backgroundColor: '#E7F2FD' },
              ]}>
                <View style={[
                  { width: 14, height: 16, backgroundColor: '#FFF', borderRadius: 2 },
                  order.actionType === 'pending' && { backgroundColor: '#137FEC', width: 14, height: 14, borderRadius: 7 }
                ]} />
                <Text style={[
                  { color: '#FFF', fontSize: 14, fontWeight: '700' },
                  order.actionType === 'secondary' && { color: '#137FEC' },
                  order.actionType === 'pending' && { color: '#137FEC' },
                ]}>
                  {order.action}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}