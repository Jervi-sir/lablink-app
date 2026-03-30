import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, TextInput, View } from "react-native";

export default function LabEstimationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { businessId } = route.params || {};

  const carts = useLabCartStore((state) => state.carts);
  const currentCart = carts[Number(businessId)];
  const business = currentCart?.business;
  const items = currentCart?.items || [];

  const updateQuantity = useLabCartStore((state) => state.updateQuantity);
  const removeItem = useLabCartStore((state) => state.removeItem);
  const clearCart = useLabCartStore((state) => state.clearCart);

  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);

  const itemCount = useMemo(
    () => items.reduce((total: number, item: any) => total + item.quantity, 0),
    [items]
  );

  const estimatedTotal = useMemo(
    () => items.reduce((total: number, item: any) => total + (item.price || 0) * item.quantity, 0),
    [items]
  );

  const formatPrice = (value: number) => `${value.toLocaleString()} DA`;

  const submitRequest = async () => {
    if (!business || items.length === 0 || submitting) {
      return;
    }

    if (!phone.trim() && !address.trim()) {
      Alert.alert('Missing details', 'Please add a phone number or address so the lab can reach you.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(buildRoute(ApiRoutes.estimationRequests.store), {
        business_id: business.id,
        address: address.trim() || null,
        department: department.trim() || null,
        phone: phone.trim() || null,
        notes: notes.trim() || null,
        items: items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });

      if (response?.data) {
        setSubmittedRequest(response.data);
        if (business) clearCart(business.id);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to send estimation request.';
      Alert.alert('Request failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRequest) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>✓</Text>
          </View>
          <Text style={{ marginTop: 24, fontSize: 24, fontWeight: '900', color: '#0F172A' }}>Request sent</Text>
          <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center', fontWeight: '600' }}>
            {business?.name || 'The lab'} received your estimation request with the selected products and services.
          </Text>
          <View style={{ width: '100%', marginTop: 24, backgroundColor: '#FFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>Request Code</Text>
              <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '900' }}>{submittedRequest.code}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>Items</Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '800' }}>{submittedRequest.itemCount}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ marginTop: 28, height: 54, width: '100%', borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
            // onPress={() => navigation.reset({ index: 0, routes: [{ name: Routes.StudentNavigation }] })}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF' }}>Back to labs</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>Finalize Request</Text>
        <View style={{ width: 44 }} />
      </View>

      {!business || items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Your lab cart is empty</Text>
          <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center' }}>
            Add products or services from a single lab, then come back here to send the estimation request.
          </Text>
          <TouchableOpacity
            style={{ marginTop: 24, height: 50, paddingHorizontal: 24, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Go back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
            <View style={{ backgroundColor: '#0F172A', borderRadius: 24, padding: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>Lab Cart</Text>
              <Text style={{ marginTop: 8, fontSize: 24, fontWeight: '900', color: '#FFF' }}>{business.name}</Text>
              <Text style={{ marginTop: 6, fontSize: 14, lineHeight: 22, color: '#CBD5E1', fontWeight: '600' }}>
                Review your selected products and services, then send one estimation request to this lab.
              </Text>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Selected items</Text>
              <View style={{ marginTop: 16, gap: 14 }}>
                {items.map((item: any) => (
                  <View key={item.productId} style={{ borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 18, padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A' }}>{item.name}</Text>
                        <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'capitalize' }}>
                          {item.productType}{item.unit ? ` • ${item.unit}` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => business && removeItem(business.id, item.productId)}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#EF4444' }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 4 }}>
                        <TouchableOpacity pressGuardMode="off" style={{ width: 36, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => business && updateQuantity(business.id, item.productId, item.quantity - 1)}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ width: 28, textAlign: 'center', fontSize: 15, fontWeight: '800', color: '#0F172A' }}>{item.quantity}</Text>
                        <TouchableOpacity pressGuardMode="off" style={{ width: 36, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => business && updateQuantity(business.id, item.productId, item.quantity + 1)}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>+</Text>
                        </TouchableOpacity>
                      </View>
                      {/* <Text style={{ fontSize: 15, fontWeight: '900', color: '#137FEC' }}>{formatPrice(item.price * item.quantity)}</Text> */}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Contact details</Text>
              <View style={{ marginTop: 16, gap: 14 }}>
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A' }}
                  placeholder="Campus address or preferred delivery point"
                  placeholderTextColor="#94A3B8"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A' }}
                  placeholder="Department or faculty"
                  placeholderTextColor="#94A3B8"
                  value={department}
                  onChangeText={setDepartment}
                />
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A' }}
                  placeholder="Phone number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <TextInput
                  style={{ minHeight: 120, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingTop: 16, color: '#0F172A', textAlignVertical: 'top' }}
                  placeholder="Add experiment context, specs, preferred timeline, or anything the lab should know"
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Request recap</Text>
              <View style={{ marginTop: 16, gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Total items</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{itemCount}</Text>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>Estimated value</Text>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#137FEC' }}>{formatPrice(estimatedTotal)}</Text>
                </View> */}
              </View>
            </View>
          </ScrollView>

          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20 }}>
            <TouchableOpacity
              style={{ height: 56, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, opacity: submitting ? 0.8 : 1 }}
              onPress={submitRequest}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator size="small" color="#FFF" /> : null}
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>{submitting ? 'Sending request...' : 'Send estimation request'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}
