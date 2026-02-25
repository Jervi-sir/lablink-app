import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function ContactSupportScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Contact Support</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#137FEC', padding: 24, borderRadius: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 }}>How can we help?</Text>
          <Text style={{ fontSize: 14, color: '#DBEAFE', lineHeight: 20 }}>Send us a message and our team will get back to you within 24 hours.</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>Subject</Text>
          <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12 }} placeholder="e.g. Order Tracking Issue" />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>Message</Text>
          <TextInput
            style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 120, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12, textAlignVertical: 'top' }}
            placeholder="Describe your issue in detail..."
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={{ height: 56, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Send Message</Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 32 }} />

        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>Other ways to connect</Text>
          <TouchableOpacity style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '600' }}>📧 support@lablink.dz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '600' }}>📞 +213 (0) 23 45 67 89</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

