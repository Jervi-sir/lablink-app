import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";

export default function InventoryAnalyticsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginLeft: 16 }}>Inventory Analytics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#111', padding: 24, borderRadius: 28, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700' }}>STOCK HEALTH</Text>
            <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFF' }}>94%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4, width: '94%' }} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <View style={{ width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Total Items</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#111', marginTop: 8 }}>412</Text>
            <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '700', marginTop: 4 }}>+12 this month</Text>
          </View>
          <View style={{ width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Low Stock</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#EF4444', marginTop: 8 }}>8</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 4 }}>Require attention</Text>
          </View>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 }}>Views vs Orders</Text>
          <View style={{ height: 200, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '600' }}>Chart visualization here</Text>
          </View>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 }}>Top Category</Text>
          <View style={{ height: 200, backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#94A3B8', fontWeight: '600' }}>Distribution chart here</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
