import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Terms of Service</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginBottom: 20 }}>Last Updated: February 2026</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 }}>1. Acceptance of Terms</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 }}>By accessing or using LabLink, you agree to be bound by these terms. If you do not agree, please do not use our services.</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 }}>2. Use of Service</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 }}>LabLink provides a platform for researchers and laboratories to facilitate procurement. You are responsible for maintaining the confidentiality of your account.</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 }}>3. Procurement Policy</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 }}>All procurement requests made through LabLink are subject to the specific terms and conditions of the fulfilling laboratory. LabLink acts as an intermediary facilitator.</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 }}>4. Privacy</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 }}>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

