import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
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
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Edit Lab Profile</Text>
        <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#8B5CF6', fontWeight: '800' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ width: 100, height: 100, borderRadius: 32, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' }}>
              <Text style={{ fontSize: 40 }}>🔬</Text>
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#F8F9FB' }}>
                <Text style={{ fontSize: 12 }}>📸</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 12 }}>Tap to change logo</Text>
          </View>

          <View style={{ gap: 20 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Laboratory Name</Text>
              <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Business Type</Text>
              <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }} value={form.type} onChangeText={(v) => setForm({ ...form, type: v })} />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Public Bio / Description</Text>
              <TextInput
                style={[{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }, { height: 120, paddingTop: 16, textAlignVertical: 'top' }]}
                value={form.bio}
                onChangeText={(v) => setForm({ ...form, bio: v })}
                multiline
              />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Contact Phone</Text>
              <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginLeft: 4 }}>Physical Address</Text>
              <TextInput style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, fontWeight: '600', color: '#111' }} value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

