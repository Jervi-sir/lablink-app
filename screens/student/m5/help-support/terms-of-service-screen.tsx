import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  terms_title: { en: 'Terms of Service', fr: "Conditions d'utilisation", ar: 'شروط الخدمة' },
  last_updated: { en: 'Last Updated: February 2026', fr: 'Dernière mise à jour : Février 2026', ar: 'آخر تحديث: فبراير 2026' },
  section1_title: { en: '1. Acceptance of Terms', fr: '1. Acceptation des conditions', ar: '1. قبول الشروط' },
  section1_body: { en: 'By accessing or using LabLink, you agree to be bound by these terms. If you do not agree, please do not use our services.', fr: 'En accédant ou en utilisant LabLink, vous acceptez d\'être lié par ces conditions. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser nos services.', ar: 'بالوصول إلى LabLink أو استخدامه، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يرجى عدم استخدام خدماتنا.' },
  section2_title: { en: '2. Use of Service', fr: '2. Utilisation du service', ar: '2. استخدام الخدمة' },
  section2_body: { en: 'LabLink provides a platform for researchers and laboratories to facilitate procurement. You are responsible for maintaining the confidentiality of your account.', fr: 'LabLink fournit une plateforme pour les chercheurs et les laboratoires afin de faciliter les achats. Vous êtes responsable du maintien de la confidentialité de votre compte.', ar: 'توفر LabLink منصة للباحثين والمختبرات لتسهيل عملية الشراء. أنت مسؤول عن الحفاظ على سرية حسابك.' },
  section3_title: { en: '3. Procurement Policy', fr: '3. Politique d\'achat', ar: '3. سياسة الشراء' },
  section3_body: { en: 'All procurement requests made through LabLink are subject to the specific terms and conditions of the fulfilling laboratory. LabLink acts as an intermediary facilitator.', fr: 'Toutes les demandes d\'achat effectuées via LabLink sont soumises aux conditions générales spécifiques du laboratoire exécutant. LabLink agit comme un facilitateur intermédiaire.', ar: 'تخضع جميع طلبات الشراء التي تتم من خلال LabLink للشروط والأحكام الخاصة بالمختبر المنفذ. تعمل LabLink كوسيط ميسر.' },
  section4_title: { en: '4. Privacy', fr: '4. Confidentialité', ar: '4. الخصوصية' },
  section4_body: { en: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your data.', fr: 'Votre vie privée est importante pour nous. Veuillez consulter notre politique de confidentialité pour comprendre comment nous collectons et utilisons vos données.', ar: 'خصوصيتك تهمنا. يرجى مراجعة سياسة الخصوصية الخاصة بنا لفهم كيفية جمع واستخدام بياناتك.' },
};

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('terms_title')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '600', marginBottom: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('last_updated')}</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section1_title')}</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section1_body')}</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section2_title')}</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section2_body')}</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section3_title')}</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section3_body')}</Text>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginTop: 8, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section4_title')}</Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 24, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('section4_body')}</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

