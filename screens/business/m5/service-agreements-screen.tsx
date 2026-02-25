import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function ServiceAgreementsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Service Agreement</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', padding: 24, borderRadius: 28, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>Partner Terms of Use</Text>
          <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700', marginTop: 4 }}>Last Updated: Jan 2024</Text>
          <View style={{ height: 1.5, backgroundColor: '#F8FAFC', marginVertical: 20 }} />

          <View style={{ gap: 20 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>1. Lab Partnership</Text>
              <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' }}>By listing your laboratory on LabLink, you agree to provide accurate information regarding your certifications and technical capabilities.</Text>
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>2. Order Fulfillment</Text>
              <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' }}>Partners must maintain a minimum fulfillment rate of 85% to remain eligible for the LabLink Pro surfacing algorithm.</Text>
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>3. Safety & Compliance</Text>
              <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' }}>All research materials must be handled according to international biosafety standards and local Algerian regulations.</Text>
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>4. Payments & Fees</Text>
              <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, fontWeight: '500' }}>Service fees are deducted at the point of transaction. Withdrawal requests are processed within 3-5 business days depending on the bank.</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 32, backgroundColor: '#F0FDF4', padding: 16, borderRadius: 20, gap: 12 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#065F46', fontWeight: '700' }}>You have accepted these terms during registration.</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
