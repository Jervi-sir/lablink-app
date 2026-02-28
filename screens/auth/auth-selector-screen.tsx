import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { Svg, Path, Rect, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  useDerivedValue
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const StudentIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17L12 22L22 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12L12 17L22 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BusinessIcon = ({ color }: { color: string }) => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 7V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M11 3V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 11V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 11H7.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 15H7.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 11H15.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 15H15.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 7H15.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function AuthSelectorScreen() {
  const navigation = useNavigation<any>();
  const [selectedRole, setSelectedRole] = useState<'student' | 'business' | null>(null);

  const handleRoleSelect = (role: 'student' | 'business') => {
    setSelectedRole(role);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentRegisterScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate('business-registry');
    }
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentLoginScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate(Routes.BusinessLoginScreen);
    } else {
      // Default to student login if none selected? Or show options?
      // For UX, let's just go back to a default if they click login without role
      navigation.navigate(Routes.StudentLoginScreen);
    }
  };

  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(selectedRole ? 0 : 20) }],
      opacity: withTiming(selectedRole ? 1 : 0.8)
    };
  }, [selectedRole]);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      {/* Decorative Background Element */}
      <View style={styles.backgroundDecoration}>
        <Svg width={width} height={width} viewBox="0 0 400 400">
          <Circle cx="400" cy="0" r="200" fill="url(#grad)" opacity="0.4" />
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={selectedRole === 'business' ? '#8B5CF6' : '#137FEC'} stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#F8F9FB" stopOpacity="0" />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>

      <View style={{ flex: 1 }}>
        {/* Back Button */}
        <TouchableOpacity
          style={{ paddingHorizontal: 20, paddingVertical: 16 }}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <View style={{ marginTop: 8, marginBottom: 40 }}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>GET STARTED</Text>
            </View>
            <Text style={styles.title}>Join LabLink</Text>
            <Text style={styles.subtitle}>
              Select the account type that best describes your needs to access our ecosystem.
            </Text>
          </View>

          {/* Cards */}
          <View style={{ gap: 20 }}>
            <SelectableCard
              id="student"
              title="Student / Researcher"
              description="Find verified labs, book specialized equipment, and source materials for your research."
              icon={<StudentIcon color={selectedRole === 'student' ? '#137FEC' : '#64748B'} />}
              isSelected={selectedRole === 'student'}
              onPress={() => handleRoleSelect('student')}
              accentColor="#137FEC"
              lightAccent="#E7F2FD"
            />

            <SelectableCard
              id="business"
              title="Laboratory / Supplier"
              description="List your facility services, manage equipment bookings, and connect with academic talent."
              icon={<BusinessIcon color={selectedRole === 'business' ? '#8B5CF6' : '#64748B'} />}
              isSelected={selectedRole === 'business'}
              onPress={() => handleRoleSelect('business')}
              accentColor="#8B5CF6"
              lightAccent="#F5F3FF"
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <Animated.View style={[styles.footer, footerAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.continueButton,
              { backgroundColor: selectedRole === 'business' ? '#8B5CF6' : '#137FEC' },
              !selectedRole && { backgroundColor: '#CBD5E1' }
            ]}
            disabled={!selectedRole}
          >
            <Text style={styles.continueButtonText}>Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={[styles.loginTextPrimary, { color: selectedRole === 'business' ? '#8B5CF6' : '#137FEC' }]}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}

interface SelectableCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  accentColor: string;
  lightAccent: string;
}

function SelectableCard({ title, description, icon, isSelected, onPress, accentColor, lightAccent }: SelectableCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.02 : 1) }],
      borderColor: withTiming(isSelected ? accentColor : '#E2E8F0'),
      backgroundColor: withTiming(isSelected ? '#FFFFFF' : '#FFFFFF'),
      borderWidth: isSelected ? 2 : 1,
      shadowOpacity: withTiming(isSelected ? 0.15 : 0.05),
    };
  });

  const checkmarkOpacity = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0),
    transform: [{ scale: withSpring(isSelected ? 1 : 0.5) }]
  }));

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: isSelected ? lightAccent : '#F1F5F9' }]}>
          {icon}
        </View>

        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Animated.View style={[styles.checkmark, { backgroundColor: accentColor }, checkmarkOpacity]}>
              <Svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <Path d="M1 4L3.5 6.5L9 1" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Animated.View>
          </View>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backgroundDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    zIndex: 0,
  },
  backArrow: {
    width: 12,
    height: 12,
  },
  badge: {
    backgroundColor: '#E7F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#137FEC',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 24,
  },
  card: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontWeight: '500',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 24,
    gap: 16,
    paddingBottom: 48,
    backgroundColor: 'rgba(248, 249, 251, 0.95)',
  },
  continueButton: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  loginTextPrimary: {
    fontWeight: '800',
  },
});