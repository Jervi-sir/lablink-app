import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const ORDERS_DATA = [
  {
    id: 'ORD-8829',
    date: 'Oct 24, 2024',
    status: 'In Progress',
    statusColor: '#137FEC',
    lab: 'Advanced Bio-Research Lab',
    product: 'Digital LCD Microscope',
    price: '45,000 DA',
  },
  {
    id: 'ORD-7712',
    date: 'Oct 20, 2024',
    status: 'Pending',
    statusColor: '#F59E0B',
    lab: 'NanoTech Solutions',
    product: 'Centrifuge Machine',
    price: '12,500 DA',
  },
  {
    id: 'ORD-6601',
    date: 'Oct 15, 2024',
    status: 'Completed',
    statusColor: '#10B981',
    lab: 'University Chemistry Dept',
    product: 'Borosil Glass Set',
    price: '3,200 DA',
  },
  {
    id: 'ORD-5590',
    date: 'Oct 10, 2024',
    status: 'Cancelled',
    statusColor: '#EF4444',
    lab: 'Bio-Safety Labs',
    product: 'Hazmat Suit Level 3',
    price: '8,500 DA',
  },
];

const TABS = ['All', 'In Progress', 'Completed'];

export default function StudentM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');

  const navigateToDetail = (order: any) => {
    navigation.navigate(Routes.OrderDetailScreen, { order });
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' }}
      activeOpacity={0.7}
      onPress={() => navigateToDetail(item)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{item.id}</Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{item.date}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, backgroundColor: item.statusColor + '15' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.statusColor }} />
          <Text style={{ fontSize: 11, fontWeight: '800', textTransform: 'uppercase', color: item.statusColor }}>{item.status}</Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 12 }} />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 70, height: 70, borderRadius: 14, backgroundColor: '#F1F5F9' }} />
        <View style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{item.lab}</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }} numberOfLines={1}>{item.product}</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#111', marginTop: 2 }}>{item.price}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
        <TouchableOpacity
          style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigateToDetail(item)}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'In Progress' && (
          <TouchableOpacity style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigateToDetail(item)}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>Track Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>My Orders</Text>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFF', gap: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F1F5F9' },
              activeTab === tab && { backgroundColor: '#137FEC' }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[{ fontSize: 14, fontWeight: '700', color: '#64748B' }, activeTab === tab && { color: '#FFF' }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={ORDERS_DATA.filter(o => activeTab === 'All' || o.status === activeTab)}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '600' }}>No orders found</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}