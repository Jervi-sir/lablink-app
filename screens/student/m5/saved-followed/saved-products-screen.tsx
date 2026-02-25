import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

import { ProductCard1 } from "../../components/cards/product-card-1";

const SAVED_PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', lab: 'NanoTech', price: '45,000 DA' },
  { id: '2', name: 'Magnetic Stirrer', lab: 'Bio-Research', price: '12,500 DA' },
  { id: '3', name: 'High-Speed Centrifuge', lab: 'Bio-Research', price: '85,000 DA' },
  { id: '4', name: 'Digital pH Meter', lab: 'ChemLab', price: '8,400 DA' },
  { id: '5', name: 'Laboratory Incubator', lab: 'Bio-Research', price: '120,000 DA' },
  { id: '6', name: 'Precision Balance', lab: 'NanoTech', price: '32,000 DA' },
];

export default function StudentSavedProductsScreen() {
  const navigation = useNavigation<any>();

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard1
      product={item}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
      style={{ marginBottom: 16 }}
    />
  );


  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Saved Products</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={SAVED_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, height: 400, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 15 }}>No saved products yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

