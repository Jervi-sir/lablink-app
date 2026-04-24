import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { PanResponder, Pressable, ScrollView, Text, View, Alert, ActivityIndicator } from 'react-native';
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

function SignaturePad({ onSignedChange }: { onSignedChange: (signed: boolean) => void }) {
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef('');

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
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
      }),
    [onSignedChange]
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
  const orderDate = order.created_at.split('T')[0];
  const orderItems = order.items.map((item: any) => item.product.name_ar);

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
            <View className="h-16 w-16 items-center justify-center rounded-xl bg-teal-600">
              <Text className="text-3xl">{labIcon}</Text>
            </View>
            <View>
              <Text className="text-right text-lg font-bold text-slate-800">{labName}</Text>
              <Text className="mt-1 text-right text-sm text-slate-500">{orderDate}</Text>
            </View>
          </View>

          <Text className="mb-3 text-right text-sm font-medium text-slate-700">
            الخدمات المحجوزة:
          </Text>
          <View className="gap-2">
            {orderItems.map((service: string) => (
              <View key={service} className="flex-row items-center gap-2">
                <Text className="text-green-600">✓</Text>
                <Text className="text-right text-sm text-slate-600">{service}</Text>
              </View>
            ))}
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
          <View className="mb-3 flex-row items-center gap-2">
            <Text className="text-blue-600">📄</Text>
            <Text className="text-lg font-bold text-slate-800">نص العقد</Text>
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
          <SignaturePad onSignedChange={setHasSigned} />
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
              تأكيد التوقيع
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
