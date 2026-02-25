import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function BusinessSupportScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Business Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🎧</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#111', textAlign: 'center' }}>How can we help your lab?</Text>
          <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22, fontWeight: '500' }}>Our business priority team is available 24/7 for our Pro partners.</Text>
        </View>

        <View style={{ gap: 12, marginTop: 20 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 24, gap: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20 }}>💬</Text></View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Start Live Chat</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>Typical response time: 5 mins</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 24, gap: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 20 }}>📧</Text></View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Email Priority Support</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>business@lablink.dz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 32 }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 }}>Submit a technical ticket</Text>
          <View style={{ gap: 12 }}>
            <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }} placeholder="Subject of issue" placeholderTextColor="#94A3B8" />
            <TextInput style={[{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }, { height: 120, paddingTop: 16, textAlignVertical: 'top' }]} placeholder="Describe the technical error or request..." placeholderTextColor="#94A3B8" multiline />
            <TouchableOpacity style={{ backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

