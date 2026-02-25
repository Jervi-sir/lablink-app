import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet } from "react-native";

export default function EditProductScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Product</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Basic Information - Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Basic Information - Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Stock Qty</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
          </View>
        </View>

        {/* Media & Documentation */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Media & Documentation</Text>

          {/* Upload Photos Box */}
          <TouchableOpacity style={styles.uploadBox}>
            <Text style={styles.uploadText}>Upload Photos</Text>
            <Text style={styles.uploadSubtext}>JPEG or PNG, max 5MB</Text>
          </TouchableOpacity>

          {/* PDF Attachment Row */}
          <View style={styles.pdfCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={styles.pdfIconPlaceholder}>
                <View style={{ width: 14, height: 18, backgroundColor: '#FF4D4D', borderRadius: 2 }} />
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111' }}>Document PDF</Text>
                <Text style={{ fontSize: 11, color: '#5D6575' }}>Document name</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.attachBtn}>
              <Text style={styles.attachBtnText}>Attach PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Publish Button */}
        <TouchableOpacity style={styles.publishBtn}>
          <Text style={styles.publishBtnText}>Publish Product</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  inputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    color: '#111',
    height: '100%',
  },
  uploadBox: {
    height: 160,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F2F5',
    borderRadius: 12,
  },
  pdfIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF3F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachBtn: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attachBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  publishBtn: {
    backgroundColor: '#137FEC',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});