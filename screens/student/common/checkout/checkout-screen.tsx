import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Switch, Dimensions, Platform, ActivityIndicator, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, name: 'Delivery' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer / Order Form', icon: '🏦' },
  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
  { id: 'cash_at_lab', name: 'Submit Payment at Facility', icon: '🏢' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product, quantity = 1 } = route.params || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [isHazmat, setIsHazmat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  // Form States
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  // Compute prices
  const productPrice = typeof product?.price === 'number' ? product.price : parseFloat(String(product?.price || '0').replace(/[^0-9.]/g, '')) || 0;
  const subtotal = productPrice * quantity;
  const shippingFee = isHazmat ? 2500 : 800;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + shippingFee + tax;

  const formatPrice = (price: number) => `${price.toLocaleString()} DA`;

  const canProceedDelivery = address.trim().length > 0;

  const submitOrder = useCallback(async () => {
    if (submitting) return;

    if (!address.trim()) {
      Alert.alert('Missing Address', 'Please enter a delivery address before submitting.');
      setCurrentStep(1);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        shipping_address: address.trim(),
        department: department.trim() || null,
        phone: phone.trim() || null,
        payment_method: paymentMethod,
        is_hazmat: isHazmat,
        products: [
          {
            id: product.id,
            quantity: quantity,
          }
        ],
      };

      const response = await api.post(buildRoute(ApiRoutes.orders.store), payload);

      if (response && response.data) {
        setPlacedOrder(response.data);
        setOrderPlaced(true);
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const message =
        error?.response?.data?.message
        || error?.message
        || 'Something went wrong. Please try again.';
      Alert.alert('Order Failed', message);
    } finally {
      setSubmitting(false);
    }
  }, [address, department, phone, paymentMethod, isHazmat, product, quantity, submitting]);

  // ── Success Screen ──
  if (orderPlaced) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          {/* Success Circle */}
          <View style={{
            width: 100, height: 100, borderRadius: 50, backgroundColor: '#E9F7EF',
            justifyContent: 'center', alignItems: 'center', marginBottom: 24,
            shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 6,
          }}>
            <Text style={{ fontSize: 44 }}>✓</Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: '900', color: '#111', textAlign: 'center' }}>
            Order Placed!
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            Your proposal request has been submitted successfully. You'll be notified once it's confirmed.
          </Text>

          {placedOrder?.code && (
            <View style={{
              marginTop: 24, backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '100%',
              borderWidth: 1, borderColor: '#F1F5F9',
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>Order Code</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#137FEC', letterSpacing: 1 }}>{placedOrder.code}</Text>
              </View>
              {placedOrder.total_price && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>Total</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{formatPrice(parseFloat(placedOrder.total_price))}</Text>
                </View>
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 32, width: '100%' }}>
            <TouchableOpacity
              style={{
                flex: 1, height: 54, backgroundColor: '#F1F5F9', borderRadius: 14,
                justifyContent: 'center', alignItems: 'center',
              }}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: Routes.StudentNavigation }],
                });
                setTimeout(() => {
                  navigation.navigate(Routes.StudentM4Navigation);
                }, 100);
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>View Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1, height: 54, backgroundColor: '#137FEC', borderRadius: 14,
                justifyContent: 'center', alignItems: 'center',
                shadowColor: "#137FEC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
              }}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: Routes.StudentNavigation }],
                });
                setTimeout(() => {
                  navigation.navigate(Routes.StudentM1Navigation);
                }, 100);
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Step Indicator ──
  const renderStepIndicator = () => (
    <View style={{ flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 20, paddingHorizontal: 30, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', zIndex: 2 }}>
            <View style={[
              { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
              currentStep >= step.id && { borderColor: '#137FEC', backgroundColor: '#137FEC' },
              currentStep > step.id && { backgroundColor: '#137FEC', borderColor: '#137FEC' }
            ]}>
              {currentStep > step.id ? (
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '900' }}>✓</Text>
              ) : (
                <Text style={[
                  { fontSize: 14, fontWeight: '800', color: '#94A3B8' },
                  currentStep >= step.id && { color: '#FFF' }
                ]}>
                  {step.id}
                </Text>
              )}
            </View>
            <Text style={[
              { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 4, textTransform: 'uppercase' },
              currentStep >= step.id && { color: '#137FEC' }
            ]}>
              {step.name}
            </Text>
          </View>
          {index < STEPS.length - 1 && (
            <View style={[
              { width: 60, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 4, marginTop: -14 },
              currentStep > step.id && { backgroundColor: '#137FEC' }
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  // ── Step 1: Delivery ──
  const renderDeliveryStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Delivery Location</Text>
        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' }}>Where should we send the equipment?</Text>

        <View style={{ marginTop: 20, gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: 4 }}>Full Address / Campus Location *</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: address.trim() ? '#137FEC' : '#E2E8F0' }}
              placeholder="e.g. Building B, Room 302..."
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: 4 }}>Department / Faculty</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' }}
              placeholder="e.g. Biological Sciences"
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: 4 }}>Contact Phone</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' }}
              placeholder="+213 --- -- -- --"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: '#FEF2F2', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#FEE2E2' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>☢️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#991B1B' }}>Hazardous Materials</Text>
            <Text style={{ fontSize: 12, color: '#B91C1C', marginTop: 2, fontWeight: '500' }}>Requires specialized handling & safety documentation.</Text>
          </View>
          <Switch
            value={isHazmat}
            onValueChange={setIsHazmat}
            trackColor={{ false: "#E2E8F0", true: "#EF4444" }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          height: 58, backgroundColor: canProceedDelivery ? '#137FEC' : '#94A3B8', borderRadius: 16,
          justifyContent: 'center', alignItems: 'center', marginTop: 10,
          shadowColor: "#137FEC", shadowOffset: { width: 0, height: 8 }, shadowOpacity: canProceedDelivery ? 0.2 : 0, shadowRadius: 12, elevation: canProceedDelivery ? 4 : 0,
        }}
        onPress={() => canProceedDelivery && setCurrentStep(2)}
        disabled={!canProceedDelivery}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Continue to Payment</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Step 2: Payment ──
  const renderPaymentStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Payment Method</Text>
        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' }}>Select how you'd like to fund this proposal.</Text>

        <View style={{ marginTop: 20, gap: 12 }}>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
                paymentMethod === method.id && { borderColor: '#137FEC', backgroundColor: '#F0F7FF' }
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Text style={{ fontSize: 20 }}>{method.icon}</Text>
              <Text style={[
                { flex: 1, fontSize: 15, fontWeight: '700', color: '#475569' },
                paymentMethod === method.id && { color: '#137FEC' }
              ]}>{method.name}</Text>
              <View style={[
                { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
                paymentMethod === method.id && { borderColor: '#137FEC' }
              ]}>
                {paymentMethod === method.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#137FEC' }} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={{ height: 58, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#137FEC", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }}
        onPress={() => setCurrentStep(3)}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Review Proposal</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Step 3: Review ──
  const renderReviewStep = () => {
    const labName = product?.business?.name || product?.lab || 'Facility';

    return (
      <View style={{ padding: 20, gap: 20 }}>
        {/* Order Item */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Order Summary</Text>
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
            <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>🔬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }} numberOfLines={2}>{product?.name || "Equipment"}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{labName}</Text>
              <Text style={{ fontSize: 13, color: '#137FEC', fontWeight: '700', marginTop: 4 }}>Qty: {quantity}</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{formatPrice(productPrice)}</Text>
          </View>

          {/* Pricing Breakdown */}
          <View style={{ marginTop: 20, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Shipping & Handling</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(shippingFee)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>VAT (19%)</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(tax)}</Text>
            </View>
            <View style={{ marginTop: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Total Amount</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Delivery Details</Text>
            <TouchableOpacity onPress={() => setCurrentStep(1)}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 16, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80 }}>Address</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{address}</Text>
            </View>
            {department ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80 }}>Dept.</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{department}</Text>
              </View>
            ) : null}
            {phone ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80 }}>Phone</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1 }}>{phone}</Text>
              </View>
            ) : null}
            {isHazmat && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 13 }}>☢️</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>Hazardous Materials Handling</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Payment</Text>
            <TouchableOpacity onPress={() => setCurrentStep(2)}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 12, backgroundColor: '#F0F7FF', borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
            <Text style={{ fontSize: 20 }}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.icon || '💳'}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Terms & Safety</Text>
          <View style={{ padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginTop: 12 }}>
            <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 18, fontWeight: '500', textAlign: 'center' }}>By submitting, you agree to the laboratory's handling policies and safety protocols.</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            {
              height: 58, backgroundColor: '#10B981', borderRadius: 16,
              justifyContent: 'center', alignItems: 'center', marginTop: 10,
              shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
              flexDirection: 'row', gap: 8,
            },
            submitting && { opacity: 0.7 },
          ]}
          onPress={submitOrder}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Placing Order...</Text>
            </>
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Submit Proposal Request</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigation.goBack()}
        >
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {currentStep === 1 && renderDeliveryStep()}
        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && renderReviewStep()}
      </ScrollView>
    </ScreenWrapper>
  );
}
