import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

const MOCK_ORDERS = [
  { id: 'ORD-8821', student: 'Amine Kerroum', items: 'Digital Microscope X1', date: '24 Feb, 14:30', amount: '45,000 DA', status: 'Pending', emoji: '🔬' },
  { id: 'ORD-8819', student: 'Dr. Sarah B.', items: 'Magnetic Stirrer + 3 Beakers', date: '24 Feb, 10:15', amount: '16,100 DA', status: 'Processing', emoji: '🧪' },
  { id: 'ORD-8815', student: 'Lab Research Team', items: 'PCR Reagents Kit', date: '23 Feb, 16:45', amount: '12,000 DA', status: 'Ready', emoji: '🧬' },
  { id: 'ORD-8802', student: 'University of Algiers', items: 'Protective Gear Bundle', date: '22 Feb, 09:00', amount: '5,500 DA', status: 'Done', emoji: '🥽' },
  { id: 'ORD-8798', student: 'Yanis Mahidi', items: 'Electric Bunsen Burner', date: '21 Feb, 11:30', amount: '18,000 DA', status: 'Cancelled', emoji: '🔥' },
];

export default function BusinessM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['All', 'Pending', 'Processing', 'Ready', 'Done'];

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.student.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#F5F3FF', text: '#8B5CF6' }; // Purple for theme
      case 'Processing': return { bg: '#FFF7ED', text: '#F59E0B' };
      case 'Ready': return { bg: '#ECFDF5', text: '#10B981' };
      case 'Done': return { bg: '#F1F5F9', text: '#64748B' };
      case 'Cancelled': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F8FAFC', text: '#94A3B8' };
    }
  };

  const renderOrderItem = ({ item }: { item: typeof MOCK_ORDERS[0] }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{item.id}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{item.date}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: statusStyle.bg }}>
            <Text style={{ fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: statusStyle.text }}>{item.status}</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 14 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{item.student}</Text>
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 }} numberOfLines={1}>{item.items}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Total</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{item.amount}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={{ flex: 2, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F3FF' }}
            onPress={() => navigation.navigate(Routes.BusinessOrderDetailScreen, { order: item })}
          >
            <Text style={{ color: '#8B5CF6', fontSize: 13, fontWeight: '800' }}>Manage Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate(Routes.BusinessInvoiceScreen, { order: item })}
          >
            <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>Invoicing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* 1. Dashboard Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>Order Hub</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500', marginTop: 2 }}>Manage procurement requests</Text>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6', marginRight: 8 }} />
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#111' }}>3 New</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Quick Metrics Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, marginBottom: 24 }}>
        <View style={{ width: 100, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#8B5CF6', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Pending</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#8B5CF6' }}>12</Text>
        </View>
        <View style={{ width: 100, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Processing</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>5</Text>
        </View>
        <View style={{ width: 100, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Ready</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>8</Text>
        </View>
        <View style={{ width: 100, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Completed</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>142</Text>
        </View>
      </ScrollView>

      {/* 3. Filter Sticky Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 }}>
          <Text style={{ marginRight: 10, fontSize: 16 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111' }}
            placeholder="Search Order ID or Researcher..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 10,
                borderRadius: 100,
                backgroundColor: activeTab === tab ? '#8B5CF6' : '#FFF',
                borderWidth: 1,
                borderColor: activeTab === tab ? '#8B5CF6' : '#E2E8F0'
              }}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: activeTab === tab ? '#FFF' : '#64748B' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4. Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📂</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 }}>No Orders Found</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>Adjust your filters or search criteria</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}