import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 1, title: 'Proposal Received', date: 'Feb 24, 14:30 PM', completed: true },
  { id: 2, title: 'Order Confirmed', date: 'Feb 24, 15:45 PM', completed: true },
  { id: 3, title: 'Processing / Preparation', date: 'Processing', completed: false, current: true },
  { id: 4, title: 'Quality Check', date: 'Pending', completed: false },
  { id: 5, title: 'Ready for Collection / Shipped', date: 'Pending', completed: false },
];

export default function BusinessOrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order = {
    id: 'ORD-8821',
    status: 'Pending',
    student: 'Amine Kerroum',
    items: 'Digital Microscope X1',
    amount: '45,000 DA',
    date: '24 Feb, 14:30',
    emoji: '🔬'
  } } = route.params || {};

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.actionIconBtn}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 1. Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.orderLabel}>ORDER ID</Text>
              <Text style={styles.orderValue}>{order.id}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.customerRow}
            onPress={() => navigation.navigate(Routes.BusinessStudentProfileScreen, {
              student: {
                name: order.student,
                online: true,
                avatar: order.student.charAt(0),
                role: 'PhD Researcher', // Mock data for profile
                department: 'Molecular Biology',
                university: 'USTHB University'
              }
            })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{order.student.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{order.student}</Text>
              <Text style={styles.customerSub}>Researcher • University of Algiers</Text>
            </View>
            <View style={styles.chevron}>
              <Text style={{ fontSize: 18, color: '#94A3B8' }}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2. Order Timeline / Workflow */}
        <Text style={styles.sectionTitle}>Fulfillment Workflow</Text>
        <View style={styles.workflowCard}>
          {TRACKING_STEPS.map((step, index) => (
            <View key={step.id} style={styles.workflowStep}>
              <View style={styles.stepMarker}>
                <View style={[
                  styles.dot,
                  step.completed ? styles.dotCompleted : (step.current ? styles.dotCurrent : styles.dotPending)
                ]}>
                  {step.completed && <Text style={styles.check}>✓</Text>}
                </View>
                {index < TRACKING_STEPS.length - 1 && <View style={[styles.line, step.completed && TRACKING_STEPS[index + 1].completed && styles.lineCompleted]} />}
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepTitle, !step.completed && !step.current && styles.textPending]}>{step.title}</Text>
                <Text style={styles.stepDate}>{step.date}</Text>
              </View>
              {step.current && (
                <TouchableOpacity style={styles.updateBtn}>
                  <Text style={styles.updateBtnText}>Update</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* 3. Items & Pricing */}
        <Text style={styles.sectionTitle}>Items & Financials</Text>
        <View style={styles.itemsCard}>
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, {
              product: {
                name: order.items,
                price: order.amount,
                image: order.emoji,
                status: 'Active',
                category: 'Optical Equipment' // Mock category for navigation
              }
            })}
          >
            <View style={styles.itemEmojiBox}>
              <Text style={{ fontSize: 24 }}>{order.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{order.items}</Text>
              <View style={styles.navBadge}>
                <Text style={styles.qtyText}>Quantity: 1 • View Product Details</Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>{order.amount}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.costTable}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Subtotal</Text>
              <Text style={styles.costValue}>{order.amount}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tax (VAT 19%)</Text>
              <Text style={styles.costValue}>8,550 DA</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>53,550 DA</Text>
            </View>
          </View>
        </View>

        {/* 4. Delivery Address */}
        <Text style={styles.sectionTitle}>Shipping / Delivery Details</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressText}>Faculty of Biological Sciences, University of Science and Technology Houari Boumediene (USTHB), Algiers, Algeria.</Text>
          <TouchableOpacity style={styles.mapBtn}>
            <Text style={styles.mapBtnText}>View on Map</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Management Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, {
            chat: {
              name: order.student,
              online: true,
              avatar: order.student.charAt(0)
            }
          })}
        >
          <Text style={styles.secondaryBtnText}>Message Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Advance to Next Stage</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#F8F9FB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  actionIconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 150 },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  orderValue: { fontSize: 18, fontWeight: '900', color: '#111', marginTop: 2 },
  statusBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '900', color: '#8B5CF6', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#8B5CF6' },
  customerName: { fontSize: 16, fontWeight: '800', color: '#111' },
  customerSub: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 },
  chevron: { marginLeft: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 },
  workflowCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
  workflowStep: { flexDirection: 'row', gap: 16 },
  stepMarker: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, backgroundColor: '#FFF' },
  dotCompleted: { backgroundColor: '#10B981', borderColor: '#10B981' },
  dotCurrent: { borderColor: '#8B5CF6', backgroundColor: '#FFF' },
  dotPending: { borderColor: '#E2E8F0', backgroundColor: '#FFF' },
  check: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  line: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  lineCompleted: { backgroundColor: '#10B981' },
  stepInfo: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  textPending: { color: '#94A3B8' },
  stepDate: { fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 },
  updateBtn: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  updateBtnText: { color: '#8B5CF6', fontSize: 12, fontWeight: '800' },
  itemsCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemEmojiBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 15, fontWeight: '800', color: '#111' },
  navBadge: { flexDirection: 'row', alignItems: 'center' },
  qtyText: { fontSize: 12, fontWeight: '600', color: '#94A3B8', marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#111' },
  costTable: { gap: 10, marginTop: 4 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between' },
  costLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  costValue: { fontSize: 14, color: '#111', fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#111' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#8B5CF6' },
  addressCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 32 },
  addressText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' },
  mapBtn: { marginTop: 16, alignSelf: 'flex-start' },
  mapBtnText: { color: '#8B5CF6', fontSize: 14, fontWeight: '800' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  primaryBtn: { flex: 1.5, height: 56, borderRadius: 16, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#475569', fontSize: 15, fontWeight: '700' },
});
