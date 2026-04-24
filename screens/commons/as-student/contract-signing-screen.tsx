import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  onBack,
  onSign,
  order = defaultOrder,
}: ContractSigningScreenProps) {
  const [hasSigned, setHasSigned] = useState(false);

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
              <Text className="text-3xl">{order.labIcon}</Text>
            </View>
            <View>
              <Text className="text-right text-lg font-bold text-slate-800">{order.labName}</Text>
              <Text className="mt-1 text-right text-sm text-slate-500">{order.date}</Text>
            </View>
          </View>

          <Text className="mb-3 text-right text-sm font-medium text-slate-700">
            الخدمات المحجوزة:
          </Text>
          <View className="gap-2">
            {order.services.map((service) => (
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
          className={`rounded-[22px] px-5 py-4 ${hasSigned ? 'bg-blue-700' : 'bg-slate-200'}`}
          disabled={!hasSigned}
          onPress={onSign}
          style={({ pressed }) => ({
            transform: [{ scale: pressed && hasSigned ? 0.98 : 1 }],
            opacity: pressed && hasSigned ? 0.92 : 1,
          })}>
          <Text
            className={`text-center text-lg font-bold ${hasSigned ? 'text-white' : 'text-slate-400'}`}>
            تأكيد التوقيع
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
