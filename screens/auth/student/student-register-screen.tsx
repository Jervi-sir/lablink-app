import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../../components/screen-wrapper";
import Text from "../../../components/text";
import TouchableOpacity from "../../../components/touchable-opacity";
import GlobalInput from "../../../components/inputs/global-input";
import { Button1 } from "../../../components/buttons/button-1";
import { Routes } from "../../../utils/helpers/routes";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";

export default function StudentRegisterScreen() {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState("sdfsdf");
  const [email, setEmail] = useState("gacembekhira@gmail.com");
  const [password, setPassword] = useState("password");
  const [studentCardId, setStudentCardId] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuthStore((s) => s.auth);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAuthToken = useAuthStore((s) => s.setAuthToken);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await apiPublic.post(buildRoute(ApiRoutes.auth.student.register), {
        email: email,
        password: password,
        full_name: fullName,
        student_card_id: studentCardId,
      })
      setAuth(response.user);
      setAuthToken(response.access_token);
      navigation.reset({ index: 0, routes: [{ name: Routes.StudentNavigation }] });
    } catch (error: any) {
      console.error("Register Error:", error.response?.data || error.message || error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: "#F8F9FB" }} statusBarStyle="dark-content">
      <View style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity
          style={{ paddingHorizontal: 20, paddingVertical: 16 }}
          onPress={() => navigation.goBack()}
        >
          <View style={{ width: 12, height: 12, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#111', transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View style={{ marginTop: 10, marginBottom: 32 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8 }}>Create Account</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Join the LabLink community and start your research journey today.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <GlobalInput
              label="Full Name"
              placeholder="e.g. John Doe"
              value={fullName}
              onChangeText={setFullName}
              containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
            />

            <GlobalInput
              label="Email Address"
              placeholder="e.g. j.doe@university.edu"
              value={email}
              onChangeText={setEmail}
              kind="email"
              containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              autoCapitalize="none"
            />

            <GlobalInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              kind="password"
              containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
            />

            <GlobalInput
              label="Student ID (Optional)"
              placeholder="e.g. ST-2024-001"
              value={studentCardId}
              onChangeText={setStudentCardId}
              containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
            />

            <View style={{ marginTop: 4, marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18, textAlign: 'center' }}>
                By creating an account, you agree to our <Text style={{ color: '#137FEC', fontWeight: '600' }}>Terms of Service</Text> and <Text style={{ color: '#137FEC', fontWeight: '600' }}>Privacy Policy</Text>.
              </Text>
            </View>

            <Button1
              text="Create Account"
              onPress={handleRegister}
              style={{ height: 56, borderRadius: 12, backgroundColor: '#1E70E8' }}
              loading={loading}
            />
          </View>
        </ScrollView>

        <View style={{ padding: 20, paddingBottom: 40, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.StudentLoginScreen)}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 14, color: '#5D6575', fontWeight: '500' }}>
              Already have an account? <Text style={{ color: '#137FEC', fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

