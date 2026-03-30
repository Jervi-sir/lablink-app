import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, FlatList, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Routes } from "@/utils/helpers/routes";
import { OrderCard1 } from "../../../components/cards/order-card-1";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import moment from "moment";
import { Image } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const VIEW_TABS = ['orders', 'estimations', 'cart'] as const;

const translations = {
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  estimations: { en: 'Estimations', fr: 'Estimations', ar: 'التقديرات' },
  cart: { en: 'Cart', fr: 'Panier', ar: 'السلة' },
  draft: { en: 'DRAFT', fr: 'BROUILLON', ar: 'مسودة' },
  items: { en: 'items', fr: 'articles', ar: 'عناصر' },
  no_orders: { en: 'No orders found', fr: 'Aucune commande trouvée', ar: 'لم يتم العثور على طلبات' },
  no_estimations: { en: 'No estimation requests found', fr: "Aucune demande d'estimation trouvée", ar: 'لم يتم العثور على طلبات تقدير' },
  empty_cart: { en: 'Your cart is empty', fr: 'Votre panier est vide', ar: 'سلة التسوق فارغة' },
  more: { en: 'more', fr: 'de plus', ar: 'أكثر' },
  selected_item: { en: 'selected item', fr: 'article sélectionné', ar: 'عنصر مختار' },
  selected_items: { en: 'selected items', fr: 'articles sélectionnés', ar: 'عناصر مختارة' },
  awaiting_estimate: { en: 'Awaiting estimate', fr: "En attente d'estimation", ar: 'في انتظار التقدير' },
  laboratory: { en: 'Laboratory', fr: 'Laboratoire', ar: 'مختبر' },
  unknown: { en: 'Unknown', fr: 'Inconnu', ar: 'غير معروف' },
  pending: { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار' },
  confirmed: { en: 'Confirmed', fr: 'Confirmé', ar: 'تم التأكيد' },
  shipped: { en: 'Shipped', fr: 'Expédié', ar: 'تم الشحن' },
  delivered: { en: 'Delivered', fr: 'Livré', ar: 'تم التوصيل' },
  completed: { en: 'Completed', fr: 'Terminé', ar: 'مكتمل' },
  quoted: { en: 'Quoted', fr: 'Chiffré', ar: 'تم التسعير' },
  reviewed: { en: 'Reviewed', fr: 'Révisé', ar: 'تمت المراجعة' },
  cancelled: { en: 'Cancelled', fr: 'Annulé', ar: 'ملغي' },
};

const getStatusColor = (status: unknown) => {
  if (typeof status !== 'string') return '#64748B';
  switch (status.toLowerCase()) {
    case 'pending': return '#F59E0B';
    case 'confirmed': return '#137FEC';
    case 'shipped': return '#8B5CF6';
    case 'delivered': return '#10B981';
    case 'completed': return '#10B981';
    case 'quoted': return '#137FEC';
    case 'reviewed': return '#8B5CF6';
    case 'cancelled': return '#EF4444';
    default: return '#64748B';
  }
};

export default function StudentM3Navigation() {
  const navigation = useNavigation<any>();
  const language = useLanguageStore((state) => state.language);
  const [activeTab, setActiveTab] = useState<(typeof VIEW_TABS)[number]>('orders');
  const carts = useLabCartStore((state) => state.carts);
  const [items, setItems] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const t = (key: keyof typeof translations) => translations[key][language] || key;

  const capitalizeStatus = (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) return t('unknown');
    return t(value.toLowerCase() as any) || value.charAt(0).toUpperCase() + value.slice(1);
  };

  const fetchItems = useCallback(async (page: number | null, refreshing = false) => {
    if (activeTab === 'cart') return;
    if (page === null) return;

    if (refreshing) setIsRefreshing(true);
    else if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const route = activeTab === 'orders' ? ApiRoutes.orders.index : ApiRoutes.estimationRequests.index;
      const response: any = await api.get(route, { params: { page } });
      const newItems = response.data || [];
      if (refreshing || page === 1) setItems(newItems);
      else setItems(prev => [...prev, ...newItems]);
      setNextPage(response.next_page);
    } catch (error) {
      console.error(`Error fetching ${activeTab?.toLowerCase()}:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems(1);
  }, [activeTab, fetchItems]);

  const onRefresh = () => fetchItems(1, true);
  const loadMore = () => { if (!isLoadingMore && nextPage) fetchItems(nextPage); };

  const formatOrderData = (item: any) => ({
    id: item.code,
    date: new Date(item.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: capitalizeStatus(item.status?.code),
    statusColor: getStatusColor(item.status?.code),
    lab: item.products?.[0]?.business?.name || t('laboratory'),
    product: item.products?.[0]?.name + (item.products?.length > 1 ? ` (+${item.products.length - 1} ${t('more')})` : ''),
    price: `${item.total_price?.toLocaleString()} DA`,
    original: item,
    productImages: (item.products || []).slice(0, 3).map((p: any) => p.images?.[0]?.url).filter(Boolean),
    totalProducts: item.products?.length || 0,
  });

  const formatEstimationData = (item: any) => ({
    id: item.code,
    date: new Date(item.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: capitalizeStatus(item.status),
    statusColor: getStatusColor(item.status),
    lab: item.business?.name || t('laboratory'),
    product: item.items?.[0]?.productName
      ? item.items[0].productName + (item.items.length > 1 ? ` (+${item.items.length - 1} ${t('more')})` : '')
      : `${item.itemCount || 0} ${item.itemCount === 1 ? t('selected_item') : t('selected_items')}`,
    price: item.estimatedTotal ? `${Number(item.estimatedTotal).toLocaleString()} DA` : t('awaiting_estimate'),
    original: item,
    productImages: (item.items || []).slice(0, 3).map((it: any) => it.product?.images?.[0]?.url).filter(Boolean),
    totalProducts: item.items?.length || 0,
  });

  const renderOrder = ({ item }: { item: any }) => (
    <OrderCard1
      item={activeTab === 'orders' ? formatOrderData(item) : formatEstimationData(item)}
      onPress={() => {
        if (activeTab === 'orders') {
          navigation.navigate(Routes.OrderDetailScreen, { order: item });
          return;
        }
        navigation.navigate(Routes.EstimationDetailScreen, { estimation: item });
      }}
    />
  );

  const renderCart = ({ item }: { item: any }) => {
    const business = item.business;
    const itemsCount = item.items.length;
    const total = item.items.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0);
    const date = moment(item.updatedAt).locale(language).fromNow();

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(Routes.LabEstimationScreen, { businessId: business.id })}
        style={{ backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
            {business.logo ? (
              <Image source={{ uri: business.logo }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
            ) : (
              <Text style={{ fontSize: 20 }}>🏢</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{business.name}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 }}>{date} • {itemsCount} {t('items')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC' }}>{total.toLocaleString()} DA</Text>
            <View style={{ marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: '#EFF6FF', borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#137FEC' }}>{t('draft')}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8F9FB' }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: paddingHorizontal, paddingBottom: 16, paddingTop: 10, gap: 10 }}>
        {VIEW_TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: isActive ? '#137FEC' : '#FFF', borderWidth: 1, borderColor: isActive ? '#137FEC' : '#E2E8F0' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: isActive ? '#FFF' : '#475569' }}>{t(tab)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'cart' ? Object.values(carts) : items}
          renderItem={activeTab === 'cart' ? renderCart : renderOrder}
          keyExtractor={item => (activeTab === 'cart' ? item.business.id.toString() : item.id.toString())}
          contentContainerStyle={{ padding: paddingHorizontal, paddingTop: 0, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: 16, color: '#64748B', fontWeight: '600' }}>
                {activeTab === 'orders' ? t('no_orders') : activeTab === 'estimations' ? t('no_estimations') : t('empty_cart')}
              </Text>
            </View>
          }
          ListFooterComponent={isLoadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} color="#137FEC" /> : null}
        />
      )}
    </ScreenWrapper>
  );
}
