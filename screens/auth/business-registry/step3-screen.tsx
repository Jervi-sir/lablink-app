import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";

const SPECIALIZATIONS = ['Organic Chemistry', 'Bioengineering', 'Genomics', 'PCR Analysis'];

export default function Step3Screen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Public Profile'} />

      <View style={styles.contentContainer}>
        <BusinessRegistryProgress step={3} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <Text style={styles.title}>Public Presence</Text>
            <Text style={styles.subtitle}>
              Add a logo and description to help students identify your laboratory facility.
            </Text>
          </View>

          <View style={styles.mainCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Laboratory Branding</Text>
            </View>

            {/* Avatar Upload */}
            <TouchableOpacity style={styles.avatarSection} activeOpacity={0.8}>
              <View style={styles.avatarPlaceholder}>
                <View style={styles.cameraBtn}>
                  {/* Mock Camera Icon */}
                  <View style={styles.cameraIconGraphic} />
                </View>
              </View>
              <Text style={styles.uploadText}>Upload Laboratory Logo</Text>
            </TouchableOpacity>

            <View style={styles.formFields}>
              <GlobalInput
                label="About the Lab"
                placeholder="Briefly describe your services and expertise..."
                containerStyle={styles.inputContainer}
                multiline
                numberOfLines={4}
                kind="multiline"
              />

              <View style={styles.specializationSection}>
                <Text style={styles.label}>Specialization Area</Text>
                <GlobalInput
                  placeholder="Add a specialization..."
                  containerStyle={styles.inputContainer}
                  right={<View style={styles.plusIcon} />}
                />
                <View style={styles.chipsRow}>
                  {SPECIALIZATIONS.map((tag) => (
                    <View key={tag} style={styles.chip}>
                      <Text style={styles.chipText}>{tag}</Text>
                      <View style={styles.removeIcon} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button1
              text="Complete Registration"
              onPress={() => navigation.navigate(Routes.BusinessNavigation)}
              style={styles.completeBtn}
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
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8B5CF6',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconGraphic: {
    width: 16,
    height: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 2,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  formFields: {
    gap: 20,
  },
  inputContainer: {
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  specializationSection: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 100,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  removeIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#8B5CF6',
    borderRadius: 7,
    opacity: 0.3,
  },
  plusIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },
  footer: {
    marginTop: 32,
  },
  completeBtn: {
    height: 56,
    backgroundColor: '#8B5CF6', // Business Purple
    borderRadius: 12,
  }
});