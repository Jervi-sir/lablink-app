import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";

export default function EditContactScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [contacts, setContacts] = useState({
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    supportEmail: '',
    whatsapp: '',
    linkedin: '',
    website: ''
  });

  const fetchContactData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(ApiRoutes.businesses.me);
      const data = res.data;
      setProfile(data);

      setContacts({
        primaryPhone: data.phoneNumbers?.[0] || '',
        secondaryPhone: data.phoneNumbers?.[1] || '',
        email: data.businessEmail || '',
        supportEmail: data.supportEmail || '',
        whatsapp: data.whatsapp || '',
        linkedin: data.linkedin || '',
        website: data.website || ''
      });
    } catch (error) {
      console.error("Fetch contact error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactData();
  }, [fetchContactData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        phone_numbers: [contacts.primaryPhone, contacts.secondaryPhone].filter(p => !!p),
        business_email: contacts.email,
        support_email: contacts.supportEmail,
        website: contacts.website,
        whatsapp: contacts.whatsapp,
        linkedin: contacts.linkedin
      };

      await api.put(buildRoute(ApiRoutes.businesses.update, { id: profile.id }), payload);
      Alert.alert("Success", "Contact information updated!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Save contact error:", error);
      Alert.alert("Error", "Failed to update contact info.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Contact Information</Text>
        <TouchableOpacity style={{ padding: 8 }} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#8B5CF6" /> : <Text style={{ color: '#8B5CF6', fontWeight: '800' }}>Save</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          <View style={{ backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 20, fontWeight: '500' }}>Update your public contact details. This information will be visible to researchers for technical inquiries and communication.</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Phone Channels</Text>
            <View style={{ gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Primary Phone (Mobile)</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.primaryPhone}
                  onChangeText={(v) => setContacts({ ...contacts, primaryPhone: v })}
                  keyboardType="phone-pad"
                  placeholder="+213..."
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Secondary / Landline</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.secondaryPhone}
                  onChangeText={(v) => setContacts({ ...contacts, secondaryPhone: v })}
                  keyboardType="phone-pad"
                  placeholder="+213..."
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>WhatsApp Business</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.whatsapp}
                  onChangeText={(v) => setContacts({ ...contacts, whatsapp: v })}
                  keyboardType="phone-pad"
                  placeholder="+213..."
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Email Addresses</Text>
            <View style={{ gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Primary Business Email</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.email}
                  onChangeText={(v) => setContacts({ ...contacts, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="contact@labname.dz"
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Support Email</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.supportEmail}
                  onChangeText={(v) => setContacts({ ...contacts, supportEmail: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="support@labname.dz"
                />
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Professional Links</Text>
            <View style={{ gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Website</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.website}
                  onChangeText={(v) => setContacts({ ...contacts, website: v })}
                  autoCapitalize="none"
                  placeholder="https://www.labname.com"
                />
              </View>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>LinkedIn Page</Text>
                <TextInput
                  style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }}
                  value={contacts.linkedin}
                  onChangeText={(v) => setContacts({ ...contacts, linkedin: v })}
                  autoCapitalize="none"
                  placeholder="linkedin.com/company/labname"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

