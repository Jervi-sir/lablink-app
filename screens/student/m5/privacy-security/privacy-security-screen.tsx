import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../components/options/option-settings";
import { paddingHorizontal } from "@/utils/variables/styles";

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
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Privacy & Security</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        {renderSection("Security", [
          { label: "Change Password", route: Routes.ChangePasswordScreen },
          { label: "Two-Factor Authentication", route: Routes.TwoFactorAuthScreen },
          { label: "Login Activity", route: Routes.LoginActivityScreen }
        ])}
        {renderSection("Privacy", [
          { label: "Profile Visibility", route: Routes.ProfileVisibilityScreen },
          { label: "Data Usage", route: Routes.DataUsageScreen },
        ])}
      </ScrollView>
    </ScreenWrapper>
  );
}

