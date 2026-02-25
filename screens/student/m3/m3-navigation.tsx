import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Routes } from "@/utils/helpers/routes";
import { OrderCard1 } from "../components/cards/order-card-1";
import { ButtonTag } from "../components/buttons/button-tag";

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
    <OrderCard1
      item={item}
      onPress={() => navigateToDetail(item)}
    />
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
          <ButtonTag
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
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