import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronRight, Package, Calendar, User, CreditCard, Send, CheckCircle } from 'lucide-react-native';
import api from '@/utils/api/axios-instance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order, OrderItem } from '@/screens/commons/orders/orders-screen';

export const LabOrderDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      const response: any = await api.get(`/lab/orders/${orderId}`);
      if (response.status === 'success') {
        setOrder(response.data);
        // Initialize prices from existing ones if available
        const initialPrices: { [key: number]: string } = {};
        response.data.items.forEach((item: OrderItem) => {
          if (item.price) {
            // item.price is now a number/decimal from DB
            initialPrices[item.id] = String(item.price);
          }
        });
        setPrices(initialPrices);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      Alert.alert('خطأ', 'فشل تحميل تفاصيل الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (itemId: number, value: string) => {
    setPrices(prev => ({ ...prev, [itemId]: value }));
  };

  const calculateTotal = () => {
    return Object.values(prices).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
  };

  const handleSubmitEstimation = async () => {
    const total = calculateTotal();
    if (total <= 0) {
      Alert.alert('تنبيه', 'يرجى إدخال أسعار صالحة للعناصر');
      return;
    }

    setSubmitting(true);
    try {
      const response: any = await api.post(`/lab/orders/${orderId}/status`, {
        status: 'estimation_provided',
        total_price: total,
        items: Object.entries(prices).map(([id, price]) => ({
          id: parseInt(id),
          price: parseFloat(price)
        }))
      });

      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم إرسال عرض السعر بنجاح');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting estimation:', error);
      Alert.alert('خطأ', 'فشل إرسال عرض السعر');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteOrder = async () => {
    setSubmitting(true);
    try {
      const response: any = await api.post(`/lab/orders/${orderId}/status`, {
        status: 'completed'
      });

      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم تحديث حالة الطلب إلى مكتمل');
        fetchOrderDetail();
      }
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestPrice = async () => {
    if (!suggestedPrice) return;
    setSubmitting(true);
    try {
      const response: any = await api.post(`/lab/orders/${orderId}/negotiate`, { suggested_price: suggestedPrice });
      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم إرسال اقتراح السعر بنجاح');
        setIsNegotiating(false);
        setSuggestedPrice('');
        fetchOrderDetail();
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء إرسال الاقتراح');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptPrice = async () => {
    const studentPrice = order?.negotiations?.filter((n:any) => n.suggested_by === 'student').pop()?.suggested_price;
    if (!studentPrice) return;
    setSubmitting(true);
    try {
      const response: any = await api.post(`/lab/orders/${orderId}/negotiate`, { suggested_price: studentPrice });
      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم قبول السعر بنجاح وتم إرساله للطالب للتأكيد');
        fetchOrderDetail();
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء إرسال السعر');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!order) return null;

  const isEstimationRequest = order.status === 'request_estimation';
  const isConfirmed = order.status === 'confirmed';

  return (
    <SafeAreaView className="flex-1 bg-slate-50" >
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
        >
          <ChevronRight size={24} color="#1e293b" />
        </Pressable>
        <Text className="text-xl font-bold text-slate-800">تفاصيل الطلب</Text>
        <View className="w-10" />
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={100}
        enableAutomaticScroll={true}
      >
        {/* Student Info Card */}
        <View className="mb-6 rounded-[32px] bg-white p-6 shadow-sm border border-slate-100">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Text className="text-3xl">{order.student?.student?.icon || '👨‍🎓'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-right text-xl font-bold text-slate-900">{order.student?.student?.full_name}</Text>
              <View className="mt-1 flex-row items-center gap-1">
                <Calendar size={14} color="#64748b" />
                <Text className="text-right text-sm text-slate-500">{order.created_at.split('T')[0]}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center gap-2">
            <Package size={20} color="#0f172a" />
            <Text className="text-right text-lg font-bold text-slate-800">العناصر المطلوبة</Text>
          </View>

          {order.items.map((item) => (
            <View key={item.id} className="mb-4 rounded-[24px] bg-white p-5 shadow-sm border border-slate-50">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                    {item.product.image_url && (item.product.image_url.startsWith('http') || item.product.image_url.startsWith('file')) ? (
                      <Image source={{ uri: item.product.image_url }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                      <Text className="text-xl">{item.product.image_url || '📦'}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="text-right font-bold text-slate-800">{item.product.name_ar}</Text>
                    <Text className="text-right text-xs text-slate-500">الكمية: {item.quantity}</Text>
                  </View>
                </View>
              </View>

              {isEstimationRequest ? (
                <View className="flex-row-reverse items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <Text className="text-sm font-bold text-slate-600">السعر المقترح:</Text>
                  <TextInput
                    className="flex-1 bg-white rounded-lg border border-slate-200 px-3 py-2 text-left font-bold text-teal-600"
                    keyboardType="numeric"
                    placeholder="0.00"
                    value={prices[item.id] || ''}
                    onChangeText={(val) => handlePriceChange(item.id, val)}
                  />
                  <Text className="text-xs font-bold text-slate-400">DA</Text>
                </View>
              ) : (
                item.price && (
                  <View className="flex-row items-center justify-between border-t border-slate-50 pt-3">
                    <Text className="text-sm text-slate-500">السعر المحدد</Text>
                    <Text className="font-bold text-teal-600">{item.price} DA</Text>
                  </View>
                )
              )}
            </View>
          ))}
        </View>

        {/* Notes */}
        {order.notes && (
          <View className="mb-6">
            <Text className="mb-2 text-right text-sm font-bold text-slate-700">ملاحظات الطالب:</Text>
            <View className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
              <Text className="text-right text-sm text-amber-800">{order.notes}</Text>
            </View>
          </View>
        )}

        {/* Negotiation History */}
        {order.negotiations && order.negotiations.length > 0 && (
          <View className="mb-6 px-2">
            <Text className="text-right text-lg font-bold text-slate-800 mb-3">تاريخ التفاوض</Text>
            {order.negotiations.map((neg: any) => (
              <View key={neg.id} className={`mb-3 rounded-2xl p-4 ${neg.suggested_by === 'lab' ? 'bg-indigo-50 border border-indigo-100 ml-8' : 'bg-orange-50 border border-orange-100 mr-8'}`}>
                <Text className="text-right text-xs text-slate-500 mb-1">
                  {neg.suggested_by === 'lab' ? 'اقتراحك' : 'اقتراح الطالب'}
                </Text>
                <Text className={`text-right font-bold text-lg ${neg.suggested_by === 'lab' ? 'text-indigo-700' : 'text-orange-700'}`}>
                  {neg.suggested_price} DA
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Negotiation Actions */}
        {order.status === 'student_negotiation' && (
          <View className="mb-6 rounded-[32px] bg-white p-6 shadow-sm border border-slate-100">
            <Text className="text-right text-lg font-bold text-slate-800 mb-4">اقتراح سعر جديد من الطالب</Text>
            <View className="flex-row gap-3">
              <Pressable
                className={`flex-1 rounded-xl bg-teal-600 py-3 items-center ${submitting ? 'opacity-50' : ''}`}
                onPress={handleAcceptPrice}
                disabled={submitting}
              >
                <Text className="text-sm font-bold text-white">قبول السعر</Text>
              </Pressable>
              
              {(!order.negotiations || order.negotiations.filter((n:any) => n.suggested_by === 'lab').length < 3) && (
                <Pressable
                  className="flex-1 rounded-xl bg-white border border-rose-500 py-3 items-center"
                  onPress={() => setIsNegotiating(!isNegotiating)}>
                  <Text className="text-sm font-bold text-rose-600">رفض واقتراح سعر</Text>
                </Pressable>
              )}
            </View>

            {isNegotiating && (
              <View className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Text className="text-right text-sm text-slate-700 mb-2 font-medium">أدخل السعر المقترح (DA):</Text>
                <TextInput
                  value={suggestedPrice}
                  onChangeText={setSuggestedPrice}
                  keyboardType="numeric"
                  placeholder="مثال: 15000"
                  className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-right text-base mb-3"
                />
                <Pressable
                  className={`rounded-xl bg-indigo-600 py-3 items-center ${submitting ? 'opacity-50' : ''}`}
                  onPress={handleSuggestPrice}
                  disabled={submitting}
                >
                  <Text className="text-sm font-bold text-white">إرسال الاقتراح</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Total Price Section */}
        {isEstimationRequest && (
          <View className="mt-4 rounded-[32px] bg-slate-900 p-8 shadow-xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">إجمالي العرض</Text>
              <Text className="text-2xl font-black text-teal-400">{calculateTotal().toLocaleString()} DA</Text>
            </View>
            <Pressable
              className={`mt-6 flex-row-reverse items-center justify-center gap-3 rounded-2xl py-4 ${submitting ? 'bg-slate-700' : 'bg-teal-500'}`}
              onPress={handleSubmitEstimation}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text className="font-bold text-white">إرسال عرض السعر</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {isConfirmed && (
          <View className="mt-4 rounded-[32px] bg-blue-600 p-8 shadow-xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">حالة الطلب: مؤكد</Text>
              <CheckCircle size={24} color="white" />
            </View>
            <Text className="text-right text-sm text-blue-100 mb-6 leading-5">
              تم تأكيد الطلب من قبل الطالب. يمكنك البدء في تنفيذ الخدمات المطلوبة وتحديث الحالة عند الانتهاء.
            </Text>
            <Pressable
              className={`flex-row items-center justify-center gap-3 rounded-2xl bg-white py-4 ${submitting ? 'opacity-50' : ''}`}
              onPress={handleCompleteOrder}
              disabled={submitting}
            >
              <CheckCircle size={20} color="#2563eb" />
              <Text className="text-lg font-bold text-blue-600">تحديث الحالة إلى مكتمل</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
