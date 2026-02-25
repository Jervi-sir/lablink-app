import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

export default function EditLabProfileScreen() {
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({
    name: 'Advanced Bio-Research Lab',
    type: 'Commercial Laboratory',
    address: 'USTHB Tech Park, Algiers',
    phone: '+213 550 123 456',
    email: 'contact@bioresearch-lab.dz',
    bio: 'Dedicated to providing high-quality research equipment and analytical services to the scientific community in Algeria.'
  });

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Lab Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarBox}>
              <Text style={{ fontSize: 40 }}>🔬</Text>
              <View style={styles.editBadge}>
                <Text style={{ fontSize: 12 }}>📸</Text>
              </View>
            </View>
            <Text style={styles.avatarLabel}>Tap to change logo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Laboratory Name</Text>
              <TextInput style={styles.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Business Type</Text>
              <TextInput style={styles.input} value={form.type} onChangeText={(v) => setForm({ ...form, type: v })} />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Public Bio / Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={form.bio}
                onChangeText={(v) => setForm({ ...form, bio: v })}
                multiline
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput style={styles.input} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Physical Address</Text>
              <TextInput style={styles.input} value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} />
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
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarBox: { width: 100, height: 100, borderRadius: 32, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' },
  editBadge: { position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F8F9FB' },
  avatarLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 12 },
  form: { gap: 20 },
  inputWrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 },
  input: { backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
});
