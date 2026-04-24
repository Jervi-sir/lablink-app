import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/CartContext';
import { Trash2, Send, ArrowLeft } from 'lucide-react-native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes, buildRoute } from '@/utils/api/api';

export function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, labId, getCartTotal, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleCreateOrder = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const payload = {
        lab_id: labId,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        notes: notes
      };

      // Ensure /orders is added to ApiRoutes if not there. Assuming ApiRoutes.orders.store exists.
      const response: any = await api.post(buildRoute(ApiRoutes.orders.index), payload);

      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم إرسال طلب عرض السعر إلى المخبر بنجاح.');
        clearCart();
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-xl font-bold text-slate-400">السلة فارغة</Text>
        <Pressable onPress={() => navigation.goBack()} className="mt-4 px-6 py-2 bg-teal-100 rounded-full">
          <Text className="text-teal-700 font-bold">العودة</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="bg-teal-600 px-6 pb-6 pt-6 shadow-lg rounded-b-3xl">
        <Pressable
          onPress={() => navigation.goBack()}
          className="mb-4 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2"
        >
          <ArrowLeft size={24} color="white" />
          <Text className="text-base font-bold text-white">رجوع</Text>
        </Pressable>
        <Text className="text-right text-2xl font-bold text-white">السلة</Text>
        <Text className="mt-1 text-right text-sm text-teal-100">
          مراجعة المنتجات والخدمات المطلوبة
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {items.map((item, index) => (
          <View key={index} className="mb-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-row items-center">
            <View className="h-16 w-16 bg-slate-50 rounded-xl items-center justify-center border border-slate-100 ml-4">
              <Text className="text-3xl">{item.product.image || '📦'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-right text-base font-bold text-slate-800">{item.product.name}</Text>
              <Text className="text-right text-sm text-slate-500 mt-1">الكمية: {item.quantity}</Text>
            </View>
            <Pressable onPress={() => removeFromCart(item.product.id)} className="p-3 bg-red-50 rounded-full">
              <Trash2 size={20} color="#ef4444" />
            </Pressable>
          </View>
        ))}

        <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <Text className="text-right text-sm font-bold text-slate-700 mb-2">ملاحظات للمخبر (اختياري)</Text>
          <TextInput
            className="w-full min-h-[100px] bg-slate-50 rounded-xl p-4 text-right text-slate-800 border border-slate-200"
            multiline
            textAlignVertical="top"
            placeholder="أضف أي تفاصيل أو متطلبات خاصة هنا..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <Text className="text-right text-sm text-blue-800 font-medium leading-5">
            سيتم إرسال هذا الطلب إلى المخبر كطلب للحصول على عرض سعر. ستحتاج إلى الموافقة على السعر لاحقاً لتأكيد الحجز.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 shadow-2xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-slate-800">إجمالي العناصر:</Text>
          <Text className="text-2xl font-black text-teal-600">{getCartTotal()}</Text>
        </View>
        <Pressable
          onPress={handleCreateOrder}
          disabled={loading}
          className={`w-full py-4 rounded-2xl items-center flex-row justify-center gap-3 shadow-lg ${loading ? 'opacity-70 bg-slate-400' : 'bg-teal-600'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Send size={20} color="white" />
              <Text className="text-lg font-bold text-white">إرسال طلب التسعير</Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
