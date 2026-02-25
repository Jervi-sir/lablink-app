import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "../../components/text";
import TouchableOpacity from "../../components/touchable-opacity";
import GlobalInput from "../../components/inputs/global-input";
import { Button1 } from "../../components/buttons/button-1";
import { Routes } from "../../utils/helpers/routes";

export default function BusinessLoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Navigate to business navigation or handle login
    navigation.navigate(Routes.BusinessNavigation);
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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>B2B PORTAL</Text>
            </View>
            <Text style={styles.title}>Provider Login</Text>
            <Text style={styles.subtitle}>
              Manage your laboratory services, equipment bookings, and facility insights.
            </Text>
          </View>

          <View style={styles.form}>
            <GlobalInput
              label="Business Email"
              placeholder="e.g. contact@labfacility.com"
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
              text="Business Login"
              onPress={handleLogin}
              style={styles.loginBtn}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              // Navigate to business registry
              navigation.navigate('business-registry');
            }}
            style={styles.registerLink}
          >
            <Text style={styles.footerText}>
              Want to list your facility? <Text style={styles.footerLinkText}>Create Business Profile</Text>
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
  badge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1,
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
    color: '#8B5CF6',
    fontWeight: '600',
  },
  loginBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#8B5CF6', // Purple for Business
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
    color: '#8B5CF6',
    fontWeight: '700',
  },
});
