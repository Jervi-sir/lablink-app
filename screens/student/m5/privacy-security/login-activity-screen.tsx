import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  login_activity: { en: 'Login Activity', fr: 'Activité de connexion', ar: 'نشاط تسجيل الدخول' },
  where_logged_in: { en: "Where you're logged in", fr: "Où vous êtes connecté", ar: "أين قمت بتسجيل الدخول" },
  current: { en: 'Current', fr: 'Actuel', ar: 'الحالي' },
  logout: { en: 'Log out', fr: 'Se déconnecter', ar: 'تسجيل الخروج' },
  active_now: { en: 'Active now', fr: 'Actif maintenant', ar: 'نشط الآن' },
  hours_ago: { en: '2 hours ago', fr: 'Il y a 2 heures', ar: 'منذ ساعتين' },
  yesterday: { en: 'Yesterday, 14:20', fr: 'Hier, 14:20', ar: 'أمس، 14:20' },
};

export default function LoginActivityScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  const ACTIVITIES = [
    { device: 'iPhone 15 Pro', location: 'Algiers, DZ', time: t('active_now'), isCurrent: true },
    { device: 'MacBook Pro 14"', location: 'Algiers, DZ', time: t('hours_ago'), isCurrent: false },
    { device: 'Chrome on Windows', location: 'Oran, DZ', time: t('yesterday'), isCurrent: false },
  ];

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('login_activity')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 16, marginLeft: 4, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('where_logged_in')}</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
          {ACTIVITIES.map((item, index) => (
            <View key={index} style={[{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }, index === ACTIVITIES.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>{item.device.includes('iPhone') ? '📱' : item.device.includes('Mac') ? '💻' : '🖥️'}</Text>
                </View>
                <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{item.device}{item.isCurrent && <Text style={{ color: '#10B981', fontSize: 12 }}> • {t('current')}</Text>}</Text>
                  <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>{item.location} • {item.time}</Text>
                </View>
              </View>
              {!item.isCurrent && (
                <TouchableOpacity>
                  <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '700' }}>{t('logout')}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

