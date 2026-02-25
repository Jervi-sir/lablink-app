import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function BusinessSupportScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroBox}>
          <Text style={styles.heroIcon}>🎧</Text>
          <Text style={styles.heroTitle}>How can we help your lab?</Text>
          <Text style={styles.heroSub}>Our business priority team is available 24/7 for our Pro partners.</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.iconBg}><Text style={{ fontSize: 20 }}>💬</Text></View>
            <View>
              <Text style={styles.optionTitle}>Start Live Chat</Text>
              <Text style={styles.optionSub}>Typical response time: 5 mins</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}><Text style={{ fontSize: 20 }}>📧</Text></View>
            <View>
              <Text style={styles.optionTitle}>Email Priority Support</Text>
              <Text style={styles.optionSub}>business@lablink.dz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Submit a technical ticket</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Subject of issue" placeholderTextColor="#94A3B8" />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the technical error or request..." placeholderTextColor="#94A3B8" multiline />
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  heroBox: { alignItems: 'center', marginVertical: 20 },
  heroIcon: { fontSize: 48, marginBottom: 16 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#111', textAlign: 'center' },
  heroSub: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22, fontWeight: '500' },
  options: { gap: 12, marginTop: 20 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 24, gap: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBg: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  optionTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  optionSub: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 2 },
  formSection: { marginTop: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginLeft: 4 },
  form: { gap: 12 },
  input: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#8B5CF6', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
