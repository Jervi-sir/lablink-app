import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 16) / 2;

export default function BusinessM1Navigation() {
  const navigation = useNavigation<any>();

  const STATS = [
    { id: '1', label: 'Total Sales', value: '450,000 DA', icon: '💰', color: '#8B5CF6' },
    { id: '2', label: 'Active Orders', value: '12', icon: '📦', color: '#137FEC' },
    { id: '3', label: 'New Proposals', value: '5', icon: '📝', color: '#F59E0B' },
    { id: '4', label: 'Profile Views', value: '1.2k', icon: '👁️', color: '#10B981' },
  ];

  const RECENT_PROPOSALS = [
    { id: '1', student: 'Dr. Amine Kherroubi', item: 'Digital Microscope', date: '2h ago', status: 'Pending' },
    { id: '2', student: 'Sarah Mansouri', item: 'Chemical Reagents', date: '5h ago', status: 'In Review' },
    { id: '3', student: 'Tech Lab Solutions', item: 'Lab Equipment', date: 'Yesterday', status: 'Action Needed' },
  ];

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>

        {/* 1. Dashboard Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 }}>Lab Dashboard</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111', marginTop: 2 }}>NanoTech Research Center</Text>
          </View>
          <TouchableOpacity style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <Text style={{ fontSize: 20 }}>🔬</Text>
            <View style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 3, borderColor: '#F8F9FB' }} />
          </TouchableOpacity>
        </View>

        {/* 2. Key Metrics Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          {STATS.map(stat => (
            <View key={stat.id} style={{
              width: CARD_WIDTH,
              backgroundColor: '#FFF',
              padding: 16,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.03,
              shadowRadius: 8,
              elevation: 2,
              borderLeftColor: stat.color,
              borderLeftWidth: 4
            }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: stat.color + '15' }}>
                <Text style={{ fontSize: 18 }}>{stat.icon}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>{stat.label}</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* 3. Quick Actions Banner */}
        <View style={{ backgroundColor: '#8B5CF6', borderRadius: 24, padding: 24, flexDirection: 'row', overflow: 'hidden', marginBottom: 32 }}>
          <View style={{ flex: 1, zIndex: 2 }}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800', marginBottom: 8 }}>Ready to expand?</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18, marginBottom: 16 }}>Upload new inventory items to reach more researchers.</Text>
            <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' }}>
              <Text style={{ color: '#8B5CF6', fontSize: 13, fontWeight: '800' }}>Add New Product</Text>
            </TouchableOpacity>
          </View>
          <View style={{ position: 'absolute', right: -30, bottom: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', margin: 20 }} />
          </View>
        </View>

        {/* 4. Recent Proposals */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Recent Proposals</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}>
            {RECENT_PROPOSALS.map((prop, index) => (
              <TouchableOpacity
                key={prop.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 16,
                  borderBottomWidth: index === RECENT_PROPOSALS.length - 1 ? 0 : 1,
                  borderBottomColor: '#F8F9FB'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>{prop.student}</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{prop.item} • {prop.date}</Text>
                </View>
                <View style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor: prop.status === 'Pending' ? '#FFFBEB' : (prop.status === 'In Review' ? '#F0F7FF' : '#FEF2F2')
                }}>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: prop.status === 'Pending' ? '#F59E0B' : (prop.status === 'In Review' ? '#137FEC' : '#EF4444')
                  }}>{prop.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5. Inventory Summary */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 16 }}>Inventory Health</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>Total Items</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>128</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F8F9FB', marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>Out of Stock</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#EF4444' }}>12</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F8F9FB', marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>Active Listings</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#10B981' }}>116</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}