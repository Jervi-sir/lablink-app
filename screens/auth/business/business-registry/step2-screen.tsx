import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { useBusinessRegistry } from "./context/business-registry-context";

export default function Step2Screen() {
  const navigation = useNavigation<any>();
  const { formData, setField } = useBusinessRegistry();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Authentication'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={2} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Business Verification</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Please provide your official registration details to ensure security and partner verification.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 16 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Registration Details</Text>
            </View>

            <View style={{ gap: 16 }}>
              <GlobalInput
                label="Business Registration No."
                placeholder="REG-000000000"
                value={formData.registrationNo}
                onChangeText={(v) => setField('registrationNo', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Tax Identification Number (NIF)"
                placeholder="123 456 789 000"
                value={formData.nif}
                onChangeText={(v) => setField('nif', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
            </View>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Certification</Text>
            </View>

            <TouchableOpacity style={{ borderWidth: 2, borderColor: '#F5F3FF', borderStyle: 'dashed', borderRadius: 14, height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBFBFF', gap: 8 }} activeOpacity={0.7}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
                {/* Mock Upload Icon */}
                <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: '#8B5CF6' }} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#8B5CF6' }}>Upload Document</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>PDF, JPG, PNG (Max 10MB)</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <TouchableOpacity
              style={{ height: 56, justifyContent: 'center', paddingHorizontal: 8 }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '600' }}>Back</Text>
            </TouchableOpacity>

            <Button1
              text="Verify & Continue"
              onPress={() => navigation.navigate("BusinessStep3")}
              style={{ flex: 1, height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}