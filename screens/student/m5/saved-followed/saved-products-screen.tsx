import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet, Dimensions, Image } from "react-native";
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
      style={styles.productCard}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.productEmoji}>{item.image}</Text>
        <TouchableOpacity style={styles.heartBtn}>
          <Text style={{ fontSize: 14 }}>❤️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.labName}>{item.lab}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{item.price}</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Products</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={SAVED_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved products yet.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8FAFC' },
  header: {
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  productCard: {
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
  },
  imageContainer: {
    height: COLUMN_WIDTH,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productEmoji: { fontSize: 40 },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  details: { padding: 12, gap: 4 },
  labName: { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: '800', color: '#1E293B', height: 40 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 15, fontWeight: '800', color: '#137FEC' },
  addBtn: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  emptyContainer: { flex: 1, height: 400, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748B', fontWeight: '600', fontSize: 15 }
});
