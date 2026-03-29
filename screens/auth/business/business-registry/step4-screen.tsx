import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, TouchableOpacity, Alert, TextInput } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useBusinessRegistry } from "./context/business-registry-context";
import { useRef, useState } from "react";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";

export default function Step4Screen() {
  const navigation = useNavigation<any>();
  const { formData, setField, resetForm } = useBusinessRegistry();
  const [loading, setLoading] = useState(false);
  const { setAuth, setAuthToken } = useAuthStore();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nif: formData.nif,
        business_registration_no: formData.registrationNo,
        type: formData.type,
        contact_name: formData.contactName,
        description: formData.description,
        specializations: formData.specializations,
        laboratory_category_id: formData.laboratoryCategoryId,
        business_category: formData.businessCategory,
        wilaya_id: formData.wilayaId,
        address: formData.address,
        certificate: formData.certificate,
        logo: formData.logo,
      };

      const response = await apiPublic.post(buildRoute(ApiRoutes.auth.business.register), payload);

      setAuth(response.user);
      setAuthToken(response.access_token);
      resetForm();

      navigation.reset({
        index: 0,
        routes: [{ name: Routes.BusinessNavigation }],
      });
    } catch (error: any) {
      console.error("Business Register Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Account Setup'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={4} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Create your business account</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Add the main contact details used to manage your laboratory profile.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Account Information</Text>
            </View>

            <View style={{ gap: 16 }}>
              <GlobalInput
                label="Contact Person Name"
                placeholder="Enter full name"
                value={formData.contactName}
                onChangeText={(v) => setField('contactName', v)}
                onSubmitEditing={() => emailInputRef.current?.focus()}
                returnKeyType="next"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                ref={emailInputRef}
                label="Business Email"
                placeholder="contact@labname.com"
                value={formData.email}
                onChangeText={(v) => setField('email', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                returnKeyType="next"
              />
              <GlobalInput
                ref={passwordInputRef}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(v) => setField('password', v)}
                kind="password"
                returnKeyType="done"
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <TouchableOpacity
              style={{ height: 56, justifyContent: 'center', paddingHorizontal: 8 }}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '600' }}>Back</Text>
            </TouchableOpacity>

            <Button1
              text="Complete Registration"
              onPress={handleRegister}
              style={{ flex: 1, height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
              loading={loading}
              disabled={!formData.contactName || !formData.email || !formData.password}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
