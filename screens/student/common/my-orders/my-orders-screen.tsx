import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, Dimensions, Image } from "react-native";

const FILTER_TABS = ['All', 'Processing', 'Shipped', 'Delivered'];

const ORDERS = [
  {
    id: '#ORD-2023-88',
    date: 'Oct 10, 2023 • 2:30 PM',
    items: 'Bunsen Burner, Tripod Stand, Wire Gauze, 500ml Beakers (x2)',
    itemCount: '4 Items',
    status: 'Delivered',
    statusType: 'success',
    action: 'Download Agreement',
    actionType: 'primary'
  },
  {
    id: '#ORD-2023-89',
    date: 'Oct 24, 2023 • 10:15 AM',
    items: 'Microscope Slides (Box of 50), Safety Goggles, Lab Coat...',
    itemCount: '3 Items',
    status: 'Shipped',
    statusType: 'info',
    action: 'Download Agreement',
    actionType: 'secondary'
  },
  {
    id: '#ORD-2023-90',
    date: 'Nov 01, 2023 • 9:45 AM',
    items: 'Petri Dishes (Sterile), Agar Powder (100g), Pipettes',
    itemCount: '3 Items',
    status: 'Processing',
    statusType: 'warning',
    action: 'Agreement Pending',
    actionType: 'pending'
  },
  {
    id: '#ORD-2023-45',
    date: 'Sep 15, 2023 • 4:20 PM',
    items: 'Digital Precision Scale, Calibration Weights',
    itemCount: '2 Items',
    status: 'Delivered',
    statusType: 'success',
    action: 'Download Agreement',
    actionType: 'primary'
  },
];

export default function MyOrdersScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <View style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIcon} />
            <TextInput
              placeholder="Search Order ID or item..."
              style={styles.searchInput}
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTER_TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, index === 0 && styles.activeFilterTab]}
              >
                <Text style={[styles.filterTabText, index === 0 && styles.activeFilterTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Order List */}
        <View style={styles.orderList}>
          {ORDERS.map((order, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  order.statusType === 'success' && styles.successBadge,
                  order.statusType === 'info' && styles.infoBadge,
                  order.statusType === 'warning' && styles.warningBadge,
                ]}>
                  <Text style={[
                    styles.statusText,
                    order.statusType === 'success' && styles.successText,
                    order.statusType === 'info' && styles.infoText,
                    order.statusType === 'warning' && styles.warningText,
                  ]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.itemImagePlaceholder} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemsListText} numberOfLines={2}>{order.items}</Text>
                  <Text style={styles.itemCountText}>{order.itemCount}</Text>
                </View>
              </View>

              <TouchableOpacity style={[
                styles.actionBtn,
                order.actionType === 'secondary' && styles.actionBtnSecondary,
                order.actionType === 'pending' && styles.actionBtnPending,
              ]}>
                <View style={[
                  styles.actionIcon,
                  order.actionType === 'pending' && styles.pendingIcon
                ]} />
                <Text style={[
                  styles.actionBtnText,
                  order.actionType === 'secondary' && styles.actionBtnTextSecondary,
                  order.actionType === 'pending' && styles.actionBtnTextPending,
                ]}>
                  {order.action}
                </Text>
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
    paddingBottom: 40,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  backBtn: {
    padding: 8,
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '-45deg' }],
  },
  filterIcon: {
    width: 20,
    height: 18,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#A0AEC0',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  filterTabsContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  orderList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  successBadge: { backgroundColor: '#E9F7EF' },
  infoBadge: { backgroundColor: '#E7F2FD' },
  warningBadge: { backgroundColor: '#FFFBEB' },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  successText: { color: '#27AE60' },
  infoText: { color: '#137FEC' },
  warningText: { color: '#F59E0B' },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImagePlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: '#1A2526',
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemsListText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    lineHeight: 20,
  },
  itemCountText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  actionBtn: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#137FEC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnSecondary: {
    backgroundColor: '#E7F2FD',
  },
  actionBtnPending: {
    backgroundColor: '#E7F2FD',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnTextSecondary: {
    color: '#137FEC',
  },
  actionBtnTextPending: {
    color: '#137FEC',
  },
  actionIcon: {
    width: 14,
    height: 16,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  pendingIcon: {
    backgroundColor: '#137FEC',
    width: 14,
    height: 14,
    borderRadius: 7,
  }
});