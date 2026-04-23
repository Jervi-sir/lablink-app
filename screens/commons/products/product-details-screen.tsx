import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Dimensions,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowRight,
  Star,
  Plus,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Package,
  Info,
  ChevronLeft,
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
  const product = route?.params?.product || propsProduct;
  const onBack = propsOnBack || (() => stackNavigation?.goBack());
  const navigation = stackNavigation;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

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

  // Sample reviews
  const reviews = [
    {
      id: 1,
      userName: 'د. يوسف بن عمر',
      userIcon: '👨‍🔬',
      rating: 5,
      comment: 'منتج ممتاز، جودة عالية جداً ومطابق للمواصفات',
      date: '2026-04-15',
      isVerified: true,
    },
    {
      id: 2,
      userName: 'سارة محمد',
      userIcon: '👩‍🔬',
      rating: 5,
      comment: 'استلمت المنتج في الوقت المحدد، التعامل راقي',
      date: '2026-04-10',
      isVerified: true,
    },
    {
      id: 3,
      userName: 'أحمد الصديق',
      userIcon: '👨‍🎓',
      rating: 4,
      comment: 'جيد جداً لكن السعر مرتفع قليلاً',
      date: '2026-04-05',
      isVerified: true,
    },
  ];

  const averageRating = 4.7;
  const totalReviews = 58;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pb-4 pt-12 shadow-lg">
        <View className="flex-row-reverse items-center justify-between">
          <Pressable
            onPress={onBack}
            className="flex-row-reverse items-center gap-2"
          >
            <ArrowRight size={24} color="white" />
            <Text className="text-lg font-bold text-white">رجوع</Text>
          </Pressable>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setIsFavorite(!isFavorite)}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <Heart
                size={20}
                color={isFavorite ? '#f87171' : 'white'}
                fill={isFavorite ? '#f87171' : 'transparent'}
              />
            </Pressable>
            <Pressable
              onPress={onShare}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <Share2 size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Product Image */}
        <View className="bg-slate-100 p-8">
          <View className="mx-auto aspect-square w-full max-w-[300px] items-center justify-center rounded-[40px] bg-white shadow-xl">
            <Text className="text-9xl">{product.image}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View className="flex-1 p-6 pb-32">
          {/* Title and Price */}
          <View className="mb-6">
            <Text className="text-right text-2xl font-bold text-slate-800">
              {product.name}
            </Text>
            <View className="mt-2 flex-row-reverse items-center gap-2">
              <View className="flex-row-reverse items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    color={star <= Math.round(averageRating) ? '#facc15' : '#cbd5e1'}
                    fill={star <= Math.round(averageRating) ? '#facc15' : 'transparent'}
                  />
                ))}
              </View>
              <Text className="text-sm text-slate-500">
                ({averageRating} - {totalReviews} تقييم)
              </Text>
            </View>

            <View className="mt-4 flex-row-reverse items-center justify-between">
              <Text className="text-3xl font-extrabold text-blue-700">
                {product.price}
              </Text>
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
            <View className="flex-row-reverse items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-md">
                <Text className="text-2xl">{product.supplierIcon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-right text-xs font-semibold text-blue-600">المورد</Text>
                <Text className="text-right text-lg font-bold text-slate-800">
                  {product.supplierName}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery & Warranty Info */}
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1 items-center rounded-3xl bg-white p-4 shadow-sm">
              <Truck size={24} color="#2563eb" />
              <Text className="mt-1 text-[10px] text-slate-500">التوصيل</Text>
              <Text className="text-xs font-bold text-slate-800">{product.deliveryTime}</Text>
            </View>
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
                  className={`flex-row-reverse items-center justify-between p-4 ${index !== product.specifications.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <Text className="text-sm font-semibold text-slate-500">{spec.label}</Text>
                  <Text className="text-sm font-bold text-slate-800">{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews Section */}
          <View className="mb-10">
            <View className="mb-4 flex-row-reverse items-center justify-between">
              <View className="flex-row-reverse items-center gap-2">
                <Star size={20} color="#eab308" fill="#eab308" />
                <Text className="text-lg font-bold text-slate-800">آراء العملاء ({reviews.length})</Text>
              </View>
              <Pressable>
                <Text className="text-sm font-bold text-blue-600">عرض الكل</Text>
              </Pressable>
            </View>
            <View className="gap-4">
              {reviews.map((review) => (
                <View key={review.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <View className="flex-row-reverse items-start gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Text className="text-xl">{review.userIcon}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row-reverse items-center justify-between">
                        <View className="flex-row-reverse items-center gap-2">
                          <Text className="text-base font-bold text-slate-800">{review.userName}</Text>
                          {review.isVerified && (
                            <View className="rounded-full bg-blue-100 px-2 py-0.5">
                              <Text className="text-[10px] font-bold text-blue-600">موثق</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View className="mt-1 flex-row-reverse items-center gap-2">
                        <View className="flex-row-reverse items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              color={s <= review.rating ? '#facc15' : '#cbd5e1'}
                              fill={s <= review.rating ? '#facc15' : 'transparent'}
                            />
                          ))}
                        </View>
                        <Text className="text-[10px] text-slate-400">{review.date}</Text>
                      </View>
                      <Text className="mt-3 text-right text-sm leading-6 text-slate-600">
                        {review.comment}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={{
          paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        }}
        className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-6 pt-4 shadow-2xl"
      >
        <View className="mb-4 flex-row-reverse items-center justify-between">
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
    </View>
  );
}
