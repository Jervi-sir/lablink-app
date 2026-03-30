import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { useLanguageStore } from "@/zustand/language-store";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const translations = {
  lab_equipment: { en: 'Laboratory Equipment', fr: 'Équipement de laboratoire', ar: 'معدات المختبرات' },
  all_available_products: { en: 'All Available Products', fr: 'Tous les produits disponibles', ar: 'جميع المنتجات المتاحة' },
};

const MOCK_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  name: i % 2 === 0 ? 'Digital LCD Microscope' : 'Borosil Glass Beakers',
  price: i % 2 === 0 ? '45,000 DA' : '1,200 DA',
  lab: 'Advanced Bio-Lab'
}));

export default function LabProductsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];
  const { labName = t('lab_equipment') } = route.params || {};

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{ width: COLUMN_WIDTH, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' }}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
    >
      <View style={{ height: COLUMN_WIDTH, backgroundColor: '#F8FAFC' }} />
      <View style={{ padding: 12, gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{item.price}</Text>
        <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', padding: 20, gap: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>{labName}</Text>
          <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>{t('all_available_products')}</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

