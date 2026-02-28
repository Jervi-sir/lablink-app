import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, ActivityIndicator, Alert, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { SheetManager } from "react-native-actions-sheet";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useAuthStore } from "@/zustand/auth-store";

export default function EditLabProfileScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { auth, setAuth } = useAuthStore();
  const [profile, setProfile] = useState<any>(auth?.businessProfile || null);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [wilayaId, setWilayaId] = useState<number | null>(null);

  // Upload State
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [certificateUri, setCertificateUri] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<any>(null);
  const [certificateName, setCertificateName] = useState<string | null>(null);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, taxRes]: any = await Promise.all([
        api.get(ApiRoutes.businesses.me),
        api.get(buildRoute(ApiRoutes.taxonomies), { params: { types: 'wilayas,platforms' } })
      ]);

      const data = profileRes.data;
      setProfile(data?.businessProfile || data);

      // Attempt to support both structure types
      const businessData = data?.businessProfile || data;

      setWilayas(taxRes.wilayas || []);
      setPlatforms(taxRes.platforms || []);

      if (data?.businessProfile && data.id) {
        setAuth(data);
      }

      // Populate form
      setName(businessData.name || "");
      setDescription(businessData.description || "");
      setEmail(businessData.user?.email || data?.user?.email || data?.email || "");
      const phoneContact = (businessData.contacts || []).find((c: any) => c.platform?.code === 'phone' || c.platform?.code === 'mobile' || c.platform_id === 1);
      const websiteContact = (businessData.contacts || []).find((c: any) => c.platform?.code === 'website' || c.platform_id === 4);
      setPhone(phoneContact?.content || businessData.phone_numbers?.[0] || "");
      setAddress(businessData.address || "");
      setWebsite(websiteContact?.content || businessData.website || "");
      setWilayaId(businessData.wilaya_id || null);

      // Set existing logo
      if (businessData.logo) {
        setLogoUri(businessData.logo);
      }
      // Set existing certificate
      if (businessData.certificate_url) {
        setCertificateUri(businessData.certificate_url);
        setCertificateName(businessData.certificate_url.split('/').pop() || 'Certificate');
      }

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

  // Pick profile logo image
  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setLogoFile(result.assets[0]);
      setLogoUri(result.assets[0].uri);
    }
  };

  // Upload logo to server
  const uploadLogo = async () => {
    if (!logoFile || !profile?.id) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      const uri = logoFile.uri;
      const filename = uri.split('/').pop() || 'logo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('logo', {
        uri,
        name: filename,
        type,
      } as any);

      const response: any = await api.post(
        buildRoute(ApiRoutes.businesses.uploadLogo, { id: profile.id }),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response?.data?.logo) {
        setLogoUri(response.data.logo);
      }
      setLogoFile(null); // Clear pending file
    } catch (error) {
      console.error("Error uploading logo:", error);
      Alert.alert("Warning", "Profile saved, but logo failed to upload.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Pick certificate file
  const pickCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setCertificateFile(file);
        setCertificateUri(file.uri);
        setCertificateName(file.name || 'Certificate');
      }
    } catch (error) {
      console.error("Error picking certificate:", error);
    }
  };

  // Upload certificate to server
  const uploadCertificate = async () => {
    if (!certificateFile || !profile?.id) return;

    setIsUploadingCert(true);
    try {
      const formData = new FormData();
      const uri = certificateFile.uri;
      const filename = certificateFile.name || 'certificate.pdf';
      const mimeType = certificateFile.mimeType || 'application/pdf';

      formData.append('certificate', {
        uri,
        name: filename,
        type: mimeType,
      } as any);

      const response: any = await api.post(
        buildRoute(ApiRoutes.businesses.uploadCertificate, { id: profile.id }),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response?.data?.certificate_url) {
        setCertificateUri(response.data.certificate_url);
      }
      setCertificateFile(null);
    } catch (error) {
      console.error("Error uploading certificate:", error);
      Alert.alert("Warning", "Profile saved, but certificate failed to upload.");
    } finally {
      setIsUploadingCert(false);
    }
  };

  // Delete certificate
  const handleDeleteCertificate = async () => {
    if (!profile?.id) return;

    Alert.alert("Delete Certificate", "Are you sure you want to remove the certification?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await api.delete(buildRoute(ApiRoutes.businesses.deleteCertificate, { id: profile.id }));
            setCertificateUri(null);
            setCertificateName(null);
            setCertificateFile(null);
          } catch (error) {
            console.error("Error deleting certificate:", error);
            Alert.alert("Error", "Failed to delete certificate.");
          }
        }
      },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Lab name is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        description,
        address,
        wilaya_id: wilayaId,
        website,
        contacts: [] as any[]
      };

      // Add phone contact if exists
      if (phone.trim()) {
        const phonePlatform = platforms.find(p => p.code === 'phone') || platforms[0];
        if (phonePlatform) {
          payload.contacts.push({
            platform_id: phonePlatform.id,
            content: phone.trim(),
            label: 'Business Phone'
          });
        }
      }

      // Add website contact if exists
      if (website.trim()) {
        const websitePlatform = platforms.find(p => p.code === 'website');
        if (websitePlatform) {
          payload.contacts.push({
            platform_id: websitePlatform.id,
            content: website.trim(),
            label: 'Official Website'
          });
        }
      }

      await api.put(buildRoute(ApiRoutes.businesses.update, { id: profile.id }), payload);

      // Upload logo if changed
      if (logoFile) {
        await uploadLogo();
      }

      // Upload certificate if changed
      if (certificateFile) {
        await uploadCertificate();
      }

      // Update auth profile
      setAuth({
        ...auth,
        businessProfile: {
          ...profile,
          ...payload
        }
      } as any);

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

  const hasExistingCertificate = certificateUri && !certificateFile;
  const hasPendingCertificate = certificateFile !== null;

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: paddingHorizontal,
      }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40, paddingHorizontal: paddingHorizontal }}>

        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', paddingVertical: paddingHorizontal }}>
          <TouchableOpacity onPress={pickLogo} activeOpacity={0.7}>
            <View style={{
              width: 140,
              height: 140,
              backgroundColor: '#F1F5F9',
              borderRadius: 70,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: logoFile ? '#8B5CF6' : '#E2E8F0',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {logoUri ? (
                <Image
                  source={{ uri: logoUri }}
                  style={{ width: 140, height: 140, borderRadius: 70 }}
                />
              ) : (
                <Text style={{ fontSize: 60 }}>🔬</Text>
              )}
              {isUploadingLogo && (
                <View style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <ActivityIndicator size="large" color="#FFF" />
                </View>
              )}
            </View>
            <View style={{
              position: 'absolute',
              bottom: paddingHorizontal + 4,
              right: -2,
              width: 40,
              height: 40,
              backgroundColor: '#8B5CF6',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#F8F9FB',
              shadowColor: '#8B5CF6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <Text style={{ fontSize: 16 }}>📷</Text>
            </View>
          </TouchableOpacity>
          {logoFile && (
            <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
              <Text style={{ fontSize: 12, color: '#10B981', fontWeight: '600' }}>New photo selected • will upload on save</Text>
            </View>
          )}
          <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: logoFile ? 4 : 12 }}>Tap to change profile photo</Text>
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
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>Description / description</Text>
            <View style={[{ height: 120, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: paddingHorizontal }]}>
              <TextInput
                style={[{ fontSize: 14, color: '#1E293B', fontWeight: '500', textAlignVertical: 'top' }]}
                placeholder="Tell researchers about your facility..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
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
                editable={false}
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

          {(hasExistingCertificate || hasPendingCertificate) ? (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: hasPendingCertificate ? '#D1FAE5' : '#F0F2F5', borderRadius: 14, gap: 12, backgroundColor: hasPendingCertificate ? '#F0FDF4' : '#FFF' }}>
                <View style={{ width: 44, height: 44, backgroundColor: hasPendingCertificate ? '#D1FAE5' : '#FEF2F2', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{hasPendingCertificate ? '📋' : '📄'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }} numberOfLines={1}>
                    {certificateName || 'Certificate'}
                  </Text>
                  <Text style={{ fontSize: 12, color: hasPendingCertificate ? '#10B981' : '#64748B', marginTop: 2, fontWeight: '500' }}>
                    {hasPendingCertificate ? 'New file • will upload on save' : 'Laboratory Certification File'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {/* Replace button */}
                  <TouchableOpacity
                    style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}
                    onPress={pickCertificate}
                  >
                    <Text style={{ fontSize: 16 }}>🔄</Text>
                  </TouchableOpacity>
                  {/* Delete button */}
                  <TouchableOpacity
                    style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      if (hasPendingCertificate) {
                        setCertificateFile(null);
                        setCertificateUri(profile?.certificate_url || null);
                        setCertificateName(profile?.certificate_url?.split('/').pop() || null);
                      } else {
                        handleDeleteCertificate();
                      }
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {isUploadingCert && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="#8B5CF6" />
                  <Text style={{ fontSize: 12, color: '#8B5CF6', fontWeight: '600' }}>Uploading certificate...</Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={{ height: 140, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 14, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              onPress={pickCertificate}
            >
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
