import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { useAuthStore } from "@/zustand/auth-store";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  edit_profile: { en: 'Edit Profile', fr: 'Modifier le profil', ar: 'تعديل الملف الشخصي' },
  full_name: { en: 'Full Name', fr: 'Nom complet', ar: 'الاسم الكامل' },
  email_address: { en: 'Email Address', fr: 'Adresse e-mail', ar: 'البريد الإلكتروني' },
  save_changes: { en: 'Save Changes', fr: 'Enregistrer', ar: 'حفظ التغييرات' },
  required_fields: { en: 'All fields are required.', fr: 'Tous les champs sont requis.', ar: 'جميع الحقول مطلوبة.' },
  success: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  profile_updated: { en: 'Profile updated successfully!', fr: 'Profil mis à jour avec succès !', ar: 'تم تحديث الملف الشخصي بنجاح!' },
  error: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  load_failed: { en: 'Failed to load profile data.', fr: 'Échec du chargement des données.', ar: 'فشل تحميل بيانات الملف الشخصي.' },
  update_failed: { en: 'Update Failed', fr: 'Échec de la mise à jour', ar: 'فشل التحديث' },
  try_again: { en: 'Could not update profile. Please try again.', fr: 'Impossible de mettre à jour. Veuillez réessayer.', ar: 'تعذر تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.' },
};

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((s) => s.language);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const authToken = useAuthStore((s) => s.authToken);

  const t = (key: keyof typeof translations) => translations[key][language];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response: any = await api.get(ApiRoutes.auth.student.me);
      setFullName(response.user?.studentProfile?.fullName || "");
      setEmail(response.user?.email || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert(t('error'), t('load_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert(t('error'), t('required_fields'));
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(ApiRoutes.students.updateMe, {
        fullName: fullName.trim(),
        email: email.trim()
      });
      Alert.alert(t('success'), t('profile_updated'));
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(t('update_failed'), t('try_again'));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('edit_profile')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal, flexGrow: 1 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>{t('full_name')}</Text>
          <TextInput
            style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' }}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Dr. Amine Kherroubi"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>{t('email_address')}</Text>
          <TextInput
            style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' }}
            value={email}
            onChangeText={setEmail}
            placeholder="amine.k@usthb.dz"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={isUpdating}
          style={{
            height: 56,
            backgroundColor: isUpdating ? '#94A3B8' : '#137FEC',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
            marginBottom: 20
          }}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{t('save_changes')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

