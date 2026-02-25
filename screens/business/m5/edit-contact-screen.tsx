import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function EditContactScreen() {
  const navigation = useNavigation<any>();
  const [contacts, setContacts] = useState({
    primaryPhone: '+213 550 123 456',
    secondaryPhone: '+213 21 45 67 89',
    email: 'contact@bioresearch-lab.dz',
    supportEmail: 'support@bioresearch-lab.dz',
    whatsapp: '+213 550 123 456',
    linkedin: 'linkedin.com/company/adv-bio-lab'
  });

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Information</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Update your public contact details. This information will be visible to researchers for technical inquiries and communication.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phone Channels</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Primary Phone (Mobile)</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.primaryPhone}
                  onChangeText={(v) => setContacts({ ...contacts, primaryPhone: v })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Secondary / Landline</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.secondaryPhone}
                  onChangeText={(v) => setContacts({ ...contacts, secondaryPhone: v })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>WhatsApp Business</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.whatsapp}
                  onChangeText={(v) => setContacts({ ...contacts, whatsapp: v })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Addresses</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Primary Business Email</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.email}
                  onChangeText={(v) => setContacts({ ...contacts, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>Support Email</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.supportEmail}
                  onChangeText={(v) => setContacts({ ...contacts, supportEmail: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Links</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Text style={styles.label}>LinkedIn Page</Text>
                <TextInput
                  style={styles.input}
                  value={contacts.linkedin}
                  onChangeText={(v) => setContacts({ ...contacts, linkedin: v })}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  saveBtn: { padding: 8 },
  saveBtnText: { color: '#8B5CF6', fontWeight: '800' },
  scrollContent: { padding: 20 },
  infoBox: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  infoText: { fontSize: 13, color: '#64748B', lineHeight: 20, fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  inputGroup: { gap: 16 },
  inputWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 },
  input: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' },
});
