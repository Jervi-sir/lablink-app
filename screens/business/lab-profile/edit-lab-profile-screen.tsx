import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet, Dimensions } from "react-native";

export default function EditLabProfileScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navBtn}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Lab Profile</Text>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <TouchableOpacity style={styles.cameraBtn}>
              {/* Camera Icon Placeholder */}
              <View style={styles.cameraIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview Public Profile Button */}
        <TouchableOpacity style={styles.previewBtn}>
          <View style={styles.eyeIcon} />
          <Text style={styles.previewBtnText}>Preview Public Profile</Text>
        </TouchableOpacity>

        {/* Lab Identity Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lab Identity</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lab Name</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description/ Bio</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Placeholder"
                placeholderTextColor="#A0AEC0"
                multiline
              />
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" keyboardType="email-address" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" keyboardType="phone-pad" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Business Address Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Business Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wilaya</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Placeholder" placeholderTextColor="#A0AEC0" />
            </View>
          </View>
        </View>

        {/* Certification Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Certification</Text>

          {/* Existing Certification Row */}
          <View style={styles.certItem}>
            <View style={styles.certIconBg}>
              <View style={styles.pdfIconGraphic} />
            </View>
            <View style={styles.certInfo}>
              <Text style={styles.certFileName}>pdf.file</Text>
              <Text style={styles.certMeta}>2.4 MB - Uploaded Oct 12</Text>
            </View>
            <TouchableOpacity style={styles.trashBtn}>
              <View style={styles.trashIcon} />
            </TouchableOpacity>
          </View>

          {/* Upload Box */}
          <TouchableOpacity style={styles.uploadBox}>
            <View style={styles.uploadIconContainer}>
              <View style={styles.fileIcon} />
            </View>
            <Text style={styles.uploadText}>Upload Certification</Text>
            <Text style={styles.uploadSubtext}>PDF, JPG, PNG up to 10MB</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  navBtn: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#111',
    transform: [{ rotate: '-45deg' }],
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: '#D9D9D9',
    borderRadius: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cameraBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#137FEC',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    marginRight: 4,
    marginBottom: 4,
  },
  cameraIcon: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 2,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F2FD',
    height: 48,
    borderRadius: 12,
    gap: 10,
    marginBottom: 8,
  },
  previewBtnText: {
    fontSize: 14,
    color: '#137FEC',
    fontWeight: '600',
  },
  eyeIcon: {
    width: 18,
    height: 12,
    borderWidth: 2,
    borderColor: '#137FEC',
    borderRadius: 6,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
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
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  textAreaContainer: {
    height: 120,
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },
  input: {
    fontSize: 14,
    color: '#111',
    height: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F2F5',
    borderRadius: 12,
    gap: 12,
  },
  certIconBg: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF3F3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIconGraphic: {
    width: 16,
    height: 20,
    backgroundColor: '#FF4D4D',
    borderRadius: 2,
  },
  certInfo: {
    flex: 1,
  },
  certFileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  certMeta: {
    fontSize: 12,
    color: '#5D6575',
    marginTop: 2,
  },
  trashBtn: {
    padding: 8,
  },
  trashIcon: {
    width: 18,
    height: 20,
    backgroundColor: '#111',
    borderRadius: 2,
  },
  uploadBox: {
    height: 160,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E7F2FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIcon: {
    width: 14,
    height: 18,
    borderWidth: 2,
    borderColor: '#137FEC',
    borderRadius: 2,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#137FEC',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});
