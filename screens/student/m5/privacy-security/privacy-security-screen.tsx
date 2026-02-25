import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../components/options/option-settings";

export default function PrivacySecurityScreen() {
  const navigation = useNavigation<any>();

  const renderSection = (title: string, items: { label: string, route?: string }[]) => (
    <OptionSettings
      title={title}
      items={items.map(item => ({
        label: item.label,
        onPress: () => item.route && navigation.navigate(item.route)
      }))}
    />
  );


  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Privacy & Security</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {renderSection("Security", [
          { label: "Change Password", route: Routes.ChangePasswordScreen },
          { label: "Two-Factor Authentication", route: Routes.TwoFactorAuthScreen },
          { label: "Login Activity", route: Routes.LoginActivityScreen }
        ])}
        {renderSection("Privacy", [
          { label: "Profile Visibility", route: Routes.ProfileVisibilityScreen },
          { label: "Data Usage", route: Routes.DataUsageScreen },
          { label: "Blocked Users" }
        ])}
      </ScrollView>
    </ScreenWrapper>
  );
}

