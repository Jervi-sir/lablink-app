import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";

const SUMMARY_CARDS = [
  { id: '1', title: 'Pending', count: '5', icon: 'clock' },
  { id: '2', title: 'To Ship', count: '5', icon: 'truck' },
  { id: '3', title: 'Packaging', count: '2', icon: 'package' },
];

const FILTER_TABS = ['All', 'New', 'Processing', 'Completed'];

const ORDERS = [
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'New Order',
    statusColor: '#137FEC',
    statusBg: '#E7F2FD',
    buttonType: 'primary'
  },
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'Awaiting Shipment',
    statusColor: '#F59E0B',
    statusBg: '#FEF3C7',
    buttonType: 'primary'
  },
  {
    id: '#ORD-88231',
    time: '10:30AM',
    title: 'Title',
    description: 'description',
    location: 'location',
    status: 'Awaiting Shipment',
    statusColor: '#8B5CF6',
    statusBg: '#F5F3FF',
    buttonType: 'secondary'
  },
];

export default function ListOrdersAsLabScreen() {
  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Incoming Orders</Text>
          <TouchableOpacity>
            <View style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        {/* Summary horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScroll}
        >
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryIconPlaceholder} />
                <Text style={styles.summaryCardTitle}>{card.title}</Text>
              </View>
              <Text style={styles.summaryCount}>{card.count}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Filter Tabs */}
        <View style={styles.filterTabsContainer}>
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
        </View>

        {/* Order List */}
        <View style={styles.orderList}>
          {ORDERS.map((order, index) => (
            <View key={index} style={styles.orderCard}>
              {/* Card Header */}
              <View style={styles.orderCardHeader}>
                <View style={styles.orderIdBadge}>
                  <Text style={styles.orderIdText}>{order.id}</Text>
                </View>
                <Text style={styles.orderTimeText}>{order.time}</Text>
              </View>

              {/* Card Body */}
              <View style={styles.orderCardBody}>
                <View style={styles.itemImagePlaceholder} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{order.title}</Text>
                  <Text style={styles.itemSubtext}>{order.description}</Text>
                  <Text style={styles.itemSubtext}>{order.location}</Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={styles.orderCardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: order.statusBg }]}>
                  <View style={[styles.statusDot, { backgroundColor: order.statusColor }]} />
                  <Text style={[styles.statusText, { color: order.statusColor }]}>
                    {order.status}
                  </Text>
                </View>

                <TouchableOpacity style={[
                  styles.detailsBtn,
                  order.buttonType === 'secondary' && styles.detailsBtnSecondary
                ]}>
                  <Text style={[
                    styles.detailsBtnText,
                    order.buttonType === 'secondary' && styles.detailsBtnTextSecondary
                  ]}>
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  filterIcon: {
    width: 22,
    height: 18,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryScroll: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  filterTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: '#137FEC',
    borderColor: '#137FEC',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
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
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#137FEC',
  },
  orderTimeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderCardBody: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImagePlaceholder: {
    width: 66,
    height: 66,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  itemSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailsBtn: {
    backgroundColor: '#137FEC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  detailsBtnSecondary: {
    backgroundColor: '#E7F2FD',
  },
  detailsBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  detailsBtnTextSecondary: {
    color: '#137FEC',
  },
});