import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
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

export default function BusinessLoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("bizz@gmail.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const { setAuth, setAuthToken } = useAuthStore();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await apiPublic.post(buildRoute(ApiRoutes.auth.business.login), {
        email: email,
        password: password,
      });

      setAuth(response.user);
      setAuthToken(response.access_token);

      navigation.reset({
        index: 0,
        routes: [{ name: Routes.BusinessNavigation }],
      });
    } catch (error: any) {
      console.error("Business Login Error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Invalid credentials or account type.");
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
            <View style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, alignSelf: 'flex-start', marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#8B5CF6', letterSpacing: 1 }}>B2B PORTAL</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8 }}>Provider Login</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Manage your laboratory services, equipment bookings, and facility insights.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <GlobalInput
              label="Business Email"
              placeholder="e.g. contact@labfacility.com"
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

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: -4 }}>
              <Text style={{ fontSize: 14, color: '#8B5CF6', fontWeight: '600' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button1
              text="Business Login"
              onPress={handleLogin}
              style={{ height: 56, borderRadius: 12, backgroundColor: '#8B5CF6', marginTop: 12 }}
              loading={loading}
            />
          </View>
        </ScrollView>

        <View style={{ padding: 20, paddingBottom: 40, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              // Navigate to business registry
              navigation.navigate('business-registry');
            }}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 14, color: '#5D6575', fontWeight: '500' }}>
              Want to list your facility? <Text style={{ color: '#8B5CF6', fontWeight: '700' }}>Create Business Profile</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

