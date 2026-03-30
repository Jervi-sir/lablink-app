import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  change_password: { en: 'Change Password', fr: 'Changer le mot de passe', ar: 'تغيير كلمة المرور' },
  current_password: { en: 'Current Password', fr: 'Mot de passe actuel', ar: 'كلمة المرور الحالية' },
  new_password: { en: 'New Password', fr: 'Nouveau mot de passe', ar: 'كلمة المرور الجديدة' },
  confirm_password: { en: 'Confirm New Password', fr: 'Confirmer le nouveau mot de passe', ar: 'تأكيد كلمة المرور الجديدة' },
  update_password: { en: 'Update Password', fr: 'Mettre à jour le mot de passe', ar: 'تحديث كلمة المرور' },
};

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('change_password')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('current_password')}</Text>
          <TextInput
            style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
            secureTextEntry
            placeholder="••••••••"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('new_password')}</Text>
          <TextInput
            style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
            secureTextEntry
            placeholder="••••••••"
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('confirm_password')}</Text>
          <TextInput
            style={{ height: 52, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
            secureTextEntry
            placeholder="••••••••"
          />
        </View>
        <TouchableOpacity style={{ height: 56, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{t('update_password')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

