import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import moment from "moment";
import { paddingHorizontal } from "@/utils/variables/styles";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  my_lab_orders: { en: 'My Lab Orders', fr: 'Mes commandes de labo', ar: 'طلباتي المخبرية' },
  supplier: { en: 'Supplier', fr: 'Fournisseur', ar: 'المورد' },
  items_count: { en: '{count} items', fr: '{count} articles', ar: '{count} عناصر' },
  total_paid: { en: 'Total Paid', fr: 'Total payé', ar: 'إجمالي المدفوع' },
  unknown: { en: 'Unknown', fr: 'Inconnu', ar: 'غير معروف' },
  pending: { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار' },
  processing: { en: 'Processing', fr: 'En traitement', ar: 'قيد المعالجة' },
  ready: { en: 'Ready', fr: 'Prêt', ar: 'جاهز' },
  done: { en: 'Done', fr: 'Terminé', ar: 'مكتمل' },
  cancelled: { en: 'Cancelled', fr: 'Annulé', ar: 'ملغى' },
  no_orders_yet: { en: 'No Orders Yet', fr: 'Pas encore de commandes', ar: 'لا توجد طلبات بعد' },
  orders_empty_msg: { en: 'Orders you place to suppliers will appear here.', fr: 'Les commandes que vous passez aux fournisseurs apparaîtront ici.', ar: 'ستظهر الطلبات التي تقدمها للموردين هنا.' },
};

export default function LabOrdersScreen() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations, params?: Record<string, string>) => {
    let text = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);

  const fetchOrders = useCallback(async (page: number = 1, shouldRefresh: boolean = false) => {
    if (page === 1 && !shouldRefresh) setIsLoading(true);
    if (page > 1) setIsLoadingMore(true);

    try {
      const response: any = await api.get(buildRoute(ApiRoutes.orders.laboratoryOrders), {
        params: { page, per_page: 10 }
      });

      const data = response.data?.data || response.data || [];
      const np = response.data?.next_page || response.next_page;

      if (shouldRefresh || page === 1) {
        setOrders(data);
      } else {
        setOrders(prev => [...prev, ...data]);
      }
      setNextPage(np);
    } catch (error) {
      console.error("Error fetching laboratory orders:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(1, true);
  };

  const onLoadMore = () => {
    if (nextPage && !isLoadingMore) {
      fetchOrders(nextPage);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#F5F3FF', text: '#8B5CF6', label: t('pending') };
      case 'processing': return { bg: '#FFF7ED', text: '#F59E0B', label: t('processing') };
      case 'ready': return { bg: '#ECFDF5', text: '#10B981', label: t('ready') };
      case 'done': return { bg: '#F1F5F9', text: '#64748B', label: t('done') };
      case 'cancelled': return { bg: '#FEF2F2', text: '#EF4444', label: t('cancelled') };
      default: return { bg: '#F8FAFC', text: '#94A3B8', label: t('unknown') };
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status?.code);
    const date = item.created_at ? moment(item.created_at).format('DD MMM, HH:mm') : 'N/A';
    const amount = item.total_price ? `${parseFloat(item.total_price).toLocaleString()} DA` : '0 DA';
    const supplierName = item.products?.[0]?.business?.name || t('supplier');

    return (
      <TouchableOpacity 
        style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.OrderDetailScreen, { orderId: item.id, order: item })}
      >
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{item.code}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{date}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: statusStyle.bg }}>
            <Text style={{ fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: statusStyle.text }}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#F8FAFC', marginVertical: 14 }} />

        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, width: '100%' }}>
          <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden' }}>
            {item.products && item.products[0]?.images && item.products[0].images.length > 0 ? (
              <Image
                source={{ uri: item.products[0].images[0].url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontSize: 24 }}>📦</Text>
            )}
          </View>
          <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111', textAlign: language === 'ar' ? 'right' : 'left' }}>{supplierName}</Text>
            <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 }}>{t('items_count', { count: item.products?.length?.toString() || '0' })}</Text>
          </View>
          <View style={{ alignItems: language === 'ar' ? 'flex-start' : 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('total_paid')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#111' }}>{amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={22} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', marginLeft: language === 'ar' ? 0 : 12, marginRight: language === 'ar' ? 12 : 0 }}>{t('my_lab_orders')}</Text>
      </View>

      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: paddingHorizontal, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color="#8B5CF6" style={{ paddingVertical: 20 }} /> : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4, textAlign: 'center' }}>{t('no_orders_yet')}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>{t('orders_empty_msg')}</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}
