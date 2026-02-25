import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function EditProfileScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>Full Name</Text>
          <TextInput style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' }} placeholder="Dr. Amine Kherroubi" />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>Email Address</Text>
          <TextInput style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' }} placeholder="amine.k@usthb.dz" keyboardType="email-address" />
        </View>
        <TouchableOpacity style={{ height: 56, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

