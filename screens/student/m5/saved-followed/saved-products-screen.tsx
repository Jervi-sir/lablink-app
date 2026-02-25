import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const SAVED_PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', lab: 'NanoTech', price: '45,000 DA', image: '🔬' },
  { id: '2', name: 'Magnetic Stirrer', lab: 'Bio-Research', price: '12,500 DA', image: '🧪' },
  { id: '3', name: 'High-Speed Centrifuge', lab: 'Bio-Research', price: '85,000 DA', image: '🌀' },
  { id: '4', name: 'Digital pH Meter', lab: 'ChemLab', price: '8,400 DA', image: '🌡️' },
  { id: '5', name: 'Laboratory Incubator', lab: 'Bio-Research', price: '120,000 DA', image: '📦' },
  { id: '6', name: 'Precision Balance', lab: 'NanoTech', price: '32,000 DA', image: '⚖️' },
];

export default function StudentSavedProductsScreen() {
  const navigation = useNavigation<any>();

  const renderProduct = ({ item }: { item: typeof SAVED_PRODUCTS[0] }) => (
    <TouchableOpacity
      style={{
        width: COLUMN_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 16
      }}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
      activeOpacity={0.9}
    >
      <View style={{ height: COLUMN_WIDTH, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <Text style={{ fontSize: 40 }}>{item.image}</Text>
        <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ fontSize: 14 }}>❤️</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 12, gap: 4 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>{item.lab}</Text>
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', height: 40 }} numberOfLines={2}>{item.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#137FEC' }}>{item.price}</Text>
          <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 10, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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

