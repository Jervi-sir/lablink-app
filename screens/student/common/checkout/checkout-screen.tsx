import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, StyleSheet, TextInput, Switch, Dimensions, Platform } from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, name: 'Delivery' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product, quantity = 1 } = route.params || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [isHazmat, setIsHazmat] = useState(false);

  // Form States
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const productPrice = parseFloat((product?.price || "0").replace(/[^0-9.]/g, '')) || 45000;
  const subtotal = productPrice * quantity;
  const shippingFee = isHazmat ? 2500 : 800;
  const tax = subtotal * 0.19;
  const total = subtotal + shippingFee + tax;

  const renderStepIndicator = () => (
    <View style={styles.stepperContainer}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepWrapper}>
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              currentStep >= step.id && styles.activeStepCircle,
              currentStep > step.id && styles.completedStepCircle
            ]}>
              {currentStep > step.id ? (
                <Text style={styles.checkIcon}>✓</Text>
              ) : (
                <Text style={[
                  styles.stepNumber,
                  currentStep >= step.id && styles.activeStepNumber
                ]}>
                  {step.id}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep >= step.id && styles.activeStepLabel
            ]}>
              {step.name}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View style={[
              styles.stepConnector,
              currentStep > step.id && styles.activeStepConnector
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderDeliveryStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <Text style={styles.sectionSub}>Where should we send the equipment?</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Full Address / Campus Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Building B, Room 302..."
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Department / Faculty</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Biological Sciences"
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="+213 --- -- -- --"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      <View style={styles.hazmatCard}>
        <View style={styles.hazmatHeader}>
          <View style={styles.hazmatIcon}>
            <Text style={{ fontSize: 20 }}>☢️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hazmatTitle}>Hazardous Materials</Text>
            <Text style={styles.hazmatSub}>Requires specialized handling & safety documentation.</Text>
          </View>
          <Switch
            value={isHazmat}
            onValueChange={setIsHazmat}
            trackColor={{ false: "#E2E8F0", true: "#EF4444" }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => setCurrentStep(2)}
      >
        <Text style={styles.mainBtnText}>Continue to Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.sectionSub}>Select how you'd like to fund this proposal.</Text>

        <View style={styles.paymentList}>
          {[
            { id: 'bank_transfer', name: 'Bank Transfer / Order Form', icon: '🏦' },
            { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
            { id: 'cash_at_lab', name: 'Submit Payment at Facility', icon: '🏢' },
          ].map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                paymentMethod === method.id && styles.paymentOptionActive
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Text style={{ fontSize: 20 }}>{method.icon}</Text>
              <Text style={[
                styles.paymentMethodName,
                paymentMethod === method.id && styles.paymentMethodNameActive
              ]}>{method.name}</Text>
              <View style={[
                styles.radio,
                paymentMethod === method.id && styles.radioActive
              ]}>
                {paymentMethod === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainBtn}
        onPress={() => setCurrentStep(3)}
      >
        <Text style={styles.mainBtnText}>Review Proposal</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.productReview}>
          <View style={styles.productThumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewProdName}>{product?.name || "Equipment"}</Text>
            <Text style={styles.reviewLabName}>{product?.lab || "Facility"}</Text>
            <Text style={styles.reviewQty}>Quantity: {quantity}</Text>
          </View>
          <Text style={styles.reviewPrice}>{product?.price}</Text>
        </View>

        <View style={styles.summaryBreakdown}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()} DA</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping & Handling</Text>
            <Text style={styles.summaryValue}>{shippingFee.toLocaleString()} DA</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT (19%)</Text>
            <Text style={styles.summaryValue}>{tax.toLocaleString()} DA</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{total.toLocaleString()} DA</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Terms & Safety</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>By submitting, you agree to the laboratory's handling policies and safety protocols.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.mainBtn, { backgroundColor: '#10B981' }]}
        onPress={() => console.log("Final Submission")}
      >
        <Text style={styles.mainBtnText}>Submit Proposal Request</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigation.goBack()}
        >
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {currentStep === 1 && renderDeliveryStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}
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
  stepperContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepCircle: {
    borderColor: '#137FEC',
    backgroundColor: '#137FEC',
  },
  completedStepCircle: {
    backgroundColor: '#137FEC',
    borderColor: '#137FEC',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
  },
  activeStepNumber: {
    color: '#FFF',
  },
  checkIcon: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  activeStepLabel: {
    color: '#137FEC',
  },
  stepConnector: {
    width: 60,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginTop: -14,
  },
  activeStepConnector: {
    backgroundColor: '#137FEC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stepContainer: {
    padding: 20,
    gap: 20,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  inputGroup: {
    marginTop: 20,
    gap: 16,
  },
  inputWrapper: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hazmatCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  hazmatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hazmatIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hazmatTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  hazmatSub: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
    fontWeight: '500',
  },
  mainBtn: {
    height: 58,
    backgroundColor: '#137FEC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#137FEC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  mainBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
  paymentList: {
    marginTop: 20,
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  paymentOptionActive: {
    borderColor: '#137FEC',
    backgroundColor: '#F0F7FF',
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  paymentMethodNameActive: {
    color: '#137FEC',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#137FEC',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#137FEC',
  },
  productReview: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  productThumb: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  reviewProdName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  reviewLabName: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  reviewQty: {
    fontSize: 13,
    color: '#137FEC',
    fontWeight: '700',
    marginTop: 4,
  },
  reviewPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  summaryBreakdown: {
    marginTop: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  infoRow: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  }
});
