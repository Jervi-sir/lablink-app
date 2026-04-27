import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes, buildRoute } from '@/utils/api/api';
import { Routes } from '@/utils/routes';
import { useCart } from '@/context/CartContext';

interface Lab {
  id: number;
  brand_name: string;
  category?: { ar: string };
  wilaya?: { ar: string };
  icon?: string;
  accent?: string;
  description_ar?: string;
}

interface Product {
  id: number;
  name_ar: string;
  image_url: string;
  images?: string[];
  is_available: boolean;
  price: string;
  type: 'equipment' | 'service';
  description_ar?: string;
}

function RatingModal({
  targetName,
  targetIcon,
  visible,
  onClose,
}: {
  targetName: string;
  targetIcon: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-slate-950/45 px-6">
        <View className="w-full rounded-[28px] bg-white px-6 py-6">
          <View className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <Text className="text-3xl">{targetIcon}</Text>
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-slate-900">اكتب تقييمك</Text>
            <Text className="mt-1 text-center text-sm text-slate-500">{targetName}</Text>
          </View>

          <View className="mt-6 flex-row justify-center gap-2">
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
            placeholder="أضف تعليقك حول التجربة والخدمة"
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
            value={comment}
          />

          <View className="mt-6 flex-row gap-3">
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
              className={`flex-1 rounded-2xl px-4 py-4 ${rating > 0 ? 'bg-teal-600' : 'bg-teal-300'}`}
              disabled={rating === 0}
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

function Stars({ rating, size = 'text-sm' }: { rating: number; size?: string }) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          className={`${size} ${star <= rating ? 'text-amber-300' : 'text-slate-300'}`}>
          ★
        </Text>
      ))}
    </View>
  );
}

function SkeletonPulse({ className, style }: { className?: string; style?: any }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View className={`bg-slate-200 ${className}`} style={[style, animatedStyle]} />;
}

function ProductSkeleton() {
  return (
    <View className="mb-4 w-[48%] rounded-[24px] bg-white p-4">
      <SkeletonPulse className="aspect-square rounded-[18px]" />
      <SkeletonPulse className="mt-3 h-4 w-full rounded-lg" />
      <SkeletonPulse className="mt-2 h-3 w-1/2 self-end rounded-lg" />
      <SkeletonPulse className="mt-4 h-10 w-full rounded-lg" />
    </View>
  );
}

function LabDetailsSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="bg-teal-800/10 px-6 pb-8 pt-4">
        <View className="mb-5 h-10 w-20 rounded-full bg-slate-200/50" />
        <View className="flex-row items-start gap-4">
          <SkeletonPulse className="h-16 w-16 rounded-full" />
          <View className="flex-1 items-end">
            <SkeletonPulse className="h-8 w-48 rounded-xl" />
            <SkeletonPulse className="mt-2 h-4 w-32 rounded-lg" />
            <View className="mt-4 flex-row items-center">
              <SkeletonPulse className="h-4 w-24 rounded-lg" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-6">
        <SkeletonPulse className="mb-3 h-20 rounded-[24px]" />
        <SkeletonPulse className="mb-6 h-20 rounded-[24px]" />

        <View className="flex-row gap-3">
          <SkeletonPulse className="h-14 flex-1 rounded-2xl" />
          <SkeletonPulse className="h-14 flex-1 rounded-2xl" />
        </View>

        <SkeletonPulse className="mt-8 h-6 w-32 self-end rounded-lg" />

        <View className="mt-6 flex-row flex-wrap justify-between">
          {[1, 2, 3, 4].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function LabDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { labId } = route.params || {};

  const [lab, setLab] = useState<Lab | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const { isCartEmpty, getCartTotal, clearCart, labId: cartLabId } = useCart();

  const [activeTab, setActiveTab] = useState<'equipment' | 'service'>('equipment');
  const [nextPage, setNextPage] = useState<number | null>(1);

  const handleGoBack = () => {
    if (!isCartEmpty && cartLabId === labId) {
      Alert.alert(
        'مغادرة المخبر',
        'لديك منتجات في السلة من هذا المخبر. هل أنت متأكد من المغادرة وتفريغ السلة؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'مغادرة وتفريغ',
            style: 'destructive',
            onPress: () => {
              clearCart();
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchLabInfo();
  }, [labId]);

  useEffect(() => {
    fetchProducts(1, true);
  }, [labId, activeTab]);

  const fetchLabInfo = async () => {
    try {
      const response: any = await api.get(buildRoute(ApiRoutes.labs.show, { id: labId }));
      if (response.status === 'success') {
        setLab(response.data);
      }
    } catch (error) {
      console.error('Error fetching lab info:', error);
    }
  };

  const fetchProducts = async (pageNum: number | null, isInitial: boolean = false) => {
    if (pageNum === null && !isInitial) return;

    try {
      if (isInitial) {
        if (!lab) setLoading(true);
        else setTabLoading(true);
        setProducts([]);
      } else {
        setLoadingMore(true);
      }

      const response: any = await api.get(buildRoute(ApiRoutes.labs.products, { id: labId }), {
        params: {
          page: pageNum,
          type: activeTab
        },
      });

      if (response.status === 'success') {
        const newData = response.data;
        const next = response.next_page;

        setProducts(prev => isInitial ? newData : [...prev, ...newData]);
        setNextPage(next);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setTabLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setNextPage(1);
    fetchProducts(1, true);
    fetchLabInfo();
  };

  const onEndReached = () => {
    if (!loading && !loadingMore && nextPage !== null) {
      fetchProducts(nextPage);
    }
  };

  const handleProductClick = (item: Product) => {
    const mainImage = item.image_url || (item.images && item.images.length > 0 ? item.images[0] : '📦');

    // Map to ProductDetails format
    const mappedProduct = {
      id: item.id,
      labId: labId,
      name: item.name_ar,
      image: mainImage,
      images: item.images || [mainImage],
      price: item.price + ' DA',
      supplierName: lab?.brand_name || 'مخبر معتمد',
      supplierIcon: lab?.icon || '🔬',
      description: item.description_ar || 'لا يوجد وصف متاح حالياً لهذا المنتج.',
      specifications: (item as any).specifications || [],
      inStock: item.is_available,
      deliveryTime: (item as any).working_hours || 'غير محدد',
      warranty: (item as any).min_booking_time || 'غير محدد',
    };
    navigation.navigate(Routes.ProductDetailsScreen, { product: mappedProduct, isBuy: true });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const mainImage = item.image_url || (item.images && item.images.length > 0 ? item.images[0] : null);
    const isUri = mainImage && (mainImage.startsWith('http') || mainImage.startsWith('file'));

    return (
      <View
        className="mb-4 w-[48%] rounded-[24px] bg-white px-4 py-4"
        style={{
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 14,
          elevation: 3,
        }}>
        <Pressable onPress={() => handleProductClick(item)}>
          <View className="mb-3 aspect-square items-center justify-center overflow-hidden rounded-[18px] bg-teal-50 w-full">
            {isUri ? (
              <Image source={{ uri: mainImage }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <Text className="text-6xl">{mainImage || '📦'}</Text>
            )}
          </View>

          <Text className="min-h-[20px] text-right text-sm font-semibold leading-5 text-slate-800">
            {item.name_ar}
          </Text>

          <Text
            className={`mt-2 text-right text-xs font-medium ${item.is_available ? 'text-green-600' : 'text-orange-600'}`}>
            {item.is_available ? 'متاح الآن' : 'محجوز'}
          </Text>

          <Pressable
            accessibilityRole="button"
            className="mt-4 rounded-lg bg-teal-500 py-3"
            onPress={() => handleProductClick(item)}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.92 : 1,
            })}>
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-lg font-bold text-white">+</Text>
              <Text className="text-sm font-medium text-white">احجز الآن</Text>
            </View>
          </Pressable>
        </Pressable>
      </View>
    );
  };

  if (loading && !refreshing && !lab) {
    return <LabDetailsSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0d9488']} />
        }
        ListHeaderComponent={
          <View>
            {/* Lab Info Header */}
            <View className="bg-teal-700 px-6 pb-8 pt-4">
              <Pressable
                accessibilityRole="button"
                className="mb-5 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2"
                onPress={handleGoBack}>
                <Text className="text-base font-medium text-white">رجوع</Text>
              </Pressable>

              <View className="flex-row items-start gap-4">
                <View className={`h-16 w-16 items-center justify-center rounded-full bg-white/20`}>
                  <Text className="text-3xl">{lab?.icon || '🔬'}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-right text-2xl font-bold text-white">
                    {lab?.brand_name || 'جاري التحميل...'}
                  </Text>
                  <Text className="mt-1 text-right text-sm text-teal-100">
                    {lab?.category?.ar || 'مخبر معتمد'}
                  </Text>

                  <View className="mt-4 flex-row items-center">
                    <Text className="mr-2 text-sm text-teal-100">(4.8 - 156 تقييم)</Text>
                    <Stars rating={5} size="text-base" />
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    className="mt-4 self-end rounded-xl bg-white/20 px-4 py-2"
                    onPress={() => setShowRatingModal(true)}>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-white">★</Text>
                      <Text className="text-sm text-white">اكتب تقييمك</Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Warnings/Info */}
            <View className="p-6 gap-3">
              <View className="rounded-[24px] border-2 border-yellow-400 bg-yellow-50 px-4 py-4">
                <View className="flex-row-reverse items-center gap-3">
                  <Text className="mt-0.5 text-xl text-yellow-600">⚠️</Text>
                  <Text className="flex-1 text-right font-medium leading-6 text-slate-800">
                    المبلغ يظهر عند قبول الطلب والثمن يكون في العقد
                  </Text>
                </View>
              </View>

              <View className="rounded-[24px] border-2 border-blue-400 bg-blue-50 px-4 py-4">
                <View className="flex-row-reverse items-center gap-3">
                  <Text className="mt-0.5 text-xl text-blue-600">ℹ️</Text>
                  <Text className="flex-1 text-right font-medium leading-6 text-slate-800">
                    يجب إجراء التجارب داخل المختبر فقط
                  </Text>
                </View>
              </View>

              {/* Tab Selector */}
              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={() => setActiveTab('equipment')}
                  className={`flex-1 py-4 rounded-2xl border-2 items-center ${activeTab === 'equipment' ? 'bg-teal-100 border-teal-500' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`font-bold ${activeTab === 'equipment' ? 'text-teal-700' : 'text-slate-600'}`}>المعدات</Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('service')}
                  className={`flex-1 py-4 rounded-2xl border-2 items-center ${activeTab === 'service' ? 'bg-teal-100 border-teal-500' : 'bg-white border-slate-200'}`}
                >
                  <Text className={`font-bold ${activeTab === 'service' ? 'text-teal-700' : 'text-slate-600'}`}>الخدمات</Text>
                </Pressable>
              </View>

              <Text className="mt-4 text-right text-lg font-bold text-slate-800">
                {activeTab === 'equipment' ? 'الأجهزة المتاحة' : 'الخدمات المتاحة'}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-6">
              <ActivityIndicator color="#0d9488" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          tabLoading ? (
            <View className="flex-row flex-wrap justify-between px-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </View>
          ) : !loading ? (
            <View className="mt-10 items-center justify-center px-6">
              <Text className="text-center text-slate-400">لا توجد أجهزة أو خدمات متاحة حالياً في هذا المخبر</Text>
            </View>
          ) : null
        }
      />

      {lab && (
        <RatingModal
          onClose={() => setShowRatingModal(false)}
          targetIcon={lab.icon || '🔬'}
          targetName={lab.brand_name}
          visible={showRatingModal}
        />
      )}

      {/* Floating Cart Button */}
      {!isCartEmpty && cartLabId === labId && (
        <View className="absolute bottom-6 left-6 right-6">
          <Pressable
            onPress={() => navigation.navigate(Routes.CartScreen)}
            className="flex-row items-center justify-between rounded-full bg-teal-600 px-6 py-4 shadow-lg shadow-teal-500/30"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
                <Text className="text-base font-bold text-teal-600">{getCartTotal()}</Text>
              </View>
              <Text className="text-lg font-bold text-white">السلة</Text>
            </View>
            <Text className="text-base font-medium text-teal-100">عرض الطلب</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
