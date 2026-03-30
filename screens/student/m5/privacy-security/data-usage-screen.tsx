import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  data_usage: { en: 'Data Usage', fr: 'Utilisation des données', ar: 'استخدام البيانات' },
  data_saver: { en: 'Data Saver', fr: 'Économiseur de données', ar: 'موفر البيانات' },
  data_saver_desc: { en: 'Reduce data usage by loading lower resolution images of products.', fr: 'Réduisez l\'utilisation des données en chargeant des images de produits en basse résolution.', ar: 'تقليل استخدام البيانات عن طريق تحميل صور المنتجات بدقة منخفضة.' },
  high_res: { en: 'High Resolution over Wi-Fi', fr: 'Haute résolution via Wi-Fi', ar: 'دقة عالية عبر الواي فاي' },
  high_res_desc: { en: 'Automatically load best quality assets when connected to Wi-Fi.', fr: 'Chargez automatiquement les ressources de meilleure qualité lorsque vous êtes connecté au Wi-Fi.', ar: 'تحميل أفضل جودة للأصول تلقائيًا عند الاتصال بالواي فاي.' },
  download_data: { en: 'Download My Data', fr: 'Télécharger mes données', ar: 'تنزيل بياناتي' },
  download_data_desc: { en: 'Get a copy of your procurement history & activity.', fr: 'Obtenez une copie de votre historique d\'achat et de votre activité.', ar: 'احصل على نسخة من سجل المشتريات والنشاط الخاص بك.' },
};

export default function DataUsageScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  const [saveData, setSaveData] = useState(false);
  const [highRes, setHighRes] = useState(true);

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('data_usage')}</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden', marginBottom: 24 }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
            <View style={{ flex: 1, paddingLeft: language === 'ar' ? 20 : 0, paddingRight: language === 'ar' ? 0 : 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('data_saver')}</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('data_saver_desc')}</Text>
            </View>
            <Switch value={saveData} onValueChange={setSaveData} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
            <View style={{ flex: 1, paddingLeft: language === 'ar' ? 20 : 0, paddingRight: language === 'ar' ? 0 : 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('high_res')}</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('high_res_desc')}</Text>
            </View>
            <Switch value={highRes} onValueChange={setHighRes} trackColor={{ false: "#E2E8F0", true: "#137FEC" }} />
          </View>
        </View>

        <TouchableOpacity style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#137FEC' }}>{t('download_data')}</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('download_data_desc')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

