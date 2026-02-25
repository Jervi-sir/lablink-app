import React, { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "../../components/text";
import { Routes } from "../../utils/helpers/routes";

export default function BootScreen() {
  const navigation = useNavigation<any>();

  // Use useRef for animated values to maintain their state
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
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

    // Navigate after delay
    const timer = setTimeout(() => {
      navigation.replace(Routes.AuthSelectorScreen);
    }, 2800);

    return () => clearTimeout(timer);
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