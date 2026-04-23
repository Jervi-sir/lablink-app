import { Routes } from '@/utils/routes';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/utils/api/axios-instance';
import { useNavigation } from '@react-navigation/native';
import { Order, OrderStatus } from '../../m2/OrdersScreen';
import { ChevronLeft, Inbox, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react-native';

function getStatusInfo(status: OrderStatus) {
  switch (status) {
    case 'request_estimation':
      return { text: 'طلب تسعير جديد', tone: 'bg-amber-50 text-amber-700', icon: <Clock size={14} color="#b45309" /> };
    case 'estimation_provided':
      return { text: 'تم تقديم السعر', tone: 'bg-blue-50 text-blue-700', icon: <Clock size={14} color="#1d4ed8" /> };
    case 'confirmed':
      return { text: 'طلب مؤكد', tone: 'bg-indigo-50 text-indigo-700', icon: <CheckCircle2 size={14} color="#4338ca" /> };
    case 'rejected':
      return { text: 'مرفوض', tone: 'bg-rose-50 text-rose-700', icon: <XCircle size={14} color="#be123c" /> };
    case 'completed':
      return { text: 'مكتمل', tone: 'bg-green-50 text-green-700', icon: <CheckCircle2 size={14} color="#15803d" /> };
    default:
      return { text: 'غير معروف', tone: 'bg-slate-50 text-slate-600', icon: <AlertCircle size={14} color="#475569" /> };
  }
}

export const LabOrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'confirmed'>('requests');

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const fetchOrders = async (tab: string) => {
    setLoading(true);
    try {
      const response: any = await api.get('/lab/orders', {
        params: { tab }
      });
      if (response.status === 'success') {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching lab orders:', error);
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
    const studentName = order.student?.student?.full_name || 'طالب غير معروف';
    const studentIcon = order.student?.student?.icon || '👨‍🎓';

    return (
      <Pressable
        key={order.id}
        className="mb-4 rounded-[28px] bg-white p-5 shadow-sm border border-slate-100"
        onPress={() => {
          // We will create a LabOrderDetailScreen later
          navigation.navigate(Routes.LabOrderDetailScreen, { orderId: order.id });
        }}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.95 : 1,
        })}>
        <View className="flex-row-reverse items-start gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Text className="text-3xl">{studentIcon}</Text>
          </View>

          <View className="flex-1">
            <View className="flex-row-reverse items-center justify-between">
              <Text className="text-right text-lg font-bold text-slate-800">
                {studentName}
              </Text>
              <Text className="text-[10px] text-slate-400 font-medium">{order.created_at.split('T')[0]}</Text>
            </View>

            <View className="mb-3 mt-1 gap-1 flex-row-reverse flex-wrap">
              {order.items.slice(0, 2).map((item, idx) => (
                <Text key={item.id} className="text-right text-xs text-slate-500">
                  {item.product.name_ar}{idx < Math.min(order.items.length, 2) - 1 ? ' • ' : ''}
                </Text>
              ))}
              {order.items.length > 2 && (
                <Text className="text-xs text-slate-400"> + {order.items.length - 2} عناصر أخرى</Text>
              )}
            </View>

            <View className="flex-row-reverse items-center justify-between">
              <View
                className={`flex-row-reverse items-center gap-1.5 rounded-full px-3 py-1 ${statusInfo.tone}`}>
                {statusInfo.icon}
                <Text className="text-[10px] font-bold">{statusInfo.text}</Text>
              </View>
              {order.total_price && (
                <Text className="text-sm font-bold text-teal-600">{order.total_price} DA</Text>
              )}
            </View>
          </View>
        </View>

        {order.status === 'request_estimation' && (
          <View className="mt-4 border-t border-slate-50 pt-4">
            <View className="flex-row-reverse gap-2">
              <Pressable
                className="flex-1 rounded-xl bg-blue-600 py-2.5 items-center justify-center"
                onPress={() => navigation.navigate(Routes.LabOrderDetailScreen, { orderId: order.id })}
              >
                <Text className="text-xs font-bold text-white">تقديم عرض سعر</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="bg-white px-6 pb-6 pt-5 border-b border-slate-100">
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-right text-2xl font-black text-slate-900">إدارة الطلبات</Text>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-50">
            <Inbox size={20} color="#64748b" />
          </View>
        </View>
        <Text className="mt-1 text-right text-xs text-slate-500">تابع طلبات العملاء وقدم عروض الأسعار</Text>
      </View>

      {/* Tab Bar */}
      <View className="mx-6 mt-6 flex-row-reverse rounded-2xl bg-slate-200 p-1">
        <Pressable
          onPress={() => setActiveTab('requests')}
          className={`flex-1 rounded-xl py-3 items-center`}
          style={{ backgroundColor: activeTab === 'requests' ? 'white' : 'transparent' }}
        >
          <Text className={`text-xs font-bold ${activeTab === 'requests' ? 'text-blue-700' : 'text-slate-500'}`}>
            طلبات التسعير
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('confirmed')}
          className={`flex-1 rounded-xl py-3 items-center`}
          style={{ backgroundColor: activeTab === 'confirmed' ? 'white' : 'transparent' }}
        >
          <Text className={`text-xs font-bold ${activeTab === 'confirmed' ? 'text-blue-700' : 'text-slate-500'}`}>
            الطلبات والتعاقدات
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-10 pt-6"
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
            <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Inbox size={40} color="#cbd5e1" />
            </View>
            <Text className="text-center text-lg font-bold text-slate-400">لا توجد طلبات حالياً</Text>
            <Text className="text-center text-xs text-slate-400 mt-2">ستظهر الطلبات الجديدة هنا فور وصولها</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
