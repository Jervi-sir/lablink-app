import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function TwoFactorAuthScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Two-Factor Auth</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 }}>Protect your account</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 20 }}>Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Enable 2FA</Text>
            <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Use authenticator app</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
          />
        </View>

        {isEnabled && (
          <View style={{ marginTop: 20, padding: 16, backgroundColor: '#EFF6FF', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#137FEC' }}>
            <Text style={{ color: '#1E40AF', fontSize: 14, textAlign: 'center' }}>Authenticator app setup instructions would go here...</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

