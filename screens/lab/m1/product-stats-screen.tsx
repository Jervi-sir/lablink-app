import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  TrendingUp,
  Clock,
  Package,
  MapPin,
  User,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingCart,
  DollarSign,
} from 'lucide-react-native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { Routes } from '@/utils/routes';

const { width } = Dimensions.get('window');

export default function ProductStatsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { productId } = route.params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response: any = await api.get(`${ApiRoutes.products.index}/${productId}`);
      if (response.status === 'success') {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('خطأ', 'تعذر تحميل بيانات المنتج');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const response: any = await api.post(`${ApiRoutes.products.index}/${productId}`, {
        is_available: !product.is_available,
        _method: 'PUT',
      });
      if (response.status === 'success') {
        setProduct({ ...product, is_available: !product.is_available });
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل تحديث الحالة');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              const response: any = await api.delete(`${ApiRoutes.products.index}/${productId}`);
              if (response.status === 'success') {
                Alert.alert('نجاح', 'تم حذف المنتج بنجاح');
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('خطأ', 'فشل حذف المنتج');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className="mt-4 text-slate-500">جاري تحميل البيانات...</Text>
      </View>
    );
  }

  if (!product) return null;

  const images = product.images || (product.image_url ? [product.image_url] : []);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header Image Carousel */}
      <View className="relative h-[300px] bg-slate-200">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
        >
          {images.length > 0 ? (
            images.map((img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={{ width, height: 300 }} className="items-center justify-center bg-teal-50">
              <Text className="text-8xl">🔬</Text>
            </View>
          )}
        </ScrollView>

        {/* Header Overlay */}
        <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between p-6 pt-12">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
          >
            <ArrowLeft size={24} color="white" />
          </Pressable>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => navigation.navigate(Routes.AddEquipmentScreen, { productId: product.id })}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
            >
              <Edit2 size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Carousel Indicators */}
        {images.length > 1 && (
          <View className="absolute bottom-6 left-0 right-0 flex-row justify-center gap-2">
            {images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${activeImageIndex === index ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
              />
            ))}
          </View>
        )}
      </View>

      <ScrollView className="flex-1 rounded-t-[40px] bg-slate-50 p-6" showsVerticalScrollIndicator={false}>
        {/* Title and Status */}
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-end gap-2 mb-1">
              <View className={`px-3 py-1 rounded-full ${product.is_available ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-xs font-bold ${product.is_available ? 'text-green-700' : 'text-red-700'}`}>
                  {product.is_available ? 'متاح حالياً' : 'غير متاح'}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">ID: #{product.id}</Text>
            </View>
            <Text className="text-right text-2xl font-bold text-slate-800">{product.name_ar}</Text>
            <Text className="text-right text-sm text-slate-500 mt-1">{product.type === 'equipment' ? 'جهاز / معدات' : 'خدمة مخبرية'}</Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View className="mb-8 flex-row flex-wrap gap-4">
          <View className="flex-1 min-w-[150px] bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <View className="h-10 w-10 bg-blue-50 rounded-2xl items-center justify-center mb-3">
              <ShoppingCart size={20} color="#2563eb" />
            </View>
            <Text className="text-slate-500 text-xs text-right">إجمالي الطلبات</Text>
            <Text className="text-2xl font-bold text-slate-800 text-right">12</Text>
            <View className="flex-row items-center justify-end mt-1">
              <TrendingUp size={12} color="#16a34a" />
              <Text className="text-[10px] text-green-600 font-bold ml-1">+15%</Text>
            </View>
          </View>

          <View className="flex-1 min-w-[150px] bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <View className="h-10 w-10 bg-teal-50 rounded-2xl items-center justify-center mb-3">
              <DollarSign size={20} color="#0d9488" />
            </View>
            <Text className="text-slate-500 text-xs text-right">الإيرادات</Text>
            <Text className="text-2xl font-bold text-slate-800 text-right">{product.price * 12} DA</Text>
            <Text className="text-[10px] text-slate-400 text-right mt-1">آخر 30 يوم</Text>
          </View>

          <View className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 bg-orange-50 rounded-2xl items-center justify-center">
                <Eye size={20} color="#f97316" />
              </View>
              <View>
                <Text className="text-slate-800 font-bold">458</Text>
                <Text className="text-slate-500 text-[10px]">مشاهدة للمنتج</Text>
              </View>
            </View>
            <View className="h-1 bg-slate-100 flex-1 mx-4 rounded-full overflow-hidden">
              <View className="h-full bg-orange-400 w-[65%]" />
            </View>
            <Text className="text-xs font-bold text-slate-600">نشط</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-right text-sm font-bold text-slate-700 mb-4">إجراءات سريعة</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={toggleAvailability}
              className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl border-2 ${product.is_available ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}
            >
              {product.is_available ? <XCircle size={20} color="#f97316" /> : <CheckCircle2 size={20} color="#16a34a" />}
              <Text className={`font-bold ${product.is_available ? 'text-orange-700' : 'text-green-700'}`}>
                {product.is_available ? 'إيقاف التوفر' : 'تفعيل التوفر'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              className="bg-white border-2 border-slate-200 flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl"
            >
              <Trash2 size={20} color="#ef4444" />
              <Text className="font-bold text-red-600">حذف المنتج</Text>
            </Pressable>
          </View>
        </View>

        {/* Description */}
        <View className="mb-8">
          <View className="flex-row items-center justify-end gap-2 mb-3">
            <Text className="text-right text-lg font-bold text-slate-800">وصف المنتج</Text>
            <Info size={20} color="#0d9488" />
          </View>
          <View className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
            <Text className="text-right text-slate-600 leading-7">
              {product.description_ar}
            </Text>
          </View>
        </View>

        {/* Details List */}
        <View className="mb-8 gap-3">
          <View className="bg-white p-4 rounded-2xl flex-row items-center justify-between border border-slate-50">
            <Text className="text-slate-800 font-semibold">{product.location}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-500 text-sm">الموقع</Text>
              <MapPin size={18} color="#64748b" />
            </View>
          </View>
          <View className="bg-white p-4 rounded-2xl flex-row items-center justify-between border border-slate-50">
            <Text className="text-slate-800 font-semibold">{product.supervisor}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-500 text-sm">المشرف</Text>
              <User size={18} color="#64748b" />
            </View>
          </View>
          <View className="bg-white p-4 rounded-2xl flex-row items-center justify-between border border-slate-50">
            <Text className="text-slate-800 font-semibold">{product.working_hours}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-slate-500 text-sm">ساعات العمل</Text>
              <Clock size={18} color="#64748b" />
            </View>
          </View>
        </View>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <View className="mb-12">
            <View className="flex-row items-center justify-end gap-2 mb-3">
              <Text className="text-right text-lg font-bold text-slate-800">المواصفات التقنية</Text>
              <Package size={20} color="#0d9488" />
            </View>
            <View className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100">
              {product.specifications.map((spec: any, index: number) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between p-4 ${index !== product.specifications.length - 1 ? 'border-b border-slate-50' : ''}`}
                >
                  <Text className="text-slate-500 text-sm">{spec.label}</Text>
                  <Text className="text-slate-800 font-bold text-sm">{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
