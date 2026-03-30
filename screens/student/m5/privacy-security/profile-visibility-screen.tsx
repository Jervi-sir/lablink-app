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
  profile_visibility: { en: 'Profile Visibility', fr: 'Visibilité du profil', ar: 'رؤية الملف الشخصي' },
  public_profile: { en: 'Public Profile', fr: 'Profil public', ar: 'ملف شخصي عام' },
  public_profile_desc: { en: 'Allow laboratories and other students to see your profile details.', fr: 'Autoriser les laboratoires et les autres étudiants à voir les détails de votre profil.', ar: 'السماح للمختبرات والطلاب الآخرين برؤية تفاصيل ملفك الشخصي.' },
  show_research: { en: 'Show Research Area', fr: 'Afficher le domaine de recherche', ar: 'إظهار مجال البحث' },
  show_research_desc: { en: 'Display your specialized department and research interest.', fr: 'Afficher votre département spécialisé et vos intérêts de recherche.', ar: 'عرض قسمك المتخصص واهتماماتك البحثية.' },
  show_dept: { en: 'Show Department', fr: 'Afficher le département', ar: 'إظهار القسم' },
  show_dept_desc: { en: 'Make your university department visible on your profile card.', fr: 'Rendre votre département universitaire visible sur votre carte de profil.', ar: 'جعل قسمك الجامعي مرئيًا على بطاقة ملفك الشخصي.' },
};

export default function ProfileVisibilityScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  const [isPublic, setIsPublic] = useState(true);
  const [showResearch, setShowResearch] = useState(true);
  const [showDepartment, setShowDepartment] = useState(true);

  const renderToggle = (label: string, desc: string, value: boolean, onValueChange: (v: boolean) => void) => (
    <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
      <View style={{ flex: 1, paddingLeft: language === 'ar' ? 20 : 0, paddingRight: language === 'ar' ? 0 : 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{label}</Text>
        <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18, textAlign: language === 'ar' ? 'right' : 'left' }}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E2E8F0", true: "#137FEC" }}
      />
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('profile_visibility')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
          {renderToggle(
            t('public_profile'),
            t('public_profile_desc'),
            isPublic,
            setIsPublic
          )}
          {renderToggle(
            t('show_research'),
            t('show_research_desc'),
            showResearch,
            setShowResearch
          )}
          {renderToggle(
            t('show_dept'),
            t('show_dept_desc'),
            showDepartment,
            setShowDepartment
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

