import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "../../components/text";
import TouchableOpacity from "../../components/touchable-opacity";
import GlobalInput from "../../components/inputs/global-input";
import { Button1 } from "../../components/buttons/button-1";
import { Routes } from "../../utils/helpers/routes";

export default function StudentRegisterScreen() {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Navigate or handle register
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
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              kind="password"
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

