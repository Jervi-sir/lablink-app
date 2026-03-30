import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import moment from "moment";
import { useLanguageStore } from "@/zustand/language-store";

const { width } = Dimensions.get('window');

const translations = {
  order_submitted: { en: 'Order Submitted', fr: 'Commande soumise', ar: 'تم تقديم الطلب' },
  confirmed: { en: 'Confirmed', fr: 'Confirmé', ar: 'مؤكد' },
  pending: { en: 'Pending', fr: 'En attente', ar: 'قيد الانتظار' },
  completed: { en: 'Completed', fr: 'Terminée', ar: 'مكتمل' },
  processing: { en: 'Processing', fr: 'En traitement', ar: 'قيد المعالجة' },
  shipped: { en: 'Shipped', fr: 'Expédié', ar: 'تم الشحن' },
  delivered: { en: 'Delivered', fr: 'Livré', ar: 'تم التوصيل' },
  cancelled: { en: 'Cancelled', fr: 'Annulé', ar: 'ملغى' },
  order_cancelled_desc: { en: 'Order Cancelled', fr: 'Commande annulée', ar: 'تم إلغاء الطلب' },
  error_label: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  user_not_identified: { en: 'Could not identify the business user to start a chat.', fr: 'Impossible d\'identifier l\'utilisateur professionnel pour démarrer une discussion.', ar: 'تعذر تحديد مستخدم العمل لبدء الدردشة.' },
  failed_resolve_conv: { en: 'Failed to resolve conversation.', fr: 'Échec de la résolution de la conversation.', ar: 'فشل في حل المحادثة.' },
  failed_message_vendor: { en: 'Failed to message vendor. Please try again.', fr: 'Échec de l\'envoi du message au fournisseur. Veuillez réessayer.', ar: 'فشل في مراسلة البائع. يرجى المحاولة مرة أخرى.' },
  success_label: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  invoice_downloaded: { en: 'Invoice downloaded successfully!', fr: 'Facture téléchargée avec succès !', ar: 'تم تحميل الفاتورة بنجاح!' },
  order_details: { en: 'Order Details', fr: 'Détails de la commande', ar: 'تفاصيل الطلب' },
  tracking_status: { en: 'Tracking Status', fr: 'État du suivi', ar: 'حالة التتبع' },
  items_ordered: { en: 'Items Ordered', fr: 'Articles commandés', ar: 'العناصر المطلوبة' },
  qty_label: { en: 'Qty:', fr: 'Qté :', ar: 'الكمية:' },
  no_items: { en: 'No items found', fr: 'Aucun article trouvé', ar: 'لم يتم العثور على عناصر' },
  delivery_details: { en: 'Delivery Details', fr: 'Détails de la livraison', ar: 'تفاصيل التسليم' },
  address_label: { en: 'Address', fr: 'Adresse', ar: 'العنوان' },
  dept_label: { en: 'Department', fr: 'Département', ar: 'القسم' },
  handling_label: { en: 'Handling', fr: 'Manutention', ar: 'المناولة' },
  hazmat_handling: { en: 'HAZMAT HANDLING', fr: 'MANUTENTION MATDANG', ar: 'مناولة المواد الخطرة' },
  standard_handling: { en: 'STANDARD HANDLING', fr: 'MANUTENTION STANDARD', ar: 'مناولة قياسية' },
  cost_summary: { en: 'Cost Summary', fr: 'Récapitulatif des coûts', ar: 'ملخص التكلفة' },
  subtotal: { en: 'Subtotal', fr: 'Sous-total', ar: 'المجموع الفرعي' },
  shipping_fee: { en: 'Shipping Fee', fr: 'Frais de livraison', ar: 'رسوم الشحن' },
  tax_label: { en: 'Tax (VAT 19%)', fr: 'Taxe (TVA 19%)', ar: 'الضريبة (19%)' },
  total_paid: { en: 'Total Paid', fr: 'Total payé', ar: 'إجمالي المدفوع' },
  download_invoice: { en: 'Download Invoice', fr: 'Télécharger la facture', ar: 'تحميل الفاتورة' },
  message_vendor: { en: 'Message Vendor', fr: 'Contacter le fournisseur', ar: 'مراسلة البائع' },
};

