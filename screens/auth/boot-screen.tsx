import React, { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "../../components/text";
import { Routes } from "../../utils/helpers/routes";
import { getStoredToken } from "@/utils/async-storage/auth-async-storage";
import api, { setAxiosAuthToken } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";

export default function BootScreen() {
  const navigation = useNavigation<any>();

  const auth = useAuthStore((s) => s.auth);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAuthToken = useAuthStore((s) => s.setAuthToken);
  const setAuthType = useAuthStore((s) => s.setAuthType);

  // Use useRef for animated values to maintain their state
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const checkAuth = async () => {
      const startTime = Date.now();
      let targetRoute = Routes.AuthSelectorScreen;

      try {
        const token = await getStoredToken();

        if (token) {
          // Set the token in our axios instance
          setAxiosAuthToken(token);

          // Verify the token by getting user profile
          const response = await api.get(buildRoute(ApiRoutes.auth.student.me));

          if (response && response.user) {
            setAuth(response.user);
            setAuthToken(token);
            setAuthType(response.authType || "student");
            targetRoute = Routes.StudentNavigation;
          } else {
            setAxiosAuthToken(null);
          }
        }
      } catch (error) {
        // If it's a 401, we should definitely clear the token
        // @ts-ignore
        if (error?.response?.status === 401) {
          setAxiosAuthToken(null);
        }
        console.error("Auth verification failed:", error);
      } finally {
        // Ensure splash screen is visible for at least 2 seconds
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2000 - elapsed);

        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: targetRoute }] });
        }, remaining);
      }
    };

    checkAuth();
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenWrapper style={{ backgroundColor: "#F8F9FB" }} statusBarStyle="dark-content">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[
            { alignItems: "center" },
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
            marginBottom: 24,
          }}>
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 34, fontWeight: "800", color: "#111111", letterSpacing: -0.5 }}>LabLink</Text>
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#6B7280", marginTop: 6 }}>Research & Innovation Redefined</Text>
          </View>
        </Animated.View>

        {/* Progress Indicator */}
        <Animated.View
          style={[
            { width: '50%', marginTop: 40, alignItems: 'center' },
            { opacity: fadeAnim }
          ]}
        >
          <View style={{ width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <Animated.View
              style={[
                { height: '100%', backgroundColor: '#137FEC' },
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  })
                }
              ]}
            />
          </View>
        </Animated.View>

        <View style={{ position: "absolute", bottom: 50 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#9CA3AF", letterSpacing: 1 }} capitalize={false}>version 1.0.0</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}