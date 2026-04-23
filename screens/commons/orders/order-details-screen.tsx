import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Order } from './orders-screen';
import { ChevronRight, Package, Calendar, FileText, Info } from 'lucide-react-native';

import { Routes } from '@/utils/routes';

export const OrderDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { order } = route.params as { order: Order };

  if (!order) return null;

  const handleProductClick = (item: any) => {
    // Map OrderItem to Product interface expected by ProductDetailsScreen
    const product = {
      id: item.id,
      name: item.product.name_ar,
      image: item.product.image_url || '📦',
      price: item.price || '0 DA',
      supplierName: order.lab.lab.brand_name,
      supplierIcon: order.lab.lab.icon || '🔬',
      description: 'وصف المنتج المطلوب من المخبر.',
      specifications: [
        { label: 'الكمية المطلوبة', value: `${item.quantity}` },
      ],
      inStock: true,
      deliveryTime: '3-5 أيام',
      warranty: 'سنة واحدة',
    };
    navigation.navigate(Routes.ProductDetailsScreen, { product });
  };

  const handleLabClick = () => {
    // Map Lab info to Supplier interface expected by ServiceDetailsScreen
    const supplier = {
      id: order.lab_id,
      name: order.lab.lab.brand_name,
      description: 'مخبر متخصص في التحاليل والخدمات المخبرية.',
      icon: order.lab.lab.icon || '🔬',
      color: '#0f172a',
    };
    navigation.navigate(Routes.ServiceDetailsScreen, { supplier });
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'request_estimation':
        return { text: 'طلب تسعير', tone: 'bg-slate-100 text-slate-700', icon: '📝' };
      case 'estimation_provided':
        return { text: 'تم التسعير', tone: 'bg-orange-100 text-orange-700', icon: '🕒' };
      case 'confirmed':
        return { text: 'طلب مؤكد', tone: 'bg-blue-100 text-blue-700', icon: '📄' };
      case 'rejected':
        return { text: 'مرفوض', tone: 'bg-rose-100 text-rose-700', icon: '❌' };
      case 'completed':
        return { text: 'مكتمل', tone: 'bg-green-100 text-green-700', icon: '✅' };
      default:
        return { text: 'غير معروف', tone: 'bg-slate-100 text-slate-700', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="bg-white shadow-sm">
        <View className="flex-row-reverse items-center justify-between px-6 py-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
          >
            <ChevronRight size={24} color="#1e293b" />
          </Pressable>
          <Text className="text-xl font-bold text-slate-800">تفاصيل الطلب</Text>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-8 pb-12"
        showsVerticalScrollIndicator={false}
      >
        {/* Lab Info Card */}
        <Pressable
          onPress={handleLabClick}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          className="mb-6 overflow-hidden rounded-[32px] bg-white p-6 shadow-sm border border-slate-100"
        >
          <View className="flex-row-reverse items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
              <Text className="text-3xl">{order.lab.lab.icon || '🔬'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-right text-xl font-bold text-slate-900">{order.lab.lab.brand_name}</Text>
              <View className="mt-1 flex-row-reverse items-center gap-1">
                <Calendar size={14} color="#64748b" />
                <Text className="text-right text-sm text-slate-500">{order.created_at.split('T')[0]}</Text>
              </View>
            </View>
          </View>

          <View className="mt-6 flex-row-reverse items-center justify-between border-t border-slate-50 pt-4">
            <Text className="text-sm text-slate-500">حالة الطلب</Text>
            <View className={`flex-row-reverse items-center gap-2 rounded-full px-4 py-1.5 ${statusInfo.tone}`}>
              <Text className="text-xs">{statusInfo.icon}</Text>
              <Text className="text-xs font-bold">{statusInfo.text}</Text>
            </View>
          </View>
        </Pressable>

        {/* Items List */}
        <View className="mb-6">
          <View className="mb-4 flex-row-reverse items-center gap-2">
            <Package size={20} color="#0f172a" />
            <Text className="text-right text-lg font-bold text-slate-800">العناصر المطلوبة</Text>
          </View>

          {order.items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleProductClick(item)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              })}
              className="mb-3 flex-row-reverse items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-50"
            >
              <View className="flex-row-reverse items-center gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                  <Text className="text-2xl">{item.product.image_url || '📦'}</Text>
                </View>
                <View>
                  <Text className="text-right font-bold text-slate-800">{item.product.name_ar}</Text>
                  <Text className="text-right text-xs text-slate-500">الكمية: {item.quantity}</Text>
                </View>
              </View>
              {item.price && (
                <View className="items-end">
                  <Text className="text-xs text-slate-400">السعر</Text>
                  <Text className="font-bold text-teal-600">{item.price} DA</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Notes Section */}
        {order.notes && (
          <View className="mb-6">
            <View className="mb-4 flex-row-reverse items-center gap-2">
              <FileText size={20} color="#0f172a" />
              <Text className="text-right text-lg font-bold text-slate-800">ملاحظات إضافية</Text>
            </View>
            <View className="rounded-[24px] bg-amber-50 p-5 border border-amber-100">
              <Text className="text-right text-sm leading-6 text-amber-900">{order.notes}</Text>
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        {order.total_price && (
          <View className="mt-4 rounded-[32px] bg-slate-900 p-8">
            <View className="flex-row-reverse items-center justify-between mb-4">
              <Text className="text-slate-400">المجموع الفرعي</Text>
              <Text className="font-bold text-white">{order.total_price} DA</Text>
            </View>
            <View className="h-[1px] bg-slate-800 mb-4" />
            <View className="flex-row-reverse items-center justify-between">
              <Text className="text-lg font-bold text-white">إجمالي السعر</Text>
              <View>
                <Text className="text-2xl font-black text-teal-400">{order.total_price} DA</Text>
              </View>
            </View>
          </View>
        )}

        {/* Info Box */}
        <View className="mt-8 flex-row-reverse items-start gap-3 rounded-2xl bg-blue-50 p-4 border border-blue-100">
          <Info size={20} color="#2563eb" />
          <Text className="flex-1 text-right text-xs leading-5 text-blue-700">
            يمكنك متابعة حالة الطلب من هنا. سيتم إشعارك فور قيام المخبر بتحديث الحالة أو تقديم عرض سعر جديد.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
