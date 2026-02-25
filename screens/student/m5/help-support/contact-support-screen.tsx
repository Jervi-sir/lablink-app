import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function ContactSupportScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How can we help?</Text>
          <Text style={styles.infoDesc}>Send us a message and our team will get back to you within 24 hours.</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subject</Text>
          <TextInput style={styles.input} placeholder="e.g. Order Tracking Issue" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your issue in detail..."
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send Message</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.otherInfo}>
          <Text style={styles.otherTitle}>Other ways to connect</Text>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>📧 support@lablink.dz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>📞 +213 (0) 23 45 67 89</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8FAFC' },
  header: {
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  infoCard: { backgroundColor: '#137FEC', padding: 24, borderRadius: 24, marginBottom: 24 },
  infoTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  infoDesc: { fontSize: 14, color: '#DBEAFE', lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12 },
  textArea: { height: 120, textAlignVertical: 'top' },
  sendBtn: { height: 56, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  sendBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 32 },
  otherInfo: { gap: 12 },
  otherTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  linkRow: { paddingVertical: 4 },
  linkText: { fontSize: 15, color: '#64748B', fontWeight: '600' }
});
