import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  contact_support: { en: 'Contact Support', fr: 'Contacter le support', ar: 'اتصل بالدعم' },
  how_can_help: { en: 'How can we help?', fr: 'Comment pouvons-nous vous aider ?', ar: 'كيف يمكننا المساعدة؟' },
  get_back: { en: 'Send us a message and our team will get back to you within 24 hours.', fr: 'Envoyez-nous un message et notre équipe vous répondra dans les 24 heures.', ar: 'أرسل لنا رسالة وسيقوم فريقنا بالرد عليك في غضون 24 ساعة.' },
  subject: { en: 'Subject', fr: 'Objet', ar: 'الموضوع' },
  subject_placeholder: { en: 'e.g. Order Tracking Issue', fr: 'ex: Problème de suivi de commande', ar: 'مثل: مشكلة في تتبع الطلب' },
  message: { en: 'Message', fr: 'Message', ar: 'الرسالة' },
  message_placeholder: { en: 'Describe your issue in detail...', fr: 'Décrivez votre problème en détail...', ar: 'صف مشكلتك بالتفصيل...' },
  send_message: { en: 'Send Message', fr: 'Envoyer le message', ar: 'إرسال الرسالة' },
  other_ways: { en: 'Other ways to connect', fr: 'Autres moyens de nous contacter', ar: 'طرق أخرى للتواصل' },
};

export default function ContactSupportScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('contact_support')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#137FEC', padding: 24, borderRadius: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 }}>{t('how_can_help')}</Text>
          <Text style={{ fontSize: 14, color: '#DBEAFE', lineHeight: 20 }}>{t('get_back')}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>{t('subject')}</Text>
          <TextInput
            style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12, textAlign: language === 'ar' ? 'right' : 'left' }}
            placeholder={t('subject_placeholder')}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8 }}>{t('message')}</Text>
          <TextInput
            style={{ backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 120, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 12, textAlignVertical: 'top', textAlign: language === 'ar' ? 'right' : 'left' }}
            placeholder={t('message_placeholder')}
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={{ height: 56, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>{t('send_message')}</Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 32 }} />

        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 }}>{t('other_ways')}</Text>
          <TouchableOpacity style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '600' }}>📧 support@lablink.dz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 15, color: '#64748B', fontWeight: '600' }}>📞 +213 (0) 23 45 67 89</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

