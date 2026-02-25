import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Switch, Dimensions, Platform } from "react-native";
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

  const renderDeliveryStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Delivery Location</Text>
        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' }}>Where should we send the equipment?</Text>

        <View style={{ marginTop: 20, gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: 4 }}>Full Address / Campus Location</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0' }}
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
        style={{ height: 58, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#137FEC", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }}
        onPress={() => setCurrentStep(2)}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Continue to Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Payment Method</Text>
        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' }}>Select how you'd like to fund this proposal.</Text>

        <View style={{ marginTop: 20, gap: 12 }}>
          {[
            { id: 'bank_transfer', name: 'Bank Transfer / Order Form', icon: '🏦' },
            { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
            { id: 'cash_at_lab', name: 'Submit Payment at Facility', icon: '🏢' },
          ].map(method => (
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

  const renderReviewStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Order Summary</Text>
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
          <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#F1F5F9' }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{product?.name || "Equipment"}</Text>
            <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{product?.lab || "Facility"}</Text>
            <Text style={{ fontSize: 13, color: '#137FEC', fontWeight: '700', marginTop: 4 }}>Quantity: {quantity}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{product?.price}</Text>
        </View>

        <View style={{ marginTop: 20, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Subtotal</Text>
            <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{subtotal.toLocaleString()} DA</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Shipping & Handling</Text>
            <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{shippingFee.toLocaleString()} DA</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>VAT (19%)</Text>
            <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{tax.toLocaleString()} DA</Text>
          </View>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, { marginTop: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Total Amount</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>{total.toLocaleString()} DA</Text>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>Terms & Safety</Text>
        <View style={{ padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginTop: 12 }}>
          <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 18, fontWeight: '500', textAlign: 'center' }}>By submitting, you agree to the laboratory's handling policies and safety protocols.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[{ height: 58, backgroundColor: '#137FEC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#137FEC", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }, { backgroundColor: '#10B981' }]}
        onPress={() => console.log("Final Submission")}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>Submit Proposal Request</Text>
      </TouchableOpacity>
    </View>
  );

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

