import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  help_support: { en: 'Help & Support', fr: 'Aide et support', ar: 'المساعدة والدعم' },
  faq: { en: 'Frequently Asked Questions', fr: 'Questions fréquemment posées', ar: 'الأسئلة الشائعة' },
  contact_support: { en: 'Contact Support', fr: 'Contacter le support', ar: 'اتصل بالدعم' },
  terms_of_service: { en: 'Terms of Service', fr: "Conditions d'utilisation", ar: 'شروط الخدمة' },
};

export default function HelpSupportScreen() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('help_support')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.FAQScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{t('faq')}</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.ContactSupportScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{t('contact_support')}</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }} onPress={() => navigation.navigate(Routes.TermsOfServiceScreen)}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{t('terms_of_service')}</Text>
            <View style={{ width: 8, height: 8, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#CBD5E1', transform: [{ rotate: language === 'ar' ? '135deg' : '-45deg' }] }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

