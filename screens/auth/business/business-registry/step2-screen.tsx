import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { useBusinessRegistry } from "./context/business-registry-context";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";

export default function Step2Screen() {
  const navigation = useNavigation<any>();
  const { formData, setField } = useBusinessRegistry();
  const [pickStatus, setPickStatus] = useState<'idle' | 'picked' | 'uploading' | 'uploaded' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setPickStatus('picked');
      }
    } catch (err) {
      console.error("Document Picker Error:", err);
      Alert.alert("Error", "Could not pick the document.");
    }
  };

  const handleUploadAndContinue = async () => {
    if (!selectedFile) {
      if (formData.certificate) {
        navigation.navigate("BusinessStep3");
      } else {
        Alert.alert("Required", "Please upload your business certificate to continue.");
      }
      return;
    }

    try {
      setPickStatus('uploading');
      setUploadProgress(10); // Start progress

      const data = new FormData();
      data.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/octet-stream',
      } as any);

      setUploadProgress(30);

      const response: any = await apiPublic.post(buildRoute(ApiRoutes.uploads.temp), data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(30 + Math.floor(progress * 0.7)); // Scale 30-100
          }
        },
      });

      if (response && response.url) {
        setField('certificate', response.url);
        setPickStatus('uploaded');
        setUploadProgress(100);
        setTimeout(() => {
          navigation.navigate("BusinessStep3");
        }, 500);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setPickStatus('error');
      Alert.alert("Upload Failed", "Could not upload the document. Please try again.");
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Authentication'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={2} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Business Verification</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Please provide your official registration details to ensure security and partner verification.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 16 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Registration Details</Text>
            </View>

            <View style={{ gap: 16 }}>
              <GlobalInput
                label="Business Registration No."
                placeholder="REG-000000000"
                value={formData.registrationNo}
                onChangeText={(v) => setField('registrationNo', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
              <GlobalInput
                label="Tax Identification Number (NIF)"
                placeholder="123 456 789 000"
                value={formData.nif}
                onChangeText={(v) => setField('nif', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
              />
            </View>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Certification</Text>
            </View>

            <TouchableOpacity
              onPress={handlePickFile}
              style={{ borderWidth: 2, borderColor: pickStatus === 'uploaded' ? '#10B981' : '#F5F3FF', borderStyle: 'dashed', borderRadius: 14, height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBFBFF', gap: 8 }}
              activeOpacity={0.7}
              disabled={pickStatus === 'uploading'}
            >
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: pickStatus === 'uploaded' ? '#D1FAE5' : '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
                {pickStatus === 'uploaded' ? (
                  <Text style={{ fontSize: 20 }}>✅</Text>
                ) : (
                  <View style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#8B5CF6', borderTopWidth: 6, borderRadius: 4 }} />
                )}
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: pickStatus === 'uploaded' ? '#10B981' : '#8B5CF6' }}>
                {pickStatus === 'idle' ? 'Upload Document' : selectedFile?.name || 'File Selected'}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
                {pickStatus === 'uploaded' ? 'Certificate uploaded successfully' : 'PDF, JPG, PNG (Max 10MB)'}
              </Text>
            </TouchableOpacity>
          </View>

          {pickStatus === 'uploading' && (
            <View style={{ marginTop: 24, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111' }}>Uploading Certificate...</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#8B5CF6' }}>{uploadProgress}%</Text>
              </View>
              <View style={{ height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: '#8B5CF6' }} />
              </View>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <TouchableOpacity
              style={{ height: 56, justifyContent: 'center', paddingHorizontal: 8 }}
              onPress={() => navigation.goBack()}
              disabled={pickStatus === 'uploading'}
            >
              <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '600' }}>Back</Text>
            </TouchableOpacity>

            <Button1
              text={pickStatus === 'uploading' ? 'Uploading...' : "Verify & Continue"}
              onPress={handleUploadAndContinue}
              style={{ flex: 1, height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
              loading={pickStatus === 'uploading'}
              disabled={!formData.registrationNo || !formData.nif || (!selectedFile && !formData.certificate)}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}