const getTrackingSteps = (rawOrder: any, t: any) => {
  const s = (rawOrder?.status?.code || 'pending').toLowerCase();
  
  const steps = [
    { id: 1, title: t('order_submitted'), date: moment(rawOrder?.created_at).format('MMM D, hh:mm A'), completed: true },
    { id: 2, title: t('confirmed'), date: ['pending'].includes(s) ? t('pending') : t('completed'), completed: !['pending'].includes(s) },
    { id: 3, title: t('processing'), date: ['processing', 'shipped', 'delivered', 'completed'].includes(s) ? t('completed') : t('pending'), completed: ['processing', 'shipped', 'delivered', 'completed'].includes(s) },
    { id: 4, title: t('shipped'), date: ['shipped', 'delivered', 'completed'].includes(s) ? t('completed') : t('pending'), completed: ['shipped', 'delivered', 'completed'].includes(s) },
    { id: 5, title: t('delivered'), date: ['delivered', 'completed'].includes(s) ? t('completed') : t('pending'), completed: ['delivered', 'completed'].includes(s) },
  ];

  if (s === 'cancelled') {
    steps.push({ id: 6, title: t('cancelled'), date: t('order_cancelled_desc'), completed: true });
  }

  return steps;
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;
  const { order = {
    id: 'ORD-8829',
    status: 'In Progress',
    lab: 'Advanced Bio-Research Lab',
    product: 'Digital LCD Microscope',
    price: '45,000 DA',
    date: 'Oct 24, 2024'
  } } = route.params || {};

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isFocused = useIsFocused();

  const rawOrder = orderDetails || order.original || order;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const targetId = order.original?.id || order.id || order.code;
      if (!targetId || typeof targetId === 'string' && targetId.includes('ORD-')) return;

      setIsLoading(true);
      try {
        const response = await api.get(`${ApiRoutes.orders.index}/${targetId}`);
        setOrderDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchOrderDetails();
    }
  }, [order.id, isFocused]);
  const businessUserId = rawOrder?.products?.[0]?.business?.user_id;

  const handleMessageVendor = async () => {
    if (!businessUserId) {
      Alert.alert(t('error_label'), t('user_not_identified'));
      return;
    }

    setIsMessaging(true);
    try {
      const response = await api.post(ApiRoutes.conversations.store, {
        target_user_id: businessUserId
      });
      const conversation = response?.data;

      if (conversation) {
        navigation.navigate(Routes.ChatDetailScreen, { conversation });
      } else {
        Alert.alert(t('error_label'), t('failed_resolve_conv'));
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      Alert.alert(t('error_label'), t('failed_message_vendor'));
    } finally {
      setIsMessaging(false);
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    // Simulating invoice download
    setTimeout(() => {
      setIsDownloading(false);
      Alert.alert(t('success_label'), t('invoice_downloaded'));
    }, 1500);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{rawOrder?.code || t('order_details')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading && !orderDetails ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: paddingHorizontal, gap: 16 }}>
        {/* Status Stepper */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('tracking_status')}</Text>
          <View style={{ paddingLeft: language === 'ar' ? 0 : 10, paddingRight: language === 'ar' ? 10 : 0 }}>
            {getTrackingSteps(rawOrder, t).map((step, index, array) => (
              <View key={step.id} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 16 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={[
                    { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
                    step.completed ? { backgroundColor: '#10B981', borderColor: '#10B981' } : { backgroundColor: '#FFF', borderColor: '#E2E8F0' }
                  ]}>
                    {step.completed && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>✓</Text>}
                  </View>
                  {index < array.length - 1 && (
                    <View style={[
                      { width: 2, flex: 1, marginVertical: 4 },
                      step.completed && array[index + 1].completed ? { backgroundColor: '#10B981' } : { backgroundColor: '#E2E8F0' }
                    ]} />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: 24, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={[{ fontSize: 15, fontWeight: '700', color: '#1E293B' }, !step.completed && { color: '#94A3B8' }]}>{step.title}</Text>
                  <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '500', marginTop: 2 }}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Product Details */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('items_ordered')} ({rawOrder.products?.length || 0})</Text>
          <View style={{ gap: 16 }}>
            {rawOrder.products?.map((product: any, index: number) => (
              <View key={product.id} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 16, borderBottomWidth: index === rawOrder.products.length - 1 ? 0 : 1, borderBottomColor: '#F1F5F9', paddingBottom: index === rawOrder.products.length - 1 ? 0 : 16 }}>
                <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                    {product.images?.[0]?.url ? (
                        <Image source={{ uri: product.images[0].url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 32 }}>📦</Text>
                        </View>
                    )}
                </View>
                <View style={{ flex: 1, gap: 2, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#137FEC' }}>{product.business?.name}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{product.name}</Text>
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, width: '100%' }}>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '800' }}>{t('qty_label')} {product.pivot?.quantity || 1}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#111' }}>{(product.pivot?.price || product.price).toLocaleString()} DA</Text>
                  </View>
                </View>
              </View>
            )) || (
              <Text style={{ color: '#94A3B8', textAlign: 'center' }}>{t('no_items')}</Text>
            )}
          </View>
        </View>

        {/* Delivery Information */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('delivery_details')}</Text>
          <View style={{ gap: 16 }}>
            <View style={{ gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('address_label')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{rawOrder?.shipping_address || 'N/A'}</Text>
            </View>
            <View style={{ gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('dept_label')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{rawOrder?.department || 'N/A'}</Text>
            </View>
            <View style={{ gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('handling_label')}</Text>
              <View style={{ alignSelf: language === 'ar' ? 'flex-end' : 'flex-start', backgroundColor: rawOrder?.is_hazmat ? '#FEF2F2' : '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 2 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: rawOrder?.is_hazmat ? '#EF4444' : '#16A34A' }}>
                  {rawOrder?.is_hazmat ? t('hazmat_handling') : t('standard_handling')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('cost_summary')}</Text>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('subtotal')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
                {(rawOrder.total_price - (rawOrder.shipping_fee || 0) - (rawOrder.tax || 0)).toLocaleString()} DA
              </Text>
            </View>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('shipping_fee')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{(rawOrder.shipping_fee || 0).toLocaleString()} DA</Text>
            </View>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('tax_label')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{(rawOrder.tax || 0).toLocaleString()} DA</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{t('total_paid')}</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111' }}>{rawOrder?.total_price?.toLocaleString()} DA</Text>
            </View>
          </View>
        </View>
        {/* Actions */}
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, marginTop: 8 }}>
          <TouchableOpacity
            style={[{ flex: 1, height: 52, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }, isDownloading && { opacity: 0.7 }]}
            onPress={handleDownloadInvoice}
            disabled={isDownloading}
          >
            {isDownloading ? <ActivityIndicator size="small" color="#137FEC" /> : <Text style={{ fontSize: 14, fontWeight: '700', color: '#475569' }}>{t('download_invoice')}</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ flex: 1.2, height: 52, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }, isMessaging && { opacity: 0.7 }]}
            onPress={handleMessageVendor}
            disabled={isMessaging}
          >
            {isMessaging ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>{t('message_vendor')}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}
    </ScreenWrapper>
  );
}

