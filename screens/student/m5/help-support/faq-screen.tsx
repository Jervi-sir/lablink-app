import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { OptionSettings2 } from "../../../../components/options/option-settings-2";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

export default function FAQScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const [expanded, setExpanded] = useState<number | null>(null);

  const translations = {
    faqs_title: { en: 'FAQs', fr: 'FAQ', ar: 'الأسئلة الشائعة' },
    q1: { en: "How do I track my order?", fr: "Comment suivre ma commande ?", ar: "كيف يمكنني تتبع طلبي؟" },
    a1: {
      en: "You can track your order in the 'My Orders' section of the app. We provide real-time updates as your equipment moves from proposal to delivery.",
      fr: "Vous pouvez suivre votre commande dans la section « Mes commandes » de l'application. Nous fournissons des mises à jour en temps réel à mesure que votre équipement passe de la proposition à la livraison.",
      ar: "يمكنك تتبع طلبك في قسم 'طلباتي' في التطبيق. نحن نقدم تحديثات في الوقت الفعلي أثناء انتقال معداتك من الاقتراح إلى التسليم."
    },
    q2: { en: "Can I cancel a procurement request?", fr: "Puis-je annuler une demande d'achat ?", ar: "هل يمكنني إلغاء طلب شراء؟" },
    a2: {
      en: "Yes, you can cancel a request as long as the status is 'Proposal Submitted'. Once payment is confirmed, please contact the laboratory directly.",
      fr: "Oui, vous pouvez annuler une demande tant que le statut est « Proposition soumise ». Une fois le paiement confirmé, veuillez contacter directement le laboratoire.",
      ar: "نعم، يمكنك إلغاء الطلب طالما أن الحالة هي 'تم تقديم الاقتراح'. بمجرد تأكيد الدفع، يرجى الاتصال بالمختبر مباشرة."
    },
    q3: { en: "How do I contact a vendor?", fr: "Comment contacter un vendeur ?", ar: "كيف يمكنني الاتصال بالبائع؟" },
    a3: {
      en: "Go to your order details and tap 'Message Vendor'. You can also find laboratory contact information on their profile page.",
      fr: "Allez dans les détails de votre commande et appuyez sur « Contacter le vendeur ». Vous pouvez également trouver les coordonnées du laboratoire sur sa page de profil.",
      ar: "انتقل إلى تفاصيل طلبك واضغط على 'رسالة إلى البائع'. يمكنك أيضًا العثور على معلومات الاتصال بالمختبر في صفحة ملفهم الشخصي."
    },
    q4: { en: "What is LabLink's tax policy?", fr: "Quelle est la politique fiscale de LabLink ?", ar: "ما هي سياسة الضرائب في لابلينك؟" },
    a4: {
      en: "Taxes are calculated based on the laboratory's location and the type of research equipment being purchased.",
      fr: "Les taxes sont calculées en fonction de l'emplacement du laboratoire et du type d'équipement de recherche acheté.",
      ar: "تُحسب الضرائب بناءً على موقع المختبر ونوع معدات البحث التي يتم شراؤها."
    },
  };

  const t = (key: keyof typeof translations) => translations[key][language];

  const FAQS = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('faqs_title')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        {FAQS.map((item, index) => (
          <OptionSettings2
            key={index}
            question={item.q}
            answer={item.a}
            isExpanded={expanded === index}
            onPress={() => setExpanded(expanded === index ? null : index)}
          />
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

