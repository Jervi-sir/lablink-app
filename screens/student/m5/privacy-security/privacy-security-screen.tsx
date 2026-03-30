import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../../../components/options/option-settings";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  privacy_security: { en: 'Privacy & Security', fr: 'Confidentialité et sécurité', ar: 'الخصوصية والأمان' },
  security: { en: 'Security', fr: 'Sécurité', ar: 'الأمان' },
  change_password: { en: 'Change Password', fr: 'Changer le mot de passe', ar: 'تغيير كلمة المرور' },
  two_factor: { en: 'Two-Factor Authentication', fr: 'Authentification à deux facteurs', ar: 'المصادقة الثنائية' },
  login_activity: { en: 'Login Activity', fr: 'Activité de connexion', ar: 'نشاط تسجيل الدخول' },
  privacy: { en: 'Privacy', fr: 'Confidentialité', ar: 'الخصوصية' },
  profile_visibility: { en: 'Profile Visibility', fr: 'Visibilité du profil', ar: 'رؤية الملف الشخصي' },
  data_usage: { en: 'Data Usage', fr: 'Utilisation des données', ar: 'استخدام البيانات' },
};

export default function PrivacySecurityScreen() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  const renderSection = (title: string, items: { label: string, route?: string }[]) => (
    <OptionSettings
      title={title}
      items={items.map(item => ({
        label: item.label,
        onPress: () => item.route && navigation.navigate(item.route)
      }))}
    />
  );

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('privacy_security')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        {renderSection(t('security'), [
          { label: t('change_password'), route: Routes.ChangePasswordScreen },
          { label: t('two_factor'), route: Routes.TwoFactorAuthScreen },
          { label: t('login_activity'), route: Routes.LoginActivityScreen }
        ])}
        {renderSection(t('privacy'), [
          { label: t('profile_visibility'), route: Routes.ProfileVisibilityScreen },
          { label: t('data_usage'), route: Routes.DataUsageScreen },
        ])}
      </ScrollView>
    </ScreenWrapper>
  );
}

