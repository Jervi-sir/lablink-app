import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";

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

  const [isMessaging, setIsMessaging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fallback to extract the raw order properties
  const rawOrder = order.original || order;
  const businessUserId = rawOrder?.products?.[0]?.business?.user_id;

  const handleMessageVendor = async () => {
    if (!businessUserId) {
      Alert.alert("Error", "Could not identify the business user to start a chat.");
      return;
    }

    setIsMessaging(true);
    try {
      const response = await api.post(ApiRoutes.conversations.store, {
        target_user_id: businessUserId
      });
      const conversation = response?.data;

      if (conversation) {
        navigation.navigate(Routes.ChatDetailScreen, { conversation });
      } else {
        Alert.alert("Error", "Failed to resolve conversation.");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      Alert.alert("Error", "Failed to message vendor. Please try again.");
    } finally {
      setIsMessaging(false);
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    // Simulating invoice download
    setTimeout(() => {
      setIsDownloading(false);
      Alert.alert("Success", "Invoice downloaded successfully!");
    }, 1500);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Order #{order.id}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}>

        {/* Status Stepper */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Tracking Status</Text>
          <View style={{ paddingLeft: 10 }}>
            {TRACKING_STEPS.map((step, index) => (
              <View key={step.id} style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={[
                    { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
                    step.completed ? { backgroundColor: '#10B981', borderColor: '#10B981' } : { backgroundColor: '#FFF', borderColor: '#E2E8F0' }
                  ]}>
                    {step.completed && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>}
                  </View>
                  {index < TRACKING_STEPS.length - 1 && (
                    <View style={[
                      { width: 2, flex: 1, marginVertical: 4 },
                      step.completed && TRACKING_STEPS[index + 1].completed ? { backgroundColor: '#10B981' } : { backgroundColor: '#E2E8F0' }
                    ]} />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: 24 }}>
                  <Text style={[{ fontSize: 15, fontWeight: '700', color: '#1E293B' }, !step.completed && { color: '#94A3B8' }]}>{step.title}</Text>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Items Ordered</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ width: 90, height: 90, borderRadius: 16, backgroundColor: '#F1F5F9' }} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{order.lab}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{order.product}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4 }}>Qty: 1</Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#111', marginTop: 4 }}>{order.price}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Delivery Details</Text>
          <View style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Address</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>Building B, Room 302, University Campus</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Department</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>Biological Sciences Faculty</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Handling</Text>
              <View style={{ alignSelf: 'flex-start', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#16A34A' }}>STANDARD HANDLING</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Cost Summary</Text>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{order.price}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Shipping Fee</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>800 DA</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Tax (VAT 19%)</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>8,550 DA</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Total Paid</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>54,350 DA</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            style={[{ flex: 1, height: 52, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }, isDownloading && { opacity: 0.7 }]}
            onPress={handleDownloadInvoice}
            disabled={isDownloading}
          >
            {isDownloading ? <ActivityIndicator size="small" color="#137FEC" /> : <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>Download Invoice</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ flex: 1.2, height: 52, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }, isMessaging && { opacity: 0.7 }]}
            onPress={handleMessageVendor}
            disabled={isMessaging}
          >
            {isMessaging ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>Message Vendor</Text>}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

