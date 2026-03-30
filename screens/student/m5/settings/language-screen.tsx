import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { OptionWithDot } from "../../../../components/options/option-with-dot";
import { paddingHorizontal } from "@/utils/variables/styles";
import { Language, useLanguageStore } from "@/zustand/language-store";

const LANGUAGES: { id: Language; name: string; flag: string }[] = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'العربية', flag: '🇩🇿' },
];

const translations = {
  language: { en: 'Language', fr: 'Langue', ar: 'اللغة' },
};

export default function LanguageScreen() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguageStore();

  const t = (key: keyof typeof translations) => translations[key][language];

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View >
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('language')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ padding: paddingHorizontal }}>
        {LANGUAGES.map(lang => (
          <OptionWithDot
            key={lang.id}
            label={`${lang.name}`}
            value={language === lang.id}
            onValueChange={() => setLanguage(lang.id)}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
}

