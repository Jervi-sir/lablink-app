import React from 'react';
import { Pressable, ScrollView, Text, View, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Plus, ArrowLeft } from 'lucide-react-native';

interface Supplier {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
}

interface ServiceDetailsScreenProps {
  supplier: Supplier;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick?: (product: Product) => void;
}

const products: Product[] = [
  { id: 1, name: 'مجهر رقمي متطور', image: '🔬', price: '45,000 DA' },
  { id: 2, name: 'حاضنة مخبرية أوتوماتيكية', image: '🧪', price: '25,500 DA' },
  { id: 3, name: 'جهاز طرد مركزي عالي السرعة', image: '⚡', price: '36,000 DA' },
  { id: 4, name: 'نظام التحكم الآلي', image: '🖥️', price: '75,000 DA' },
  { id: 5, name: 'جهاز قياس الحموضة الإلكتروني', image: '📊', price: '10,500 DA' },
  { id: 6, name: 'منظومة تنقية المياه', image: '💧', price: '54,000 DA' },
  { id: 7, name: 'ميزان تحليلي دقيق', image: '⚖️', price: '18,600 DA' },
  { id: 8, name: 'جهاز الاستخلاص الحراري', image: '🔥', price: '29,400 DA' },
];

export function ServiceDetailsScreen({
  supplier: propsSupplier,
  onBack: propsOnBack,
  onAddToCart,
  onProductClick,
  route,
  navigation
}: any) {
  const supplier = route?.params?.supplier || propsSupplier;
  const onBack = propsOnBack || (() => navigation?.goBack());
  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pb-6 pt-12 shadow-lg">
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          className="mb-6 flex-row items-center gap-2 self-start rounded-full bg-white/10 px-4 py-2"
        >
          <ArrowLeft size={20} color="white" />
          <Text className="text-base font-bold text-white">رجوع</Text>
        </Pressable>

        <View className="flex-row items-start gap-4 mb-4">
          <View className={`w-16 h-16 rounded-3xl bg-white/20 items-center justify-center overflow-hidden shadow-lg`}>
            {supplier.icon && (supplier.icon.startsWith('http') || supplier.icon.startsWith('file')) ? (
              <Image source={{ uri: supplier.icon }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <Text className="text-3xl">{supplier.icon || '🔬'}</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-right text-2xl font-bold text-white mb-1">{supplier.name}</Text>
            <Text className="text-right text-sm text-blue-100 font-medium">{supplier.description}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={16} color="#facc15" fill="#facc15" />
          ))}
          <Text className="text-sm font-bold text-blue-100 mr-2">(4.9)</Text>
        </View>

        <Text className="text-right text-sm text-blue-50 italic leading-5">
          "نوفر أحدث التقنيات المختبرية لرفع الكفاءة والدقة"
        </Text>
      </View>

      {/* Products Grid */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-row flex-wrap justify-between px-6 pb-24 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {products.map((product) => (
          <Pressable
            key={product.id}
            onPress={() => onProductClick?.(product)}
            className="bg-white rounded-[32px] p-4 mb-5 w-[48%] shadow-sm"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View className="w-full aspect-square bg-slate-50 rounded-2xl items-center justify-center overflow-hidden mb-3">
              {product.image && (product.image.startsWith('http') || product.image.startsWith('file')) ? (
                <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <Text className="text-6xl">{product.image || '🔬'}</Text>
              )}
            </View>

            <Text className="text-right text-sm text-slate-800 font-bold mb-3 leading-5 h-10 overflow-hidden">
              {product.name}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-extrabold text-blue-700">{product.price}</Text>
              <Pressable
                onPress={() => onAddToCart(product)}
                className="w-10 h-10 bg-green-500 rounded-full items-center justify-center shadow-md"
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                  backgroundColor: pressed ? '#16a34a' : '#22c55e',
                })}
              >
                <Plus size={20} color="white" strokeWidth={3} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
