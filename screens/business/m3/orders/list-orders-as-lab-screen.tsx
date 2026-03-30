import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  incoming_orders: { en: 'Incoming Orders', fr: 'Commandes entrantes', ar: 'الطلبات الواردة' },
  pending: { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار' },
  to_ship: { en: 'To Ship', fr: 'À expédier', ar: 'للشحن' },
  packaging: { en: 'Packaging', fr: 'Emballage', ar: 'التغليف' },
  all: { en: 'All', fr: 'Tout', ar: 'الكل' },
  new: { en: 'New', fr: 'Nouveau', ar: 'جديد' },
  processing: { en: 'Processing', fr: 'En traitement', ar: 'قيد المعالجة' },
  completed: { en: 'Completed', fr: 'Terminé', ar: 'مكتمل' },
  view_details: { en: 'View Details', fr: 'Voir détails', ar: 'عرض التفاصيل' },
  new_order: { en: 'New Order', fr: 'Nouvelle commande', ar: 'طلب جديد' },
  awaiting_shipment: { en: 'Awaiting Shipment', fr: 'En attente d\'expédition', ar: 'في انتظار الشحن' },
};

const ORDERS = [
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'New Order',
    statusColor: '#137FEC',
    statusBg: '#E7F2FD',
    buttonType: 'primary'
  },
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'Awaiting Shipment',
    statusColor: '#F59E0B',
    statusBg: '#FEF3C7',
    buttonType: 'primary'
  },
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'Awaiting Shipment',
    statusColor: '#8B5CF6',
    statusBg: '#F5F3FF',
    buttonType: 'secondary'
  },
];

export default function ListOrdersAsLabScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFF',
        }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#000' }}>Incoming Orders</Text>
          <TouchableOpacity>
            <View style={{
              width: 22,
              height: 18,
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
            }} />
          </TouchableOpacity>
        </View>

        {/* Summary horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16, gap: 12 }}
        >
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={{
              width: 140,
              backgroundColor: '#FFF',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              gap: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 20, height: 20, backgroundColor: '#000', borderRadius: 4 }} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>{card.title}</Text>
              </View>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#000' }}>{card.count}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Filter Tabs */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 }}>
          {FILTER_TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: index === 0 ? '#137FEC' : '#FFF',
                borderWidth: 1,
                borderColor: index === 0 ? '#137FEC' : '#E5E7EB',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: index === 0 ? '#FFF' : '#374151',
              }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order List */}
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {ORDERS.map((order, index) => (
            <View key={index} style={{
              backgroundColor: '#FFF',
              borderRadius: 16,
              padding: 16,
              gap: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}>
              {/* Card Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#F3F4F6', borderRadius: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#137FEC' }}>{order.id}</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500' }}>{order.time}</Text>
              </View>

              {/* Card Body */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 66, height: 66, backgroundColor: '#D9D9D9', borderRadius: 12 }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#000' }}>{order.title}</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>{order.description}</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', fontWeight: '500' }}>{order.location}</Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6, backgroundColor: order.statusBg }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: order.statusColor }} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: order.statusColor }}>
                    {order.status}
                  </Text>
                </View>

                <TouchableOpacity style={{
                  backgroundColor: order.buttonType === 'secondary' ? '#E7F2FD' : '#137FEC',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}>
                  <Text style={{
                    color: order.buttonType === 'secondary' ? '#137FEC' : '#FFF',
                    fontSize: 14,
                    fontWeight: '700',
                  }}>
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}