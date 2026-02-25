import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { ButtonTag } from "../components/buttons/button-tag";
import { BusinessCard1 } from "../components/cards/business-card-1";
import { ProductCard1 } from "../components/cards/product-card-1";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 16) / 2; // (Total width - horizontal padding - gap) / 2

const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Chemicals', active: false },
  { id: '3', name: 'Glassware', active: false },
  { id: '4', name: 'Labs', active: false },
];

const FEATURED_LABS = [
  { id: '1', name: 'Bio-Research' },
  { id: '2', name: 'NanoTech' },
  { id: '3', name: 'ChemLab' },
  { id: '4', name: 'Genomics' },
  { id: '5', name: 'Optics' },
];

const TRENDING_PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', lab: 'NanoTech', price: '45,000 DA' },
  { id: '2', name: 'Borosil Glass Beakers', lab: 'ChemLab', price: '1,200 DA' },
  { id: '3', name: 'Magnetic Stirrer', lab: 'Bio-Research', price: '12,500 DA' },
  { id: '4', name: 'Centrifuge Machine', lab: 'Bio-Research', price: '85,000 DA' },
];

export default function StudentM1Navigation() {
  const navigation = useNavigation<any>();

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ paddingHorizontal: 16, gap: 20, paddingTop: 16 }}>

          {/* 1. Enhanced Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6B7280' }}>Good Morning,</Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>John Doe 👋</Text>
            </View>
            <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
              <View style={{ width: 22, height: 22, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, backgroundColor: '#111' }} />
              <View style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' }} />
            </TouchableOpacity>
          </View>

          {/* 2. Search & Filters */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFF',
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 56,
              gap: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
              elevation: 4,
            }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#137FEC' }}>
              <View style={{ position: 'absolute', bottom: -3, right: -3, width: 8, height: 2, backgroundColor: '#137FEC', transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={{ flex: 1, color: '#9CA3AF', fontSize: 15, fontWeight: '500' }}>Search for equipment or labs...</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.FilterScreen)}
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}
            >
              <View style={{ gap: 3 }}>
                <View style={{ width: 14, height: 2, backgroundColor: '#111', borderRadius: 1 }} />
                <View style={{ width: 10, height: 2, backgroundColor: '#111', borderRadius: 1, alignSelf: 'center' }} />
                <View style={{ width: 14, height: 2, backgroundColor: '#111', borderRadius: 1 }} />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* 3. Promo Banner */}
          <View style={{ backgroundColor: '#137FEC', borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }}>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, alignSelf: 'flex-start' }}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>LAB ACCESS</Text>
              </View>
              <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800', lineHeight: 26 }}>Get 20% Off on{'\n'}PCR Testing Kits</Text>
              <TouchableOpacity style={{ backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={{ color: '#137FEC', fontWeight: '800', fontSize: 12 }}>Claim Now</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50, position: 'absolute', right: -20, bottom: -20 }} />
          </View>

          {/* 4. Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <ButtonTag
                key={cat.id}
                label={cat.name}
                isActive={cat.active}
                onPress={() => { }}
              />
            ))}
          </ScrollView>

          {/* 3. Featured Labs */}
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Featured Labs</Text>
              <TouchableOpacity>
                <Text style={{ color: '#137FEC', fontWeight: '700' }}>View all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 20 }}>
              {FEATURED_LABS.map((lab) => (
                <BusinessCard1
                  key={lab.id}
                  lab={lab}
                  onPress={() => navigation.navigate(Routes.BusinessScreen, { labName: lab.name })}
                />
              ))}
            </ScrollView>
          </View>

          {/* 4. Trending Products */}
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111111' }}>Trending Products</Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {TRENDING_PRODUCTS.map((product) => (
                <ProductCard1
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate(Routes.ProductScreen, { product })}
                />
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}