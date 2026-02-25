import { View, ScrollView, StyleSheet } from "react-native";
import { ScreenWrapper } from "../../components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

export default function AuthSelectorScreen() {
  const navigation = useNavigation<any>();
  const [selectedRole, setSelectedRole] = useState<'student' | 'business' | null>(null);

  const accountTypes = [
    {
      id: 'student',
      title: "Student / Researcher",
      description: "Find verified labs, book specialized equipment, and source materials for your research projects.",
      iconColor: '#137FEC',
      iconBg: '#E7F2FD',
    },
    {
      id: 'business',
      title: "Laboratory / Supplier",
      description: "List your facility services, manage equipment bookings, and connect with top academic talent.",
      iconColor: '#8B5CF6',
      iconBg: '#F5F3FF',
    }
  ];

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentRegisterScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate('business-registry');
    }
  };

  const handleLogin = () => {
    if (selectedRole === 'student') {
      navigation.navigate(Routes.StudentLoginScreen);
    } else if (selectedRole === 'business') {
      navigation.navigate(Routes.BusinessLoginScreen);
    } else {
      // If no role selected, maybe prompt or just do nothing
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backArrow} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to LabLink</Text>
            <Text style={styles.subtitle}>
              Choose your account type to get started with a personalized experience.
            </Text>
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            {accountTypes.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedRole(item.id as any)}
                style={[
                  styles.roleCard,
                  selectedRole === item.id && styles.selectedCard,
                  selectedRole === item.id && item.id === 'business' && styles.selectedCardBusiness
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                  {/* Mock Icon Graphic */}
                  <View style={[styles.iconGraphic, { backgroundColor: item.iconColor }]} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.continueBtn,
              !selectedRole && styles.disabledBtn,
              selectedRole === 'business' && { backgroundColor: '#8B5CF6' }
            ]}
            disabled={!selectedRole}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleLogin}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={selectedRole === 'business' ? { color: '#8B5CF6' } : { color: '#137FEC' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
    borderColor: '#000',
    transform: [{ rotate: '-45deg' }],
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#137FEC',
  },
  selectedCardBusiness: {
    borderColor: '#8B5CF6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGraphic: {
    width: 20,
    height: 16,
    borderRadius: 2,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  continueBtn: {
    backgroundColor: '#1E70E8',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});