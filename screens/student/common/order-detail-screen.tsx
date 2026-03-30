import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import moment from "moment";

const { width } = Dimensions.get('window');

const getTrackingSteps = (rawOrder: any) => {
  const s = (rawOrder?.status?.code || 'pending').toLowerCase();
  
  const steps = [
    { id: 1, title: 'Order Submitted', date: moment(rawOrder?.created_at).format('MMM D, hh:mm A'), completed: true },
    { id: 2, title: 'Confirmed', date: ['pending'].includes(s) ? 'Pending' : 'Completed', completed: !['pending'].includes(s) },
    { id: 3, title: 'Processing', date: ['processing', 'shipped', 'delivered', 'completed'].includes(s) ? 'Completed' : 'Pending', completed: ['processing', 'shipped', 'delivered', 'completed'].includes(s) },
    { id: 4, title: 'Shipped', date: ['shipped', 'delivered', 'completed'].includes(s) ? 'Completed' : 'Pending', completed: ['shipped', 'delivered', 'completed'].includes(s) },
    { id: 5, title: 'Delivered', date: ['delivered', 'completed'].includes(s) ? 'Completed' : 'Pending', completed: ['delivered', 'completed'].includes(s) },
  ];

  if (s === 'cancelled') {
    steps.push({ id: 6, title: 'Cancelled', date: 'Order Cancelled', completed: true });
  }

  return steps;
};

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

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isFocused = useIsFocused();

  const rawOrder = orderDetails || order.original || order;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const targetId = order.original?.id || order.id || order.code;
      if (!targetId || typeof targetId === 'string' && targetId.includes('ORD-')) return;

      setIsLoading(true);
      try {
        const response = await api.get(`${ApiRoutes.orders.index}/${targetId}`);
        setOrderDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchOrderDetails();
    }
  }, [order.id, isFocused]);
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
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{rawOrder?.code || 'Order Details'}</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading && !orderDetails ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: paddingHorizontal, gap: 16 }}>
        {/* Status Stepper */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Tracking Status</Text>
          <View style={{ paddingLeft: 10 }}>
            {getTrackingSteps(rawOrder).map((step, index, array) => (
              <View key={step.id} style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={[
                    { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
                    step.completed ? { backgroundColor: '#10B981', borderColor: '#10B981' } : { backgroundColor: '#FFF', borderColor: '#E2E8F0' }
                  ]}>
                    {step.completed && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>}
                  </View>
                  {index < array.length - 1 && (
                    <View style={[
                      { width: 2, flex: 1, marginVertical: 4 },
                      step.completed && array[index + 1].completed ? { backgroundColor: '#10B981' } : { backgroundColor: '#E2E8F0' }
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
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Items Ordered ({rawOrder.products?.length || 0})</Text>
          <View style={{ gap: 16 }}>
            {rawOrder.products?.map((product: any, index: number) => (
              <View key={product.id} style={{ flexDirection: 'row', gap: 16, borderBottomWidth: index === rawOrder.products.length - 1 ? 0 : 1, borderBottomColor: '#F1F5F9', paddingBottom: index === rawOrder.products.length - 1 ? 0 : 16 }}>
                <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    {product.images?.[0]?.url ? (
                        <Image source={{ uri: product.images[0].url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 32 }}>📦</Text>
                        </View>
                    )}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{product.business?.name}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{product.name}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '800' }}>Qty: {product.pivot?.quantity || 1}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#111' }}>{(product.pivot?.price || product.price).toLocaleString()} DA</Text>
                  </View>
                </View>
              </View>
            )) || (
              <Text style={{ color: '#94A3B8' }}>No items found</Text>
            )}
          </View>
        </View>

        {/* Delivery Information */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 }}>Delivery Details</Text>
          <View style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Address</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{rawOrder?.shipping_address || 'N/A'}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Department</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{rawOrder?.department || 'N/A'}</Text>
            </View>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Handling</Text>
              <View style={{ alignSelf: 'flex-start', backgroundColor: rawOrder?.is_hazmat ? '#FEF2F2' : '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: rawOrder?.is_hazmat ? '#EF4444' : '#16A34A' }}>
                  {rawOrder?.is_hazmat ? 'HAZMAT HANDLING' : 'STANDARD HANDLING'}
                </Text>
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
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
                {(rawOrder.total_price - (rawOrder.shipping_fee || 0) - (rawOrder.tax || 0)).toLocaleString()} DA
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Shipping Fee</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{(rawOrder.shipping_fee || 0).toLocaleString()} DA</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Tax (VAT 19%)</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{(rawOrder.tax || 0).toLocaleString()} DA</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>Total Paid</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>{rawOrder?.total_price?.toLocaleString()} DA</Text>
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
      )}
    </ScreenWrapper>
  );
}

