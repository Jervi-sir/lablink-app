import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { PanResponder, Pressable, ScrollView, Text, View, Alert, ActivityIndicator, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { Routes } from '@/utils/routes';

type OrderStatus = 'pending' | 'signed' | 'completed';

interface Order {
  id: number;
  labName: string;
  labIcon: string;
  services: string[];
  status: OrderStatus;
  date: string;
}

interface ContractSigningScreenProps {
  onBack?: () => void;
  onSign?: () => void;
  order?: Order;
}

const defaultOrder: Order = {
  id: 1,
  labName: 'مخبر بيولاب',
  labIcon: '🔬',
  services: ['حاضنة (Incubator)', 'جهاز PCR'],
  status: 'pending',
  date: '2026-04-01',
};

function SignaturePad({
  onSignedChange,
  onBeginDrawing,
  onEndDrawing,
}: {
  onSignedChange: (signed: boolean) => void;
  onBeginDrawing?: () => void;
  onEndDrawing?: () => void;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef('');

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          onBeginDrawing?.();
          const { locationX, locationY } = event.nativeEvent;
          currentPath.current = `M ${locationX} ${locationY}`;
          setPaths((current) => [...current, currentPath.current]);
          onSignedChange(true);
        },
        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          currentPath.current = `${currentPath.current} L ${locationX} ${locationY}`;
          setPaths((current) => {
            const next = [...current];
            next[next.length - 1] = currentPath.current;
            return next;
          });
        },
        onPanResponderRelease: () => {
          onEndDrawing?.();
        },
        onPanResponderTerminate: () => {
          onEndDrawing?.();
        },
      }),
    [onSignedChange, onBeginDrawing, onEndDrawing]
  );

  return (
    <View>
      <View
        className="overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50"
        {...panResponder.panHandlers}>
        <View className="h-[200px] w-full">
          <Svg height="100%" width="100%">
            {paths.map((path, index) => (
              <Path
                key={`${path}-${index}`}
                d={path}
                fill="none"
                stroke="#1d4ed8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
              />
            ))}
          </Svg>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        className="mt-3 self-end"
        onPress={() => {
          setPaths([]);
          currentPath.current = '';
          onSignedChange(false);
        }}>
        <Text className="text-sm font-medium text-red-600">مسح التوقيع</Text>
      </Pressable>
    </View>
  );
}

