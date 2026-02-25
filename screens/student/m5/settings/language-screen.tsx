import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";

const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'العربية', flag: '🇩🇿' },
];

export default function LanguageScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('en');

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Language</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={{ padding: 20 }}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.id}
            style={[
              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
              selected === lang.id && { borderColor: '#137FEC', backgroundColor: '#F0F7FF' }
            ]}
            onPress={() => setSelected(lang.id)}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>{lang.flag}  {lang.name}</Text>
            {selected === lang.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#137FEC' }} />}
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
}

