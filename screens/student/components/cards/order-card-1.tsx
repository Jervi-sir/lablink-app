import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View } from "react-native";

export const OrderCard1 = ({ item, onPress }: { item: any, onPress: () => void }) => {
  return (
    <TouchableOpacity
      style={{ backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' }}
      activeOpacity={0.7}
      onPress={onPress}
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
          onPress={onPress}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'In Progress' && (
          <TouchableOpacity style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }} onPress={onPress}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>Track Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};