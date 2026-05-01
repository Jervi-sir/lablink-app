import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Dimensions,
  Platform,
  Share,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import {
  Star,
  Plus,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Package,
  Info,
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react-native';

interface Product {
  id: number;
  name: string;
  image: string; // This is a string emoji in the example, but could be a URI
  price: string;
  supplierName: string;
  supplierIcon: string;
  description: string;
  specifications: { label: string; value: string }[];
  inStock: boolean;
  deliveryTime: string;
  warranty: string;
}

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (quantity: number) => void;
}

import { useCart } from '@/context/CartContext';

export default function ProductDetailsScreen({
  product: propsProduct,
  onBack: propsOnBack,
  onAddToCart: propsOnAddToCart,
  route,
  navigation: stackNavigation
}: any) {
  const onBack = propsOnBack || (() => stackNavigation?.goBack());
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<any>(route?.params?.product || propsProduct);
  const isBuy = route?.params?.isBuy || false; // Default to true if not explicitly false
  const [loading, setLoading] = useState(!product?.description_ar && !product?.description);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (product?.id && !product.description_ar && !product.description) {
      fetchProduct();
    }
  }, [product?.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`${ApiRoutes.products.index}/${product.id}`);
      if (response.status === 'success') {
        const p = response.data;
        // Map backend product to what screen expects
        setProduct({
          id: p.id,
          name: p.name_ar,
          image: p.image_url || (p.images && p.images[0]),
          images: p.images || (p.image_url ? [p.image_url] : []),
          price: p.price + ' DA',
          supplierName: p.user?.lab?.brand_name || p.user?.lab?.name || 'مخبرك',
          supplierIcon: p.user?.lab?.icon || '🔬',
          description: p.description_ar,
          specifications: p.specifications || [],
          inStock: p.is_available,
          deliveryTime: p.working_hours,
          warranty: p.min_booking_time,
          labId: p.user_id,
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('خطأ', 'تعذر تحميل بيانات المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on LabLink! Price: ${product.price}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pb-4 pt-12 shadow-lg">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={onBack}
            className="flex-row items-center gap-2"
          >
            <ArrowLeft size={24} color="white" />
            <Text className="text-lg font-bold text-white">رجوع</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-4 text-slate-500">جاري تحميل البيانات...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="bg-slate-100 p-8">
            <View className="mx-auto aspect-square w-full max-w-[350px] overflow-hidden rounded-[40px] bg-white shadow-xl">
              {product.images && product.images.length > 0 ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  className="flex-1"
                >
                  {product.images.map((img: string, index: number) => (
                    <View key={index} style={{ width: Dimensions.get('window').width - 48, maxWidth: 350 }} className="h-full items-center justify-center">
                      {img.startsWith('http') || img.startsWith('file') ? (
                        <Image source={{ uri: img }} className="h-full w-full" resizeMode="cover" />
                      ) : (
                        <Text className="text-9xl">{img || '📦'}</Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="h-full w-full items-center justify-center">
                  {product.image && (product.image.startsWith('http') || product.image.startsWith('file')) ? (
                    <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="cover" />
                  ) : (
                    <Text className="text-9xl">{product.image || '🔬'}</Text>
                  )}
                </View>
              )}

              {product.images && product.images.length > 1 && (
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
                  {product.images.map((_: any, i: number) => (
                    <View key={i} className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Product Info */}
          <View className={`flex-1 p-6 ${isBuy ? 'pb-32' : 'pb-10'}`}>
            {/* Title and Price */}
            <View className="mb-6">
              <Text className="text-right text-2xl font-bold text-slate-800">
                {product.name}
              </Text>
              <View className="mt-4 flex-row items-center justify-between">
                <View
                  className={`rounded-xl px-4 py-2 ${product.inStock ? 'bg-green-100' : 'bg-red-100'}`}
                >
                  <Text
                    className={`text-sm font-bold ${product.inStock ? 'text-green-700' : 'text-red-700'}`}
                  >
                    {product.inStock ? 'متوفر في المخزون' : 'غير متوفر'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Supplier Info */}
            <View className="mb-6 rounded-3xl bg-blue-50 p-5">
              <View className="flex-row items-center gap-4">
                <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-blue-600 shadow-md">
                  {product.supplierIcon && (product.supplierIcon.startsWith('http') || product.supplierIcon.startsWith('file')) ? (
                    <Image source={{ uri: product.supplierIcon }} className="h-full w-full" resizeMode="cover" />
                  ) : (
                    <Text className="text-2xl">{product.supplierIcon || '🔬'}</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-right text-xs font-semibold text-blue-600">المخبر</Text>
                  <Text className="text-right text-lg font-bold text-slate-800">
                    {product.supplierName}
                  </Text>
                </View>
              </View>
            </View>

            {/* Delivery & Warranty Info */}
            <View className="mb-6 flex-row gap-3">
              <View className="flex-1 items-center rounded-3xl bg-white p-4 shadow-sm">
                <Package size={24} color="#16a34a" />
                <Text className="mt-1 text-[10px] text-slate-500">الضمان</Text>
                <Text className="text-xs font-bold text-slate-800">{product.warranty}</Text>
              </View>
              <View className="flex-1 items-center rounded-3xl bg-white p-4 shadow-sm">
                <ShieldCheck size={24} color="#9333ea" />
                <Text className="mt-1 text-[10px] text-slate-500">موثوق</Text>
                <Text className="text-xs font-bold text-slate-800">100%</Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <View className="mb-3 flex-row-reverse items-center gap-2">
                <Info size={20} color="#2563eb" />
                <Text className="text-lg font-bold text-slate-800">الوصف</Text>
              </View>
              <View className="rounded-3xl bg-white p-5 shadow-sm">
                <Text className="text-right text-base leading-7 text-slate-600">
                  {product.description}
                </Text>
              </View>
            </View>

            {/* Specifications */}
            <View className="mb-6">
              <Text className="mb-3 text-right text-lg font-bold text-slate-800">
                المواصفات التقنية
              </Text>
              <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
                {/* @ts-ignore */}
                {product.specifications.map((spec, index) => (
                  <View
                    key={index}
                    className={`flex-row items-center justify-between p-4 ${index !== product.specifications.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <Text className="text-sm font-semibold text-slate-500">{spec.label}</Text>
                    <Text className="text-sm font-bold text-slate-800">{spec.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ height: 60 }} />

          </View>
        </ScrollView>
      )}

      {/* Bottom Action Bar */}
      {isBuy && (
        <View
          style={{
            paddingBottom: Platform.OS === 'android' ? 60 + insets.bottom + 10 : (Platform.OS === 'ios' ? 34 : 20),
          }}
          className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 pt-4 shadow-2xl"
        >
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-700">الكمية:</Text>
            <View className="flex-row items-center gap-4 rounded-2xl bg-slate-100 p-1">
              <Pressable
                onPress={() => handleQuantityChange(-1)}
                className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"
              >
                <Text className="text-xl font-bold text-slate-700">-</Text>
              </Pressable>
              <Text className="w-6 text-center text-lg font-bold text-slate-800">{quantity}</Text>
              <Pressable
                onPress={() => handleQuantityChange(1)}
                className="h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"
              >
                <Text className="text-xl font-bold text-slate-700">+</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => {
              addToCart(product, quantity, product.labId || 1); // fallback labId for now if missing
              Alert.alert('نجاح', 'تم إضافة المنتج إلى السلة بنجاح');
            }}
            disabled={!product.inStock}
            className={`h-16 flex-row items-center justify-center rounded-3xl shadow-lg ${product.inStock ? 'bg-green-600' : 'bg-slate-300'
              }`}
            style={({ pressed }) => ({
              transform: [{ scale: pressed && product.inStock ? 0.98 : 1 }],
              opacity: pressed && product.inStock ? 0.9 : 1,
            })}
          >
            <Plus size={24} color="white" strokeWidth={3} />
            <View className="w-2" />
            <Text className="text-xl font-bold text-white">
              {product.inStock ? 'أضف إلى السلة' : 'غير متوفر'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
