import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Switch, Dimensions, Platform, ActivityIndicator, Alert, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { useState, useCallback, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { useAuthStore } from "@/zustand/auth-store";

const { width } = Dimensions.get('window');

// No step-based constants needed now


const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer / Order Form', icon: '🏦' },
  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
  { id: 'cash_at_lab', name: 'Submit Payment at Facility', icon: '🏢' },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product, quantity = 1 } = route.params || {};

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isHazmat, setIsHazmat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const { authType } = useAuthStore();
  const isBusiness = authType === 'business';

  const productOwnerCategory = product?.business?.category?.code;
  const isSupplierProduct = productOwnerCategory === 'supplier';
  const typeLabel = isSupplierProduct ? 'Order' : 'Estimation Request';

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
      setIsReviewMode(false);
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
            {typeLabel} Placed!
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            {isSupplierProduct
              ? "Your order has been registered successfully. The supplier will process it shortly."
              : "Your proposal request has been submitted successfully. You'll be notified once it's confirmed."
            }
          </Text>

          <Confetti />

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
                flex: 1, height: 54, backgroundColor: '#137FEC', borderRadius: 14,
                justifyContent: 'center', alignItems: 'center',
                shadowColor: "#137FEC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>Continue Searching</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // Step Indicator Removed


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
        onPress={() => canProceedDelivery && setIsReviewMode(true)}
        disabled={!canProceedDelivery}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Review Order</Text>
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
            <TouchableOpacity onPress={() => setIsReviewMode(false)}>
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

        {/* Payment Method - Fixed to Bank Transfer for Direct Orders */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Payment</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 12, backgroundColor: '#F0F7FF', borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
            <Text style={{ fontSize: 20 }}>🏦</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>Bank Transfer / Order Form</Text>
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
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Confirm & Place Order</Text>
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
          onPress={() => isReviewMode ? setIsReviewMode(false) : navigation.goBack()}
        >
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {!isReviewMode ? renderDeliveryStep() : renderReviewStep()}
      </ScrollView>
    </ScreenWrapper>
  );
}

const ConfettiPiece = ({ index }: { index: number }) => {
  const x = useSharedValue(Math.random() * width);
  const y = useSharedValue(-20);
  const rotation = useSharedValue(Math.random() * 360);
  const color = ['#137FEC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5];

  useEffect(() => {
    y.value = withDelay(
      index * 50,
      withTiming(Dimensions.get('window').height + 100, {
        duration: 2500 + Math.random() * 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    rotation.value = withTiming(rotation.value + 720, { duration: 3000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 12,
          backgroundColor: color,
          borderRadius: 2,
          zIndex: 999,
        },
        animatedStyle,
      ]}
    />
  );
};

const Confetti = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="none">
      {[...Array(40)].map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

