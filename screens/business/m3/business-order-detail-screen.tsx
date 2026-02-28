import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import moment from "moment";
import { paddingHorizontal } from "@/utils/variables/styles";

const { width } = Dimensions.get('window');

const TRACKING_STEPS_BASE = [
  { id: 1, code: 'pending', title: 'Order Received' },
  { id: 2, code: 'processing', title: 'Preparation' },
  { id: 3, code: 'ready', title: 'Quality Check & Ready' },
  { id: 4, code: 'done', title: 'Completed' },
];

export default function BusinessOrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order: initialOrder } = route.params || {};

  const [order, setOrder] = useState<any>(initialOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.orders.show, { id: order.id }));
      if (response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Alert.alert("Error", "Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  }, [order?.id]);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const advanceStage = async () => {
    if (isUpdating) return;

    const currentStatusId = order.order_status_id;
    if (currentStatusId >= 4) {
      Alert.alert("Completed", "This order is already completed.");
      return;
    }

    const nextStatusId = currentStatusId + 1;

    setIsUpdating(true);
    try {
      const response: any = await api.patch(buildRoute(ApiRoutes.orders.updateStatus, { id: order.id }), {
        order_status_id: nextStatusId
      });

      if (response.data) {
        setOrder(response.data);
        Alert.alert("Success", "Order advanced to next stage");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !order) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </ScreenWrapper>
    );
  }

  const steps = TRACKING_STEPS_BASE.map(step => {
    const isCompleted = order.order_status_id > step.id;
    const isCurrent = order.order_status_id === step.id;
    return {
      ...step,
      completed: isCompleted,
      current: isCurrent,
      date: isCompleted ? 'Completed' : (isCurrent ? 'Current Stage' : 'Pending')
    };
  });

  const studentName = order.user?.studentProfile?.fullname || order.student || 'Researcher';
  const subtotal = order.total_price - (order.shipping_fee || 0) - (order.tax || 0);

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      {/* Header */}
      <View style={{
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: paddingHorizontal,
      }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111' }}>Order Details</Text>
        <TouchableOpacity style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 10, paddingHorizontal: paddingHorizontal, paddingBottom: 150 }}>

        {/* 1. Order Summary Card */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 }}>ORDER ID</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111', marginTop: 2 }}>{order.code || order.id}</Text>
            </View>
            <View style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: '#8B5CF6', textTransform: 'uppercase' }}>{order.status?.code || 'Processing'}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            onPress={() => navigation.navigate(Routes.BusinessStudentProfileScreen, {
              user: order.user
            })}
          >
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#8B5CF6' }}>{studentName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{studentName}</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>
                {order.user?.studentProfile?.department?.university?.name || 'Researcher'}
              </Text>
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 18, color: '#94A3B8' }}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2. Order Timeline / Workflow */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Fulfillment Workflow</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          {steps.map((step, index) => (
            <View key={step.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <View style={{ alignItems: 'center', width: 24 }}>
                <View style={[
                  { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, backgroundColor: '#FFF' },
                  step.completed ? { backgroundColor: '#10B981', borderColor: '#10B981' } : (step.current ? { borderColor: '#8B5CF6', backgroundColor: '#FFF' } : { borderColor: '#E2E8F0', backgroundColor: '#FFF' })
                ]}>
                  {step.completed && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '900' }}>✓</Text>}
                </View>
                {index < steps.length - 1 && <View style={[{ width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 }, step.completed && steps[index + 1].completed && { backgroundColor: '#10B981' }]} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 24 }}>
                <Text style={[{ fontSize: 15, fontWeight: '700', color: '#111' }, !step.completed && !step.current && { color: '#94A3B8' }]}>{step.title}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{step.date}</Text>
              </View>
              {step.current && (
                <View style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: '800' }}>Current</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 3. Items & Pricing */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Items & Financials</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 }}>
          {order.products?.map((product: any) => (
            <TouchableOpacity
              key={product.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}
              onPress={() => navigation.navigate(Routes.BusinessProductDetailScreen, { product })}
            >
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>📦</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{product.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', marginTop: 2 }}>Quantity: {product.pivot?.quantity || 1} • View Details</Text>
                </View>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{(product.pivot?.price || product.price).toLocaleString()} DA</Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 }} />

          <View style={{ gap: 10, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>{subtotal.toLocaleString()} DA</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '500' }}>Tax (VAT 19%)</Text>
              <Text style={{ fontSize: 14, color: '#111', fontWeight: '700' }}>{(order.tax || 0).toLocaleString()} DA</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>Grand Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#8B5CF6' }}>{order.total_price?.toLocaleString()} DA</Text>
            </View>
          </View>
        </View>

        {/* 4. Delivery Address */}
        <Text style={{ fontSize: 14, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16, marginLeft: 4 }}>Shipping / Delivery Details</Text>
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 32 }}>
          <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>{order.shipping_address || 'University Address Provided'}</Text>
          {order.phone && <Text style={{ fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: '600' }}>Phone: {order.phone}</Text>}
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'flex-start' }}>
            <Text style={{ color: '#8B5CF6', fontSize: 14, fontWeight: '800' }}>View on Map</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Management Actions */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingHorizontal: paddingHorizontal, paddingBottom: Platform.OS === 'ios' ? 34 : 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.navigate(Routes.ChatDetailScreen, {
            user: order.user
          })}
        >
          <Text style={{ color: '#475569', fontSize: 15, fontWeight: '700' }}>Message Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1.5, height: 56, borderRadius: 16, backgroundColor: order.order_status_id >= 4 ? '#E2E8F0' : '#8B5CF6', justifyContent: 'center', alignItems: 'center' }}
          onPress={advanceStage}
          disabled={isUpdating || order.order_status_id >= 4}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800' }}>
              {order.order_status_id >= 4 ? 'Order Completed' : 'Advance to Next Stage'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

