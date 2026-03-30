import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  two_factor_auth: { en: 'Two-Factor Auth', fr: 'Auth à deux facteurs', ar: 'المصادقة الثنائية' },
  protect_account: { en: 'Protect your account', fr: 'Protégez votre compte', ar: 'احمِ حسابك' },
  two_factor_desc: { en: 'Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.', fr: "L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte en exigeant plus qu'un simple mot de passe pour vous connecter.", ar: 'تضيف المصادقة الثنائية طبقة إضافية من الأمان إلى حسابك من خلال طلب أكثر من مجرد كلمة مرور لتسجيل الدخول.' },
  enable_2fa: { en: 'Enable 2FA', fr: 'Activer la 2FA', ar: 'تفعيل المصادقة الثنائية' },
  use_authenticator: { en: 'Use authenticator app', fr: 'Utiliser une application d\'authentification', ar: 'استخدام تطبيق المصادقة' },
  setup_instructions: { en: 'Authenticator app setup instructions would go here...', fr: 'Les instructions de configuration de l\'application d\'authentification s\'afficheront ici...', ar: 'ستظهر تعليمات إعداد تطبيق المصادقة هنا...' },
};

export default function TwoFactorAuthScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('two_factor_auth')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('protect_account')}</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('two_factor_desc')}</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('enable_2fa')}</Text>
            <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('use_authenticator')}</Text>
          </View>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
          />
        </View>

        {isEnabled && (
          <View style={{ marginTop: 20, padding: 16, backgroundColor: '#EFF6FF', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#137FEC' }}>
            <Text style={{ color: '#1E40AF', fontSize: 14, textAlign: 'center' }}>{t('setup_instructions')}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

