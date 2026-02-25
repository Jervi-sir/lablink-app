import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "../../components/text";
import TouchableOpacity from "../../components/touchable-opacity";
import GlobalInput from "../../components/inputs/global-input";
import { Button1 } from "../../components/buttons/button-1";
import { Routes } from "../../utils/helpers/routes";

export default function StudentLoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Navigate to student navigation or handle login
    navigation.navigate(Routes.StudentNavigation);
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
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', marginBottom: 8 }}>Student Login</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Access your research tools and equipment bookings.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
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

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: -4 }}>
              <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '600' }}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button1
              text="Login"
              onPress={handleLogin}
              style={{ height: 56, borderRadius: 12, backgroundColor: '#1E70E8', marginTop: 12 }}
            />
          </View>
        </ScrollView>

        <View style={{ padding: 20, paddingBottom: 40, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.StudentRegisterScreen)}
            style={{ padding: 10 }}
          >
            <Text style={{ fontSize: 14, color: '#5D6575', fontWeight: '500' }}>
              Don't have an account? <Text style={{ color: '#137FEC', fontWeight: '700' }}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

