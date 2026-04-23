import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowRight, Plus, Package, ChevronLeft, Search } from 'lucide-react-native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { Routes } from '@/utils/routes';

export function MyProductsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type } = route.params || {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [type]);

  const fetchProducts = async () => {
    try {
      const apiParams: any = {};
      if (type) apiParams.type = type;

      const response: any = await api.get(ApiRoutes.lab.products, {
        params: apiParams
      });

      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleProductClick = (item: any) => {
    // Map to ProductDetails format
    const mappedProduct = {
      id: item.id,
      name: item.name_ar,
      image: item.image_url || '📦',
      price: item.price + ' DA',
      supplierName: 'مخبرك',
      supplierIcon: '🔬',
      description: item.description_ar,
      specifications: item.specifications || [],
      inStock: item.is_available,
      deliveryTime: item.working_hours,
      warranty: item.min_booking_time,
    };
    navigation.navigate(Routes.ProductDetailsScreen, { product: mappedProduct });
  };

  const renderProduct = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => handleProductClick(item)}
      className="mb-4 flex-row-reverse items-center rounded-[24px] bg-white p-4 shadow-sm"
    >
      <View className="h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 ml-4">
        <Text className="text-4xl">{item.image_url || '🔬'}</Text>
      </View>

      <View className="flex-1">
        <View className="flex-row-reverse items-center justify-between">
          <Text className="text-right text-lg font-bold text-slate-800" numberOfLines={1}>
            {item.name_ar}
          </Text>
          <View className={`rounded-full px-2 py-1 ${item.is_available ? 'bg-green-100' : 'bg-orange-100'}`}>
            <Text className={`text-[10px] font-bold ${item.is_available ? 'text-green-700' : 'text-orange-700'}`}>
              {item.is_available ? 'متاح' : 'محجوز'}
            </Text>
          </View>
        </View>

        <Text className="mt-1 text-right text-sm text-slate-500" numberOfLines={2}>
          {item.description_ar}
        </Text>

        <View className="mt-2 flex-row-reverse items-center justify-between">
          <Text className="text-sm font-bold text-teal-600">{item.price} DA</Text>
          <View className="flex-row items-center gap-1">
            <Package size={14} color="#94a3b8" />
            <Text className="text-xs text-slate-400">{item.type === 'equipment' ? 'جهاز' : 'خدمة'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row-reverse items-center justify-between px-6 py-4">
        <View className="flex-row-reverse items-center gap-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowRight size={24} color="#1e293b" />
          </Pressable>
          <Text className="text-xl font-bold text-slate-800">
            {type === 'equipment' ? 'منتجاتي' : type === 'service' ? 'خدماتي' : 'معداتي وخدماتي'}
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate(Routes.AddEquipmentScreen)}
          className="h-10 w-10 items-center justify-center rounded-full bg-teal-600 shadow-lg"
        >
          <Plus size={24} color="white" />
        </Pressable>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0d9488']} />
            }
            ListEmptyComponent={
              <View className="mt-20 items-center justify-center">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                  <Package size={40} color="#94a3b8" />
                </View>
                <Text className="text-lg font-bold text-slate-400">لا توجد منتجات حتى الآن</Text>
                <Pressable
                  onPress={() => navigation.navigate(Routes.AddEquipmentScreen)}
                  className="mt-4 rounded-full bg-teal-50 px-6 py-2"
                >
                  <Text className="font-bold text-teal-600">إضافة أول منتج</Text>
                </Pressable>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
