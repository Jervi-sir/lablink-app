import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

import { Routes } from "@/utils/helpers/routes";

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.FAQScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>Frequently Asked Questions</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.ContactSupportScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>Contact Support</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.TermsOfServiceScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>Terms of Service</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: '-45deg' }] }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

