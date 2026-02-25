import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Student Login</Text>
            <Text style={styles.subtitle}>
              Access your research tools and equipment bookings.
            </Text>
          </View>

          <View style={styles.form}>
            <GlobalInput
              label="Email Address"
              placeholder="e.g. j.doe@university.edu"
              value={email}
              onChangeText={setEmail}
              kind="email"
              containerStyle={styles.inputContainer}
              autoCapitalize="none"
            />

            <GlobalInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              kind="password"
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button1
              text="Login"
              onPress={handleLogin}
              style={styles.loginBtn}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate(Routes.StudentRegisterScreen)}
            style={styles.registerLink}
          >
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.footerLinkText}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8F9FB",
  },
  container: {
    flex: 1,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#111',
    transform: [{ rotate: '-45deg' }],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 14,
    color: '#137FEC',
    fontWeight: '600',
  },
  loginBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1E70E8',
    marginTop: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  registerLink: {
    padding: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#5D6575',
    fontWeight: '500',
  },
  footerLinkText: {
    color: '#137FEC',
    fontWeight: '700',
  },
});
