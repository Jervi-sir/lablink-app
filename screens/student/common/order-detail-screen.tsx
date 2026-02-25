import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

const TRACKING_STEPS = [
  { id: 1, title: 'Proposal Submitted', date: 'Oct 24, 09:30 AM', completed: true },
  { id: 2, title: 'Payment Confirmed', date: 'Oct 24, 14:15 PM', completed: true },
  { id: 3, title: 'Processing Order', date: 'Oct 25, 08:00 AM', completed: true },
  { id: 4, title: 'Shipped / Out for Delivery', date: 'Pending', completed: false },
  { id: 5, title: 'Delivered', date: 'Pending', completed: false },
];

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order = {
    id: 'ORD-8829',
    status: 'In Progress',
    lab: 'Advanced Bio-Research Lab',
    product: 'Digital LCD Microscope',
    price: '45,000 DA',
    date: 'Oct 24, 2024'
  } } = route.params || {};

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order.id}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Status Stepper */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tracking Status</Text>
          <View style={styles.stepperContainer}>
            {TRACKING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.lineColumn}>
                  <View style={[
                    styles.stepCircle,
                    step.completed ? styles.completedCircle : styles.pendingCircle
                  ]}>
                    {step.completed && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  {index < TRACKING_STEPS.length - 1 && (
                    <View style={[
                      styles.verticalLine,
                      step.completed && TRACKING_STEPS[index + 1].completed ? styles.completedLine : styles.pendingLine
                    ]} />
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, !step.completed && styles.pendingText]}>{step.title}</Text>
                  <Text style={styles.stepDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          <View style={styles.productRow}>
            <View style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.labName}>{order.lab}</Text>
              <Text style={styles.productName}>{order.product}</Text>
              <Text style={styles.qtyText}>Qty: 1</Text>
              <Text style={styles.priceText}>{order.price}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.infoGroup}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>Building B, Room 302, University Campus</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>Biological Sciences Faculty</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Handling</Text>
              <View style={styles.hazmatBadge}>
                <Text style={styles.hazmatText}>STANDARD HANDLING</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cost Summary</Text>
          <View style={styles.costTable}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Subtotal</Text>
              <Text style={styles.costValue}>{order.price}</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Shipping Fee</Text>
              <Text style={styles.costValue}>800 DA</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tax (VAT 19%)</Text>
              <Text style={styles.costValue}>8,550 DA</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>54,350 DA</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Download Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Message Vendor</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8FAFC',
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
  },
  stepperContainer: {
    paddingLeft: 10,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
  },
  lineColumn: {
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: '#10B981',
  },
  pendingLine: {
    backgroundColor: '#E2E8F0',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  completedCircle: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  pendingCircle: {
    backgroundColor: '#FFF',
    borderColor: '#E2E8F0',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepInfo: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  pendingText: {
    color: '#94A3B8',
  },
  stepDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  labName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#137FEC',
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  qtyText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginTop: 4,
  },
  infoGroup: {
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  hazmatBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
  },
  hazmatText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  costTable: {
    gap: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  costValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  primaryBtn: {
    flex: 1.2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#137FEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
});
