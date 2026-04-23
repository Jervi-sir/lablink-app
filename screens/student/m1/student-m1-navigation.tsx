import { Routes } from '@/utils/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';

interface Lab {
  id: number;
  brand_name: string;
  category?: { ar: string };
  wilaya?: { ar: string };
  icon?: string;
  accent?: string;
}

const fallbackAccents = ['bg-teal-600', 'bg-amber-500', 'bg-rose-500', 'bg-blue-600', 'bg-violet-600'];
const fallbackIcons = ['🔬', '💡', '🎯', '🏗️', '⚗️', '🧬'];

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="bg-blue-700 px-6 pb-6 pt-5">
      <Text className="text-right text-3xl font-bold text-white">{title}</Text>
      <Text className="mt-2 text-right text-sm text-blue-100">{subtitle}</Text>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View className="mb-4 flex-row-reverse items-center justify-between">
      <Text className="text-right text-xl font-bold text-slate-800">{title}</Text>
      <Text className="text-xl text-blue-600">‹</Text>
    </View>
  );
}

export function StudentM1Navigation() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [labsList, setLabsList] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    if (!refreshing) setLoading(true);
    try {
      const response = await api.get(ApiRoutes.labs.index);
      setLabsList(response.data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLabs();
  };

  const renderLabItem = ({ item, index }: { item: Lab; index: number }) => (
    <Pressable
      accessibilityRole="button"
      className="w-[31%] rounded-[24px] bg-white px-2 py-4 mb-4"
      onPress={() => navigation.navigate(Routes.LabDetailsScreen, { labId: item.id })}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.94 : 1,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
        elevation: 3,
      })}>
      <View className="items-center">
        <View className={`h-14 w-14 items-center justify-center rounded-full ${fallbackAccents[index % fallbackAccents.length]}`}>
          <Text className="text-2xl">{fallbackIcons[index % fallbackIcons.length]}</Text>
        </View>
        <Text numberOfLines={1} className="mt-3 text-center text-xs font-bold text-slate-800">
          {item.brand_name}
        </Text>
        <Text numberOfLines={1} className="mt-1 text-center text-[9px] leading-3 text-slate-500">
          {item.category?.ar || item.wilaya?.ar || 'مخبر معتمد'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={labsList}
          renderItem={renderLabItem}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListHeaderComponent={
            <View>
              <Header title="سوق المخابر" subtitle="اختر من الموردين أو المخابر المعتمدة" />
              <View className="px-6 pt-6 mb-4">
                <SectionTitle title="قائمة المخابر" />
              </View>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}