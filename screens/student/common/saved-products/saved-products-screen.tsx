import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet } from "react-native";

const SAVED_PRODUCTS = [
  { id: '1', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '2', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
  { id: '3', name: 'Product name Product name Product name Product', lab: 'Lab name', price: '4000 DA' },
];

export default function SavedProductsScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          {/* Back Arrow Placeholder */}
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ width: 40 }} /> {/* Spacer for centering the title */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.productList}>
          {SAVED_PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder} />

              <View style={styles.productInfo}>
                <View style={styles.topInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>

                  {/* Lab Pill */}
                  <View style={styles.labPill}>
                    <Text style={styles.labText}>{product.lab}</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.bottomRow}>
                  <Text style={styles.priceText}>{product.price}</Text>

                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#111',
    transform: [{ rotate: '-45deg' }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  productList: {
    gap: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 95,
    height: 95,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topInfo: {
    gap: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  labPill: {
    backgroundColor: '#E9F7EF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  labText: {
    color: '#27AE60',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  addButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
});