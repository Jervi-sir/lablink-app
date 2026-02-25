import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";

export default function Step1Screen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Lab Profile'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={1} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Tell us about your Lab</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Join our network of verified research facilities and connect with researchers.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Basic Information</Text>
            </View>

            <View style={{ gap: 16 }}>
              <GlobalInput
                label="Legal Laboratory Name"
                placeholder="e.g. Advanced Bio-Research Lab"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Laboratory Type"
                placeholder="e.g. Research, Commercial, University"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Contact Person Name"
                placeholder="Enter full name"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Business Email"
                placeholder="contact@labname.com"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Button1
              text="Continue"
              onPress={() => navigation.navigate("BusinessStep2")}
              style={{ height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}