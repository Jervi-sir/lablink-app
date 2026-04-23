import { Routes } from '@/utils/routes';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { useNavigation } from '@react-navigation/native';

export type OrderStatus = 'request_estimation' | 'estimation_provided' | 'confirmed' | 'rejected' | 'completed';

export interface OrderItem {
  id: number;
  product: {
    name_ar: string;
    image_url: string;
  };
  quantity: number;
  price?: string;
}

export interface Order {
  id: number;
  lab_id: number;
  status: OrderStatus;
  total_price: string | null;
  notes: string | null;
  created_at: string;
  lab: {
    lab: {
      brand_name: string;
      icon?: string;
    };
  };
  items: OrderItem[];
}

interface OrdersScreenProps {
  onOrderClick?: (order: Order) => void;
  navigation: any;
}

function getStatusInfo(status: OrderStatus) {
  switch (status) {
    case 'request_estimation':
      return { text: 'طلب تسعير', tone: 'bg-slate-50 text-slate-600', icon: '📝' };
    case 'estimation_provided':
      return { text: 'تم التسعير', tone: 'bg-orange-50 text-orange-600', icon: '🕒' };
    case 'confirmed':
      return { text: 'طلب مؤكد', tone: 'bg-blue-50 text-blue-600', icon: '📄' };
    case 'rejected':
      return { text: 'مرفوض', tone: 'bg-rose-50 text-rose-600', icon: '❌' };
    case 'completed':
      return { text: 'مكتمل', tone: 'bg-green-50 text-green-600', icon: '✅' };
    default:
      return { text: 'غير معروف', tone: 'bg-slate-50 text-slate-600', icon: '❓' };
  }
}


