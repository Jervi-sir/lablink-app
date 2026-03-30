import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, FlatList } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const PRODUCTS = [
  { id: '1', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '2', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '3', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '4', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '5', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
];

const translations = {
  username_placeholder: { en: 'Username', fr: 'Nom d\'utilisateur', ar: 'اسم المستخدم' },
  email_placeholder: { en: 'Email', fr: 'Email', ar: 'البريد الإلكتروني' },
  add_btn: { en: 'Add', fr: 'Ajouter', ar: 'إضافة' },
};

export const ListProductsScreen = () => {
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 16, gap: 16, paddingTop: 16 }}>

          {/* Header */}
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 44, height: 44, backgroundColor: '#D9D9D9', borderRadius: 22 }} />
              <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111111' }}>{t('username_placeholder')}</Text>
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#5D6575' }}>{t('email_placeholder')}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ padding: 8 }}>
              {/* Bell Icon Placeholder */}
              <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 14, height: 16, backgroundColor: '#111', borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
                <View style={{ width: 6, height: 2, backgroundColor: '#111', marginTop: 1, borderRadius: 1 }} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Product List */}
          <View style={{ gap: 12 }}>
            {PRODUCTS.map((product) => (
              <View
                key={product.id}
                style={{
                  flexDirection: language === 'ar' ? 'row-reverse' : 'row',
                  backgroundColor: '#FFF',
                  borderRadius: 16,
                  padding: 12,
                  gap: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3
                }}
              >
                {/* Image Placeholder */}
                <View style={{ width: 95, height: 95, backgroundColor: '#D9D9D9', borderRadius: 12 }} />

                {/* Product Info */}
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <View style={{ gap: 6 }}>
                    <Text
                      style={{ fontSize: 14, fontWeight: '700', color: '#111', textAlign: language === 'ar' ? 'right' : 'left' }}
                      numberOfLines={2}
                    >
                      {product.name}
                    </Text>

                    {/* Lab Pill */}
                    <View style={{
                      backgroundColor: '#E9F7EF',
                      alignSelf: language === 'ar' ? 'flex-end' : 'flex-start',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6
                    }}>
                      <Text style={{ color: '#27AE60', fontSize: 11, fontWeight: '600' }}>
                        {product.lab}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Row: Price & Add Button */}
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>
                      {product.price}
                    </Text>

                    <TouchableOpacity style={{
                      backgroundColor: '#E0E0E0',
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                      borderRadius: 8
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#111' }}>
                        {t('add_btn')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};