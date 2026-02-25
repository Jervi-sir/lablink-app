import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";

export default function Step2Screen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Authentication'} />

      <View style={styles.contentContainer}>
        <BusinessRegistryProgress step={2} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <Text style={styles.title}>Business Verification</Text>
            <Text style={styles.subtitle}>
              Please provide your official registration details to ensure security and partner verification.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Registration Details</Text>
            </View>

            <View style={styles.inputsGrid}>
              <GlobalInput
                label="Business Registration No."
                placeholder="REG-000000000"
                containerStyle={styles.inputContainer}
              />
              <GlobalInput
                label="Tax Identification Number (NIF)"
                placeholder="123 456 789 000"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>

          <View style={styles.certificationCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certification</Text>
            </View>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
              <View style={styles.uploadIconContainer}>
                {/* Mock Upload Icon */}
                <View style={styles.uploadIconGraphic} />
              </View>
              <Text style={styles.uploadMainText}>Upload Document</Text>
              <Text style={styles.uploadSubText}>PDF, JPG, PNG (Max 10MB)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>

            <Button1
              text="Verify & Continue"
              onPress={() => navigation.navigate("BusinessStep3")}
              style={styles.verifyBtn}
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
    marginBottom: 16,
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
  certificationCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#F5F3FF',
    borderStyle: 'dashed',
    borderRadius: 14,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFF',
    gap: 8,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconGraphic: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  uploadMainText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  uploadSubText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  backBtn: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  verifyBtn: {
    flex: 1,
    height: 56,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
  },
});