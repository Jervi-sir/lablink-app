import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";

const FEATURES = [
  "Unlimited Product Listings",
  "Priority Placement in Search",
  "Advanced Analytics & Insights",
  "24/7 Dedicated Business Support",
  "Zero Transaction Fees",
  "Bulk Order Management Tools"
];

export default function ProPlanStatusScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Plan Status</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#111', padding: 28, borderRadius: 32, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>CURRENT PLAN</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFF', marginTop: 8 }}>LabLink Pro</Text>
            </View>
            <View style={{ backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
              <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '900' }}>ACTIVE</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 24 }} />

          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Your subscription will automatically renew on <Text style={{ color: '#FFF', fontWeight: '800' }}>March 12, 2024</Text></Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20, marginLeft: 4 }}>Included Pro Features</Text>
          <View style={{ gap: 16 }}>
            {FEATURES.map((feature, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#10B981', fontWeight: '900' }}>✓</Text>
                </View>
                <Text style={{ fontSize: 15, color: '#475569', fontWeight: '600' }}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={{ backgroundColor: '#FFF', height: 60, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#111', fontWeight: '800', fontSize: 15 }}>Manage Subscription</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}
