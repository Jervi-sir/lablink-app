import { Routes } from '@/utils/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutGrid, Package, Settings, FileText, ClipboardList, Briefcase, PlusCircle, Activity } from 'lucide-react-native';
import api from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="bg-blue-700 px-6 pb-8 pt-6 rounded-b-[40px]">
      <Text className="text-right text-3xl font-black text-white">{title}</Text>
      <Text className="mt-2 text-right text-sm text-blue-100 font-medium">{subtitle}</Text>
    </View>
  );
}

function SquareActionCard({
  title,
  icon,
  accent,
  onPress,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  onPress?: () => void;
  badge?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`aspect-square w-[47%] rounded-[32px] p-5 justify-between shadow-sm border border-slate-100 ${accent}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
        {icon}
      </View>
      <View>
        <Text className="text-right text-lg font-bold text-white">{title}</Text>
        {badge && (
          <View className="mt-1 self-start rounded-full bg-white/30 px-2 py-0.5">
            <Text className="text-[10px] font-bold text-white">{badge}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function LabM1Navigation() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get(ApiRoutes.lab.stats);
      // @ts-ignore
      if (response.status === 'success') {
        // @ts-ignore
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch lab stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar barStyle="light-content" />
      <Header title="لوحة التحكم" subtitle="إدارة المخبر والطلبات" />

      <ScrollView
        contentContainerClassName="px-6 pb-10 pt-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" colors={["#2563eb"]} />
        }
      >
        <View className="mb-6 flex-row items-center justify-end gap-4">
          <Text className="text-right text-xl font-black text-slate-800">الإجراءات السريعة</Text>
          <LayoutGrid size={20} color="#64748b" />
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-4">
          <SquareActionCard
            accent="bg-blue-600"
            icon={<ClipboardList size={28} color="white" />}
            onPress={() => navigation.navigate(Routes.LabM2Navigation)}
            title="الطلبات الواردة"
            badge="جديد"
          />
          <SquareActionCard
            accent="bg-amber-600"
            icon={<Activity size={28} color="white" />}
            onPress={() => navigation.navigate(Routes.AddEquipmentScreen)}
            title="إضافة منتج"
          />
          <SquareActionCard
            accent="bg-teal-600"
            icon={<Package size={28} color="white" />}
            onPress={() => navigation.navigate(Routes.MyProductsScreen, { type: 'equipment' })}
            title="قائمة المعدات"
          />
          <SquareActionCard
            accent="bg-indigo-600"
            icon={<Briefcase size={28} color="white" />}
            onPress={() => navigation.navigate(Routes.MyProductsScreen, { type: 'service' })}
            title="قائمة الخدمات"
          />

        </View>

        {/* Stats Section or similar */}
        <View className="mt-10 rounded-[32px] bg-white p-6 shadow-sm border border-slate-100">
          <Text className="text-right text-lg font-bold text-slate-800 mb-4">ملخص الأداء</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-black text-blue-600">
                {loading ? <ActivityIndicator size="small" color="#2563eb" /> : stats?.orders?.pending || 0}
              </Text>
              <Text className="text-xs text-slate-400">طلبات جديدة</Text>
            </View>
            <View className="h-10 w-[1px] bg-slate-100 self-center" />
            <View className="items-center">
              <Text className="text-2xl font-black text-teal-600">
                {loading ? <ActivityIndicator size="small" color="#0d9488" /> : stats?.inventory?.total || 0}
              </Text>
              <Text className="text-xs text-slate-400">المنتجات</Text>
            </View>
            <View className="h-10 w-[1px] bg-slate-100 self-center" />
            <View className="items-center">
              <Text className="text-2xl font-black text-indigo-600">
                {loading ? <ActivityIndicator size="small" color="#4f46e5" /> : (stats?.revenue?.total?.toLocaleString() || 0)}
              </Text>
              <Text className="text-xs text-slate-400">إجمالي الأرباح</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}