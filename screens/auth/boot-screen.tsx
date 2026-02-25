import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
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
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.brandName}>LabLink</Text>
            <Text style={styles.tagline}>Research & Innovation Redefined</Text>
          </View>
        </Animated.View>

        {/* Progress Indicator from DESIGN_SYSTEM.md */}
        <Animated.View
          style={[
            styles.progressContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
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

        <View style={styles.footer}>
          <Text style={styles.version} capitalize={false}>version 1.0.0</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8F9FB", // App Background from DESIGN_SYSTEM.md
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    // Standard Shadow from DESIGN_SYSTEM.md
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  logo: {
    width: 60,
    height: 60,
  },
  textContainer: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 34,
    fontWeight: "800", // Near black for strong hierarchy
    color: "#111111",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280", // Muted text from Design System
    marginTop: 6,
  },
  progressContainer: {
    width: '50%',
    marginTop: 40,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#137FEC', // Primary Blue from DESIGN_SYSTEM.md
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  version: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 1,
  },
});