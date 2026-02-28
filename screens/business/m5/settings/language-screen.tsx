import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { OptionWithDot } from "../../../student/components/options/option-with-dot";
import { paddingHorizontal } from "@/utils/variables/styles";

const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'العربية', flag: '🇩🇿' },
];

export default function BusinessLanguageScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('en');

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Language</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ padding: paddingHorizontal }}>
        {LANGUAGES.map(lang => (
          <OptionWithDot
            key={lang.id}
            label={`${lang.name}`}
            value={selected === lang.id}
            onValueChange={() => setSelected(lang.id)}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
}
