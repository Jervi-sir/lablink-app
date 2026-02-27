import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { SheetManager } from "react-native-actions-sheet";
import ArrowIcon from "@/assets/icons/arrow-icon";

export default function EditLabProfileScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [wilayas, setWilayas] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaId, setWilayaId] = useState<number | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, taxRes]: any = await Promise.all([
        api.get(ApiRoutes.businesses.me),
        api.get(buildRoute(ApiRoutes.taxonomies), { params: { types: 'wilayas' } })
      ]);

      const data = profileRes.data;
      setProfile(data);
      setWilayas(taxRes.wilayas || []);

      // Populate form
      setName(data.name || "");
      setBio(data.bio || "");
      setEmail(data.user?.email || "");
      setPhone(data.phone_numbers?.[0] || ""); // Assuming first phone number
      setAddress(data.address || "");
      setWebsite(data.website || "");
      setWilayaId(data.wilaya_id || null);

    } catch (error) {
      console.error("Error fetching initial data:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Lab name is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        bio,
        address,
        wilaya_id: wilayaId,
        website,
        phone_numbers: phone ? [phone] : [],
        // We could also update email via a separate endpoint if needed, 
        // but typically business email is the user email or kept separate.
      };

      await api.put(buildRoute(ApiRoutes.businesses.update, { id: profile.id }), payload);

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenWilayaSheet = () => {
    SheetManager.show('taxonomy-selector-sheet', {
      payload: {
        title: "Select Wilaya",
        items: wilayas,
        selectedId: wilayaId,
        onSelect: (item: any) => {
          setWilayaId(item.id);
        }
      }
    });
  };

  const selectedWilayaData = wilayas.find(w => w.id === wilayaId);
  const selectedWilayaLabel = selectedWilayaData ? (selectedWilayaData.code ? `${selectedWilayaData.code} - ${selectedWilayaData.name}` : selectedWilayaData.name) : "Select Wilaya";

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
      }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Edit Lab Profile</Text>
        <TouchableOpacity
          style={{ width: 60, height: 40, justifyContent: 'center', alignItems: 'center' }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#8B5CF6' }}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>

        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <View style={{ width: 140, height: 140, backgroundColor: '#F1F5F9', borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' }}>
            <Text style={{ fontSize: 60 }}>🔬</Text>
            <TouchableOpacity style={{ position: 'absolute', bottom: 4, right: 4, width: 36, height: 36, backgroundColor: '#8B5CF6', borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' }}>
              <Text style={{ fontSize: 14 }}>📷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lab Identity Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>Lab Identity</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Lab Name</Text>
            <View style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                placeholder="Enter Lab Name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Description / Bio</Text>
            <View style={[{ height: 120, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 12 }]}>
              <TextInput
                style={[{ fontSize: 14, color: '#1E293B', fontWeight: '500', textAlignVertical: 'top' }]}
                placeholder="Tell researchers about your facility..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
              />
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>Contact Information</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Public Email</Text>
            <View style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                placeholder="contact@labname.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                value={email}
                editable={false} // User email usually not editable here
              />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Phone Number</Text>
            <View style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                placeholder="+213..."
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Website</Text>
            <View style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                placeholder="https://www.labname.com"
                placeholderTextColor="#94A3B8"
                value={website}
                onChangeText={setWebsite}
              />
            </View>
          </View>
        </View>

        {/* Business Address Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>Location</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Wilaya</Text>
            <TouchableOpacity
              onPress={handleOpenWilayaSheet}
              style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}>{selectedWilayaLabel}</Text>
              <View style={{ width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#64748B', transform: [{ rotate: '45deg' }], marginBottom: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Full Street Address</Text>
            <View style={{ height: 52, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, justifyContent: 'center' }}>
              <TextInput
                style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                placeholder="Enter street, building, office..."
                placeholderTextColor="#94A3B8"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>
        </View>

        {/* Certification Section */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 20, gap: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>Certification</Text>

          {profile?.certificateUrl ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#F0F2F5', borderRadius: 12, gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: '#FEF2F2', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>📄</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{profile.certificateUrl.split('/').pop()}</Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Laboratory Certification File</Text>
              </View>
              <TouchableOpacity style={{ padding: 8 }}>
                <Text style={{ fontSize: 18 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={{ height: 140, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 44, height: 44, backgroundColor: '#EEF2FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>📤</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#8B5CF6' }}>Upload Certification</Text>
              <Text style={{ fontSize: 11, color: '#94A3B8' }}>PDF, JPG, PNG up to 10MB</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

