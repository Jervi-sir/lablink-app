import { TopHeader1 } from "@/components/headers/top-header-1";
import { ScreenWrapper } from "@/components/screen-wrapper";
import { ScrollView, View, TouchableOpacity, Alert, Image, ActivityIndicator, TextInput } from "react-native";
import { BusinessRegistryProgress } from "./components/business-registry-progress";
import Text from "@/components/text";
import GlobalInput from "@/components/inputs/global-input";
import { Button1 } from "@/components/buttons/button-1";
import { useNavigation } from "@react-navigation/native";
import { useBusinessRegistry } from "./context/business-registry-context";
import { useRef, useState } from "react";
import { apiPublic } from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import * as ImagePicker from "expo-image-picker";

const SPECIALIZATIONS = ['Organic Chemistry', 'Bioengineering', 'Genomics', 'PCR Analysis'];

export default function Step3Screen() {
  const navigation = useNavigation<any>();
  const { formData, setField } = useBusinessRegistry();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [specializationInput, setSpecializationInput] = useState("");
  const specializationInputRef = useRef<TextInput>(null);

  const addSpecialization = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    const alreadySelected = formData.specializations.some(
      (item) => item.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (alreadySelected) {
      setSpecializationInput("");
      return;
    }

    setField("specializations", [...formData.specializations, trimmedValue]);
    setSpecializationInput("");
  };

  const removeSpecialization = (value: string) => {
    setField(
      "specializations",
      formData.specializations.filter((item) => item !== value)
    );
  };

  const filteredSuggestions = SPECIALIZATIONS.filter((item) => {
    const matchesSearch = specializationInput.trim()
      ? item.toLowerCase().includes(specializationInput.trim().toLowerCase())
      : true;
    const alreadySelected = formData.specializations.some(
      (selected) => selected.toLowerCase() === item.toLowerCase()
    );

    return matchesSearch && !alreadySelected;
  });

  const handlePickLogo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadLogo(result.assets[0]);
      }
    } catch (err) {
      console.error("Image Picker Error:", err);
      Alert.alert("Error", "Could not pick logo.");
    }
  };

  const uploadLogo = async (asset: any) => {
    try {
      setUploadingLogo(true);
      const data = new FormData();
      data.append('file', {
        uri: asset.uri,
        name: 'logo.jpg',
        type: 'image/jpeg',
      } as any);

      const response: any = await apiPublic.post(buildRoute(ApiRoutes.uploads.temp), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response && response.url) {
        setField('logo', response.url);
      }
    } catch (err) {
      console.error("Logo Upload Error:", err);
      Alert.alert("Error", "Could not upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }} statusBarStyle="dark-content">
      <TopHeader1 rightLabel={'Public Profile'} />

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <BusinessRegistryProgress step={3} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          <View style={{ paddingVertical: 24, gap: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', letterSpacing: -0.5 }}>Public Presence</Text>
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#6B7280', lineHeight: 22 }}>
              Add a logo and description to help students identify your laboratory facility.
            </Text>
          </View>

          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
            <View style={{ marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#8B5CF6', paddingLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>Laboratory Branding</Text>
            </View>

            {/* Avatar Upload */}
            <TouchableOpacity
              onPress={handlePickLogo}
              style={{ alignItems: 'center', marginBottom: 32, gap: 12 }}
              activeOpacity={0.8}
              disabled={uploadingLogo}
            >
              <View style={{ width: 120, height: 120, borderRadius: 100, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                {uploadingLogo ? (
                  <ActivityIndicator color="#8B5CF6" />
                ) : formData.logo ? (
                  <Image source={{ uri: formData.logo }} style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                ) : (
                  <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>🧪</Text>
                    <View style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 999, width: 38, height: 38, borderRadius: 19, backgroundColor: '#8B5CF6', borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ width: 14, height: 10, borderWidth: 2, borderColor: '#FFF', borderRadius: 2 }} />
                    </View>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#8B5CF6' }}>
                {formData.logo ? 'Change Laboratory Logo' : 'Upload Laboratory Logo'}
              </Text>
            </TouchableOpacity>

            <View style={{ gap: 20 }}>
              <GlobalInput
                label="About the Lab"
                placeholder="Briefly describe your services and expertise..."
                value={formData.description}
                onChangeText={(v) => setField('description', v)}
                containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                multiline
                numberOfLines={4}
                kind="multiline"
                blurOnSubmit
                onSubmitEditing={() => specializationInputRef.current?.focus()}
                returnKeyType="next"
              />

              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 8 }}>Specialization Area</Text>
                <GlobalInput
                  ref={specializationInputRef}
                  placeholder="Add a specialization..."
                  value={specializationInput}
                  onChangeText={setSpecializationInput}
                  onSubmitEditing={() => addSpecialization(specializationInput)}
                  returnKeyType="done"
                  containerStyle={{ borderColor: '#E2E8F0', borderRadius: 12 }}
                  right={
                    <TouchableOpacity
                      onPress={() => addSpecialization(specializationInput)}
                      activeOpacity={0.8}
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: '#8B5CF6',
                        borderRadius: 14,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '700', lineHeight: 20 }}>+</Text>
                    </TouchableOpacity>
                  }
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {formData.specializations.map((tag: string) => (
                    <View key={tag} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F5F3FF', borderRadius: 100, gap: 6 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#8B5CF6' }}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeSpecialization(tag)}>
                        <Text style={{ color: '#8B5CF6', fontWeight: 'bold' }}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                  {filteredSuggestions.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F9FAFB', borderRadius: 100, borderWidth: 1, borderColor: '#E2E8F0' }}
                      onPress={() => addSpecialization(tag)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>+ {tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 32 }}>
            <Button1
              text="Continue"
              onPress={() => navigation.navigate("BusinessStep4")}
              style={{ height: 56, backgroundColor: '#8B5CF6', borderRadius: 12 }}
              disabled={!formData.description}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
