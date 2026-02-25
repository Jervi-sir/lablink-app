import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const ORDERS_DATA = [
  {
    id: 'ORD-8829',
    date: 'Oct 24, 2024',
    status: 'In Progress',
    statusColor: '#137FEC',
    lab: 'Advanced Bio-Research Lab',
    product: 'Digital LCD Microscope',
    price: '45,000 DA',
  },
  {
    id: 'ORD-7712',
    date: 'Oct 20, 2024',
    status: 'Pending',
    statusColor: '#F59E0B',
    lab: 'NanoTech Solutions',
    product: 'Centrifuge Machine',
    price: '12,500 DA',
  },
  {
    id: 'ORD-6601',
    date: 'Oct 15, 2024',
    status: 'Completed',
    statusColor: '#10B981',
    lab: 'University Chemistry Dept',
    product: 'Borosil Glass Set',
    price: '3,200 DA',
  },
  {
    id: 'ORD-5590',
    date: 'Oct 10, 2024',
    status: 'Cancelled',
    statusColor: '#EF4444',
    lab: 'Bio-Safety Labs',
    product: 'Hazmat Suit Level 3',
    price: '8,500 DA',
  },
];

const TABS = ['All', 'In Progress', 'Completed'];

export default function StudentM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');

  const navigateToDetail = (order: any) => {
    navigation.navigate(Routes.OrderDetailScreen, { order });
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.7}
      onPress={() => navigateToDetail(item)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: item.statusColor }]} />
          <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderBody}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.itemInfo}>
          <Text style={styles.labName}>{item.lab}</Text>
          <Text style={styles.productName} numberOfLines={1}>{item.product}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => navigateToDetail(item)}
        >
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'In Progress' && (
          <TouchableOpacity style={styles.trackBtn} onPress={() => navigateToDetail(item)}>
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={ORDERS_DATA.filter(o => activeTab === 'All' || o.status === activeTab)}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found</Text>
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
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#137FEC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  orderDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 12,
  },
  orderBody: {
    flexDirection: 'row',
    gap: 12,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  labName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#137FEC',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  detailsBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  trackBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#137FEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
});