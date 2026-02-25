import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, StyleSheet } from "react-native";

const CATEGORIES = [
  { id: '1', name: 'All', active: true },
  { id: '2', name: 'Chemicals', active: false },
  { id: '3', name: 'Glassware', active: false },
  { id: '4', name: 'Labs', active: false },
];

const MY_PRODUCTS = [
  { id: '1', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '2', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '3', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '4', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
  { id: '5', name: 'Product name Product name Product name Product', sku: 'GL...', price: '4000 DA', stock: '4 Units (Low)' },
];

export default function MyProductsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Product</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filters Section */}
        <View style={styles.searchFilterContainer}>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <View style={styles.searchIconPlaceholder} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chemicals, glassware"
              placeholderTextColor="#A0AEC0"
            />
            <TouchableOpacity style={styles.filterIconButton}>
              <View style={styles.filterIconPlaceholder} />
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, cat.active && styles.activeChip]}
              >
                <Text style={[styles.chipText, cat.active && styles.activeChipText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <View style={styles.productList}>
          {MY_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImagePlaceholder} />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>

                <View style={styles.skuPriceRow}>
                  <Text style={styles.skuText}>SKU: {product.sku}</Text>
                  <Text style={styles.priceText}>{product.price}</Text>
                </View>

                <Text style={styles.stockStatus}>{product.stock}</Text>
              </View>

              <TouchableOpacity style={styles.editButton}>
                {/* Pencil Icon Placeholder */}
                <View style={styles.pencilIcon}>
                  <View style={{ width: 12, height: 4, backgroundColor: '#137FEC', borderRadius: 1, transform: [{ rotate: '-45deg' }] }} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  addButton: {
    width: 36,
    height: 36,
    backgroundColor: '#E7F2FD',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#137FEC',
    fontWeight: '500',
    marginTop: -2,
  },
  searchFilterContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  searchIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#616A7B',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },
  filterIconButton: {
    padding: 4,
  },
  filterIconPlaceholder: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#137FEC',
  },
  chipsContainer: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F6F7F8',
  },
  activeChip: {
    backgroundColor: '#137FEC',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D6575',
  },
  activeChipText: {
    color: '#FFF',
  },
  productList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  skuPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  skuText: {
    fontSize: 11,
    color: '#5D6575',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#27AE60',
  },
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});