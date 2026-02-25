import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: February 2026</Text>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>By accessing or using LabLink, you agree to be bound by these terms. If you do not agree, please do not use our services.</Text>

          <Text style={styles.sectionTitle}>2. Use of Service</Text>
          <Text style={styles.text}>LabLink provides a platform for researchers and laboratories to facilitate procurement. You are responsible for maintaining the confidentiality of your account.</Text>

          <Text style={styles.sectionTitle}>3. Procurement Policy</Text>
          <Text style={styles.text}>All procurement requests made through LabLink are subject to the specific terms and conditions of the fulfilling laboratory. LabLink acts as an intermediary facilitator.</Text>

          <Text style={styles.sectionTitle}>4. Privacy</Text>
          <Text style={styles.text}>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.</Text>
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
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  lastUpdated: { fontSize: 13, color: '#94A3B8', fontWeight: '600', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8 },
  text: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24 }
});
