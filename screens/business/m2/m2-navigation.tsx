import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, FlatList, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";

const { width } = Dimensions.get('window');

const MOCK_PRODUCTS = [
  { id: '1', name: 'Digital LCD Microscope', category: 'Optical Equipment', price: '45,000 DA', stock: 8, status: 'Active', image: '🔬' },
  { id: '2', name: 'Magnetic Stirrer', category: 'Chemical Tools', price: '12,500 DA', stock: 15, status: 'Active', image: '🧪' },
  { id: '3', name: 'Borosil Glass Beakers', category: 'Glassware', price: '1,200 DA', stock: 0, status: 'Out of Stock', image: '🧪' },
  { id: '4', name: 'Centrifuge Machine', category: 'Laboratory Gear', price: '85,000 DA', stock: 3, status: 'Active', image: '🌀' },
  { id: '5', name: 'Safety Equipment Set', category: 'Safety', price: '5,500 DA', stock: 24, status: 'Draft', image: '🥽' },
  { id: '6', name: 'Electric Bunsen Burner', category: 'Heating', price: '18,000 DA', stock: 5, status: 'Active', image: '🔥' },
];

export default function BusinessM2Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['All', 'Active', 'Out of Stock', 'Draft'];

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderProductItem = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, { product: item })}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Text style={styles.productEmoji}>{item.image}</Text>
        </View>
        <View style={styles.productInfo}>
          <View style={styles.infoHeader}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <View style={[
              styles.statusBadge,
              item.status === 'Active' ? styles.activeBadge :
                item.status === 'Draft' ? styles.draftBadge : styles.oosBadge
            ]}>
              <Text style={[
                styles.statusText,
                item.status === 'Active' ? styles.activeText :
                  item.status === 'Draft' ? styles.draftText : styles.oosText
              ]}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.priceText}>{item.price}</Text>
            <Text style={[styles.stockText, item.stock === 0 && { color: '#EF4444' }]}>
              {item.stock} in stock
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen, { product: item })}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Hide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { borderRightWidth: 0 }]}>
          <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View >
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSub}>Manage your products and stock</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate(Routes.EditCreateProductScreen)}
        >
          <Text style={styles.addBtnIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Search & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters or search query</Text>
          </View>
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  headerSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnIcon: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '300',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  tabsContainer: {
    gap: 10,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardMain: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  activeBadge: { backgroundColor: '#F0FDF4' },
  activeText: { color: '#16A34A' },
  draftBadge: { backgroundColor: '#F1F5F9' },
  draftText: { color: '#64748B' },
  oosBadge: { backgroundColor: '#FEF2F2' },
  oosText: { color: '#EF4444' },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFBFC',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});