export function ContractSigningScreen({
  onBack: propsOnBack,
  onSign: propsOnSign,
}: ContractSigningScreenProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { orderId, onRefresh } = route.params as { orderId: number, onRefresh?: () => void };

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`/orders/${orderId}`);
      if (response.status === 'success') {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('خطأ', 'تعذر تحميل بيانات العقد');
    } finally {
      setLoading(false);
    }
  };

  const onBack = propsOnBack || (() => navigation.goBack());

  const handleSign = async () => {
    if (!hasSigned) return;

    setSubmitting(true);
    try {
      const response: any = await api.post(`/orders/${orderId}/signature`);
      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم توقيع العقد وتأكيد الطلب بنجاح', [
          {
            text: 'حسناً',
            onPress: () => {
              onRefresh?.();
              navigation.goBack();
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء محاولة التوقيع');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text className="mt-4 text-slate-500 text-base">جاري تحميل بيانات العقد...</Text>
      </SafeAreaView>
    );
  }

  if (!order) return null;

  const labName = order.lab?.lab?.brand_name || 'مخبر غير معروف';
  const labIcon = order.lab?.lab?.icon || '🔬';
  const orderNotes = order.notes;
  const orderDate = order.created_at.split('T')[0];
  const orderItems = order.items;
  const totalPrice = order.total_price;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-blue-700 px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          className="mb-5 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2"
          onPress={onBack}>
          <Text className="text-base font-medium text-white">رجوع</Text>
        </Pressable>

        <Text className="text-right text-3xl font-bold text-white">توقيع العقد</Text>
        <Text className="mt-2 text-right text-sm text-blue-100">وقع لتأكيد حجز الخدمات</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-6 pb-10 pt-6"
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}>
        <View
          className="rounded-[24px] bg-white px-5 py-5"
          style={{
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
          }}>
          <View className="mb-4 flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 overflow-hidden border border-teal-100">
              {labIcon && labIcon.startsWith('http') ? (
                <Image source={{ uri: labIcon }} className="h-full w-full" />
              ) : (
                <Text className="text-3xl">{labIcon}</Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-right text-xl font-bold text-slate-900">{labName}</Text>
              <View className="mt-1 flex-row items-center justify-end gap-1">
                <Text className="text-right text-sm text-slate-500">{orderDate}</Text>
                <Text className="text-slate-400">📅</Text>
              </View>
            </View>
          </View>

          <Text className="mb-4 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
            الخدمات المحجوزة
          </Text>
          <View className="gap-3">
            {orderItems.map((item: any) => (
              <View key={item.id} className="flex-row items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-100">
                    <Text className="text-xl">{item.product.image_url || '📦'}</Text>
                  </View>
                  <View>
                    <Text className="text-right text-sm font-bold text-slate-800">{item.product.name_ar}</Text>
                    <Text className="text-right text-[10px] text-slate-500">الكمية: {item.quantity}</Text>
                  </View>
                </View>
                {item.price && (
                  <Text className="text-sm font-bold text-teal-600">{item.price} DA</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {totalPrice && (
          <View
            className="rounded-[32px] bg-slate-900 p-6 shadow-xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 8,
            }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-400 text-sm">المجموع الفرعي</Text>
              <Text className="font-bold text-white">{totalPrice} DA</Text>
            </View>
            <View className="h-[1px] bg-slate-800 mb-4" />
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-medium text-teal-400 mb-1">الإجمالي المستحق</Text>
                <Text className="text-2xl font-black text-white">{totalPrice} DA</Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                <Text className="text-xl">💰</Text>
              </View>
            </View>
          </View>
        )}


        {orderNotes && (
          <View className="mb-2">
            <Text className="mb-3 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">ملاحظات إضافية</Text>
            <View className="rounded-[24px] bg-amber-50 p-5 border border-amber-100 shadow-sm">
              <Text className="text-right text-sm leading-6 text-amber-900">{orderNotes}</Text>
            </View>
          </View>
        )}

        <View
          className="rounded-[24px] bg-white px-5 py-5"
          style={{
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
          }}>
          <View className="mb-3 flex-row items-center justify-end gap-2">
            <Text className="text-lg font-bold text-slate-800">نص العقد</Text>
            <Text className="text-blue-600 text-xl">📄</Text>
          </View>

          <View className="max-h-56 gap-2">
            <Text className="text-right text-sm leading-7 text-slate-700">
              بموجب هذا العقد، يوافق الطرف الأول (المخبر) على تقديم الخدمات المخبرية المتفق عليها
              للطرف الثاني (العميل).
            </Text>
            <Text className="text-right text-sm font-bold leading-7 text-slate-800">
              الشروط والأحكام:
            </Text>
            <Text className="text-right text-sm leading-7 text-slate-700">
              • يجب إجراء جميع التجارب داخل المختبر فقط
            </Text>
            <Text className="text-right text-sm leading-7 text-slate-700">
              • المبلغ المستحق يحدد بعد قبول الطلب ويذكر في العقد
            </Text>
            <Text className="text-right text-sm leading-7 text-slate-700">
              • يلتزم العميل بقواعد السلامة المخبرية
            </Text>
            <Text className="text-right text-sm leading-7 text-slate-700">
              • مدة العقد تحدد حسب نوع الخدمة المطلوبة
            </Text>
            <Text className="text-right text-sm leading-7 text-slate-700">
              • يحق للمخبر إلغاء الحجز في حالة عدم الالتزام بالشروط
            </Text>
            <Text className="pt-2 text-right text-sm leading-7 text-slate-700">
              بالتوقيع أدناه، أقر بأنني قرأت وفهمت جميع الشروط والأحكام المذكورة أعلاه وأوافق عليها.
            </Text>
          </View>
        </View>

        <View
          className="rounded-[24px] bg-white px-5 py-5"
          style={{
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 14,
            elevation: 3,
          }}>
          <Text className="mb-3 text-right text-lg font-bold text-slate-800">التوقيع</Text>
          <SignaturePad
            onBeginDrawing={() => setScrollEnabled(false)}
            onEndDrawing={() => setScrollEnabled(true)}
            onSignedChange={setHasSigned}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          className={`rounded-[22px] px-5 py-4 ${hasSigned && !submitting ? 'bg-blue-700' : 'bg-slate-200'}`}
          disabled={!hasSigned || submitting}
          onPress={handleSign}
          style={({ pressed }) => ({
            transform: [{ scale: pressed && hasSigned && !submitting ? 0.98 : 1 }],
            opacity: pressed && hasSigned && !submitting ? 0.92 : 1,
          })}>
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className={`text-center text-lg font-bold ${hasSigned ? 'text-white' : 'text-slate-400'}`}>
              تأكيد التوقيع والموافقة
            </Text>
          )}
        </Pressable>

        <View className="flex-row items-start gap-3 rounded-2xl bg-blue-50 p-4 border border-blue-100 mb-4">
          <Text className="flex-1 text-right text-xs leading-5 text-blue-700">
            بتوقيعك على هذا العقد، فإنك توافق على الشروط المذكورة أعلاه وتلتزم بدفع المبلغ المحدد عند إتمام الخدمة.
          </Text>
          <Text className="text-blue-600">ℹ️</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