function RatingModal({
  visible,
  targetName,
  targetIcon,
  onClose,
}: {
  visible: boolean;
  targetName: string;
  targetIcon: string;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const canSubmit = useMemo(() => rating > 0, [rating]);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-slate-950/45 px-6">
        <View className="w-full rounded-[28px] bg-white px-6 py-6">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-3xl">{targetIcon}</Text>
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-slate-900">تقييم المخبر</Text>
            <Text className="mt-1 text-center text-sm text-slate-500">{targetName}</Text>
          </View>

          <View className="mt-6 flex-row-reverse justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable key={value} onPress={() => setRating(value)}>
                <Text
                  className={`text-4xl ${value <= rating ? 'text-amber-400' : 'text-slate-300'}`}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            className="mt-6 min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-right text-base text-slate-900"
            multiline
            onChangeText={setComment}
            placeholder="أضف تعليقك حول جودة الخدمة"
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
            value={comment}
          />

          <View className="mt-6 flex-row-reverse gap-3">
            <Pressable
              className="flex-1 rounded-2xl bg-slate-200 px-4 py-4"
              onPress={() => {
                setRating(0);
                setComment('');
                onClose();
              }}>
              <Text className="text-center font-semibold text-slate-700">إلغاء</Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-2xl px-4 py-4 ${canSubmit ? 'bg-blue-600' : 'bg-blue-300'}`}
              disabled={!canSubmit}
              onPress={() => {
                setRating(0);
                setComment('');
                onClose();
              }}>
              <Text className="text-center font-semibold text-white">إرسال</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}


export const OrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'confirmed'>('requests');

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<{ name: string; icon: string } | null>(null);

  // Replace the tab switching handlers — use a single handler
  const handleTabChange = (tab: 'requests' | 'confirmed') => {
    if (tab === activeTab) return;
    setOrders([]); // clear stale data
    setActiveTab(tab);
  };

  // Add a useEffect that reacts to activeTab changes
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const fetchOrders = async (tab: string) => {
    setLoading(true);
    try {
      const response: any = await api.get(ApiRoutes.orders.index, {
        params: { tab }
      });
      if (response.status === 'success') {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(activeTab);
  };


  const renderOrder = (order: Order) => {
    const statusInfo = getStatusInfo(order.status);
    const labName = order.lab?.lab?.brand_name || 'مخبر غير معروف';
    const labIcon = order.lab?.lab?.icon || '🔬';

    return (
      <Pressable
        key={order.id}
        accessibilityRole="button"
        className="mb-4 rounded-[24px] bg-white px-5 py-5"
        onPress={() => {
          navigation.navigate(Routes.OrderDetailScreen, { order });
        }}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.95 : 1,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 14,
          elevation: 3,
        })}>
        <View className="flex-row-reverse items-start gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-xl bg-teal-600">
            <Text className="text-3xl">{labIcon}</Text>
          </View>

          <View className="flex-1">
            <Text className="text-right text-lg font-bold text-slate-800">
              {labName}
            </Text>

            <View className="mb-3 mt-2 gap-1 flex-row-reverse flex-wrap">
              {order.items.slice(0, 2).map((item, idx) => (
                <Text key={item.id} className="text-right text-xs text-slate-600">
                  {item.product.name_ar}{idx < Math.min(order.items.length, 2) - 1 ? ' • ' : ''}
                </Text>
              ))}
              {order.items.length > 2 && (
                <Text className="text-xs text-slate-400"> + {order.items.length - 2} عناصر أخرى</Text>
              )}
            </View>

            <View className="flex-row-reverse items-center justify-between">
              <View
                className={`flex-row-reverse items-center gap-2 rounded-lg px-3 py-1.5 ${statusInfo.tone}`}>
                <Text>{statusInfo.icon}</Text>
                <Text className="text-xs font-medium">{statusInfo.text}</Text>
              </View>
              <Text className="text-xs text-slate-400">{order.created_at.split('T')[0]}</Text>
            </View>
          </View>
        </View>

        {order.status === 'estimation_provided' && (
          <View className="mt-4 border-t border-slate-100 pt-4">
            <Pressable
              className="rounded-xl bg-blue-600 py-3 items-center"
              onPress={() => {
                navigation.navigate(Routes.ContractSigningScreen, { orderId: order.id });
              }}>
              <Text className="text-sm font-bold text-white">مراجعة التسعير والتوقيع</Text>
            </Pressable>
          </View>
        )}

        {order.status === 'completed' && (
          <View className="mt-4 border-t border-slate-100 pt-4">
            <Pressable
              className="rounded-xl bg-slate-100 py-3"
              onPress={() => {
                setSelectedLab({ name: labName, icon: labIcon });
                setShowRatingModal(true);
              }}>
              <View className="flex-row-reverse items-center justify-center gap-2">
                <Text className="text-slate-600">★</Text>
                <Text className="text-sm font-medium text-slate-700">تقييم التجربة</Text>
              </View>
            </Pressable>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="bg-blue-700 px-6 pb-6 pt-5">
        <Text className="text-right text-3xl font-bold text-white">قائمة الطلبات</Text>
        <Text className="mt-2 text-right text-sm text-blue-100">تابع حالة طلباتك وعقودك</Text>
      </View>

      {/* Tab Bar */}
      <View className="mx-6 mt-4 flex-row-reverse rounded-2xl bg-slate-200 p-1">
        <Pressable
          onPress={() => handleTabChange('requests')}
          className={`flex-1 rounded-xl py-3 items-center`}
          style={{ backgroundColor: activeTab === 'requests' ? 'white' : 'transparent' }}
        >
          <Text className={`font-bold ${activeTab === 'requests' ? 'text-blue-700' : 'text-slate-500'}`}>
            طلبات التسعير
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleTabChange('confirmed')}
          className={`flex-1 rounded-xl py-3 items-center`}
          style={{ backgroundColor: activeTab === 'confirmed' ? 'white' : 'transparent' }}
        >
          <Text className={`font-bold`}
            style={{ color: activeTab === 'confirmed' ? 'blue' : 'black' }}
          >
            الطلبات المؤكدة
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
      >
        {loading && !refreshing ? (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : orders.length > 0 ? (
          orders.map(renderOrder)
        ) : (
          <View className="mt-20 items-center justify-center px-10">
            <Text className="text-center text-lg font-bold text-slate-400">لا توجد طلبات حالياً</Text>
            <Text className="text-center text-sm text-slate-400 mt-2">ابدأ بطلب تسعير من المخبر الذي تختاره</Text>
          </View>
        )}
      </ScrollView>


      {selectedLab && (
        <RatingModal
          onClose={() => {
            setShowRatingModal(false);
            setSelectedLab(null);
          }}
          targetIcon={selectedLab.icon}
          targetName={selectedLab.name}
          visible={showRatingModal}
        />
      )}
    </SafeAreaView>
  );
}

