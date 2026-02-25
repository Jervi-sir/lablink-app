import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, StyleSheet } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";

export default function Step1Screen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Lab Profile'} />

      <View style={styles.contentContainer}>
        <BusinessRegistryProgress step={1} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <Text style={styles.title}>Tell us about your Lab</Text>
            <Text style={styles.subtitle}>
              Join our network of verified research facilities and connect with researchers.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.inputsGrid}>
              <GlobalInput
                label="Legal Laboratory Name"
                placeholder="e.g. Advanced Bio-Research Lab"
                containerStyle={styles.inputContainer}
              />
              <GlobalInput
                label="Laboratory Type"
                placeholder="e.g. Research, Commercial, University"
                containerStyle={styles.inputContainer}
              />
              <GlobalInput
                label="Contact Person Name"
                placeholder="Enter full name"
                containerStyle={styles.inputContainer}
              />
              <GlobalInput
                label="Business Email"
                placeholder="contact@labname.com"
                containerStyle={styles.inputContainer}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Button1
              text="Continue"
              onPress={() => navigation.navigate("BusinessStep2")}
              style={styles.continueBtn}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FB',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingVertical: 24,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
    paddingLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  inputsGrid: {
    gap: 16,
  },
  inputContainer: {
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  footer: {
    marginTop: 24,
  },
  continueBtn: {
    height: 56,
    backgroundColor: '#8B5CF6', // Business Purple
    borderRadius: 12,
  }
});