import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const MOCK_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  name: i % 2 === 0 ? 'Digital LCD Microscope' : 'Borosil Glass Beakers',
  price: i % 2 === 0 ? '45,000 DA' : '1,200 DA',
  lab: 'Advanced Bio-Lab'
}));

export default function LabProductsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { labName = "Laboratory Equipment" } = route.params || {};

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate(Routes.ProductScreen, { product: item })}
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.info}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{labName}</Text>
          <Text style={styles.headerSub}>All Available Products</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_PRODUCTS}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imagePlaceholder: {
    height: COLUMN_WIDTH,
    backgroundColor: '#F8FAFC',
  },
  info: {
    padding: 12,
    gap: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  name: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
});
