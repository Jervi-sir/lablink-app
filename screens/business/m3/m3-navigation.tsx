import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, FlatList, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState } from "react";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

const MOCK_ORDERS = [
  { id: 'ORD-8821', student: 'Amine Kerroum', items: 'Digital Microscope X1', date: '24 Feb, 14:30', amount: '45,000 DA', status: 'Pending', emoji: '🔬' },
  { id: 'ORD-8819', student: 'Dr. Sarah B.', items: 'Magnetic Stirrer + 3 Beakers', date: '24 Feb, 10:15', amount: '16,100 DA', status: 'Processing', emoji: '🧪' },
  { id: 'ORD-8815', student: 'Lab Research Team', items: 'PCR Reagents Kit', date: '23 Feb, 16:45', amount: '12,000 DA', status: 'Ready', emoji: '🧬' },
  { id: 'ORD-8802', student: 'University of Algiers', items: 'Protective Gear Bundle', date: '22 Feb, 09:00', amount: '5,500 DA', status: 'Done', emoji: '🥽' },
  { id: 'ORD-8798', student: 'Yanis Mahidi', items: 'Electric Bunsen Burner', date: '21 Feb, 11:30', amount: '18,000 DA', status: 'Cancelled', emoji: '🔥' },
];

export default function BusinessM3Navigation() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const TABS = ['All', 'Pending', 'Processing', 'Ready', 'Done'];

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.student.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || o.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#F5F3FF', text: '#8B5CF6' }; // Purple for theme
      case 'Processing': return { bg: '#FFF7ED', text: '#F59E0B' };
      case 'Ready': return { bg: '#ECFDF5', text: '#10B981' };
      case 'Done': return { bg: '#F1F5F9', text: '#64748B' };
      case 'Cancelled': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F8FAFC', text: '#94A3B8' };
    }
  };

  const renderOrderItem = ({ item }: { item: typeof MOCK_ORDERS[0] }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBody}>
          <View style={styles.studentIcon}>
            <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.studentName}>{item.student}</Text>
            <Text style={styles.itemsSummary} numberOfLines={1}>{item.items}</Text>
          </View>
          <View style={styles.amountWrap}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountValue}>{item.amount}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.primaryAction]}
            onPress={() => navigation.navigate(Routes.BusinessOrderDetailScreen, { order: item })}
          >
            <Text style={styles.primaryActionText}>Manage Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => navigation.navigate(Routes.BusinessInvoiceScreen, { order: item })}
          >
            <Text style={styles.secondaryActionText}>Invoicing</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* 1. Dashboard Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Order Hub</Text>
          <Text style={styles.headerSub}>Manage procurement requests</Text>
        </View>
        <TouchableOpacity style={styles.statsBtn}>
          <View style={styles.dotIndicator} />
          <Text style={styles.statsBtnText}>3 New</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Quick Metrics Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsContainer}>
        <View style={[styles.metricBox, { borderColor: '#8B5CF6' }]}>
          <Text style={styles.metricLabel}>Pending</Text>
          <Text style={[styles.metricValue, { color: '#8B5CF6' }]}>12</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Processing</Text>
          <Text style={styles.metricValue}>5</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Ready</Text>
          <Text style={styles.metricValue}>8</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={styles.metricValue}>142</Text>
        </View>
      </ScrollView>

      {/* 3. Filter Sticky Bar */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Text style={styles.searchEmoji}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Order ID or Researcher..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 4. Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listArea}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySub}>Adjust your filters or search criteria</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111' },
  headerSub: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  statsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  dotIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6', marginRight: 8 },
  statsBtnText: { fontSize: 13, fontWeight: '800', color: '#111' },
  metricsContainer: { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  metricBox: { width: 100, backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: '#E2E8F0', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  metricLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#111' },
  filterBar: { paddingHorizontal: 20, marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  searchEmoji: { marginRight: 10, fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111' },
  tabContainer: { gap: 8, paddingBottom: 4 },
  tab: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  activeTab: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  activeTabText: { color: '#FFF' },
  listArea: { paddingHorizontal: 20, paddingBottom: 100 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 16, fontWeight: '800', color: '#111' },
  orderDate: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  cardDivider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 14 },
  cardBody: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  studentIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  orderInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '800', color: '#111' },
  itemsSummary: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 },
  amountWrap: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  amountValue: { fontSize: 14, fontWeight: '800', color: '#111' },
  cardActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 2, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryAction: { backgroundColor: '#F5F3FF' },
  primaryActionText: { color: '#8B5CF6', fontSize: 13, fontWeight: '800' },
  secondaryAction: { flex: 1, height: 44, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  secondaryActionText: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
});