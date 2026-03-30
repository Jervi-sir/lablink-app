import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const { width } = Dimensions.get('window');

const translations = {
  failed_to_load: { en: 'Failed to load estimation details.', fr: 'Échec du chargement des détails de l\'estimation.', ar: 'فشل تحميل تفاصيل التقدير.' },
  error_label: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  user_not_identified: { en: 'Could not identify the business user to start a chat.', fr: 'Impossible d\'identifier l\'utilisateur professionnel pour démarrer une discussion.', ar: 'تعذر تحديد مستخدم العمل لبدء الدردشة.' },
  failed_resolve_conv: { en: 'Failed to resolve conversation.', fr: 'Échec de la résolution de la conversation.', ar: 'فشل في حل المحادثة.' },
  failed_message_vendor: { en: 'Failed to message vendor. Please try again.', fr: 'Échec de l\'envoi du message au fournisseur. Veuillez réessayer.', ar: 'فشل في مراسلة البائع. يرجى المحاولة مرة أخرى.' },
  confirm_order_title: { en: 'Confirm Order', fr: 'Confirmer la commande', ar: 'تأكيد الطلب' },
  confirm_order_desc: { en: 'Are you sure you want to convert this estimation into a formal order? This will finalize the price and create a delivery request.', fr: 'Êtes-vous sûr de vouloir convertir cette estimation en commande formelle ? Cela finalisera le prix et créera une demande de livraison.', ar: 'هل أنت متأكد من رغبتك في تحويل هذا التقدير إلى طلب رسمي؟ سيؤدي ذلك إلى تأكيد السعر وإنشاء طلب تسليم.' },
  cancel: { en: 'Cancel', fr: 'Annuler', ar: 'إلغاء' },
  confirm_order_btn: { en: 'Confirm & Order', fr: 'Confirmer et commander', ar: 'تأكيد وطلب' },
  success_label: { en: 'Success', fr: 'Succès', ar: 'نجاح' },
  order_placed_success: { en: 'Your order has been placed successfully!', fr: 'Votre commande a été passée avec succès !', ar: 'تم وضع طلبك بنجاح!' },
  failed_confirm_quote: { en: 'Failed to confirm quote. Please try again.', fr: 'Échec de la confirmation du devis. Veuillez réessayer.', ar: 'فشل تأكيد الاقتباس. يرجى المحاولة مرة أخرى.' },
  estimation_not_found: { en: 'Estimation not found', fr: 'Estimation non trouvée', ar: 'التقدير غير موجود' },
  go_back: { en: 'Go Back', fr: 'Retourner', ar: 'العودة' },
  request_label: { en: 'Request', fr: 'Demande', ar: 'طلب' },
  current_status: { en: 'Current Status', fr: 'Statut actuel', ar: 'الحالة الحالية' },
  requested_on: { en: 'Requested on', fr: 'Demandé le', ar: 'تاريخ الطلب' },
  laboratory: { en: 'Laboratory', fr: 'Laboratoire', ar: 'المختبر' },
  algeria: { en: 'Algeria', fr: 'Algérie', ar: 'الجزائر' },
  selected_items_label: { en: 'Selected Items', fr: 'Articles sélectionnés', ar: 'العناصر المختارة' },
  items_unit: { en: 'ITEMS', fr: 'ARTICLES', ar: 'عناصر' },
  qty_label: { en: 'Qty:', fr: 'Qté :', ar: 'الكمية:' },
  service_fee: { en: 'Service/Handling Fee', fr: 'Frais de service/manutention', ar: 'رسوم الخدمة/المناولة' },
  grand_total: { en: 'Grand Total Quote', fr: 'Total estimé du devis', ar: 'إجمالي الاقتباس' },
  contact_delivery: { en: 'Contact & Delivery', fr: 'Contact et livraison', ar: 'الاتصال والتسليم' },
  address_label: { en: 'Address', fr: 'Adresse', ar: 'العنوان' },
  phone_label: { en: 'Phone', fr: 'Téléphone', ar: 'الهاتف' },
  dept_label: { en: 'Dept.', fr: 'Dépt.', ar: 'القسم' },
  my_notes: { en: 'My Request Notes', fr: 'Mes notes de demande', ar: 'ملاحظات الطلب الخاصة بي' },
  lab_response: { en: 'Laboratory Response', fr: 'Réponse du laboratoire', ar: 'رد المختبر' },
  message_lab: { en: 'Message Laboratory', fr: 'Envoyer un message au laboratoire', ar: 'مراسلة المختبر' },
  confirm_and_order: { en: 'Confirm & Place Order', fr: 'Confirmer et passer la commande', ar: 'تأكيد وتقديم الطلب' },
};

export default function EstimationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;
  const { estimationId, estimation: navEstimation } = route.params || {};

  const [estimation, setEstimation] = useState<any>(navEstimation || null);
  const [loading, setLoading] = useState(!navEstimation);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchEstimation = useCallback(async () => {
    if (!estimationId && !navEstimation?.id) return;
    const id = estimationId || navEstimation.id;
    
    setLoading(true);
    try {
      const response = await api.get(buildRoute(ApiRoutes.estimationRequests.show, { id }));
      if (response && response.data) {
        setEstimation(response.data);
      }
    } catch (error) {
      console.error("Error fetching estimation detail:", error);
      Alert.alert(t('error_label'), t('failed_to_load'));
    } finally {
      setLoading(false);
    }
  }, [estimationId, navEstimation, t]);

  useEffect(() => {
    if (!navEstimation || estimationId) {
      fetchEstimation();
    }
  }, [fetchEstimation, navEstimation, estimationId]);

  const handleMessageVendor = async () => {
    const businessUserId = estimation?.business?.user_id;
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

  const handleConfirmQuote = async () => {
    Alert.alert(
      t('confirm_order_title'),
      t('confirm_order_desc'),
      [
        { text: t('cancel'), style: "cancel" },
        { 
          text: t('confirm_order_btn'), 
          onPress: async () => {
            setIsConfirming(true);
            try {
              const response = await api.post(buildRoute(ApiRoutes.estimationRequests.show, { id: estimation.id }) + '/confirm');
              if (response && response.data) {
                Alert.alert(t('success_label'), t('order_placed_success'));
                navigation.navigate(Routes.OrderDetailScreen, { order: response.data });
              }
            } catch (error) {
              console.error("Error confirming quote:", error);
              Alert.alert(t('error_label'), t('failed_confirm_quote'));
            } finally {
              setIsConfirming(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#137FEC';
      case 'quoted': return '#137FEC';
      case 'reviewed': return '#8B5CF6';
      case 'cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!estimation) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111' }}>{t('estimation_not_found')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
            <Text style={{ color: '#137FEC', fontWeight: '700' }}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={24} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('request_label')} #{estimation.code}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* Status Card */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('current_status')}</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: getStatusColor(estimation.status), marginTop: 4 }}>
                {estimation.status?.toUpperCase()}
              </Text>
            </View>
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </View>
          </View>
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>{t('requested_on')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
              {new Date(estimation.createdAt).toLocaleDateString(language === 'ar' ? 'ar-DZ' : (language === 'fr' ? 'fr-FR' : 'en-US'), { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Business Info */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('laboratory')}</Text>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
              {estimation.business?.logo ? (
                <Image source={{ uri: estimation.business.logo }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
              ) : (
                <Text style={{ fontSize: 20 }}>🏢</Text>
              )}
            </View>
            <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#111' }}>{estimation.business?.name}</Text>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '600' }}>{estimation.business?.wilaya?.name || t('algeria')}</Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{t('selected_items_label')}</Text>
            <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748B' }}>{estimation.items?.length || 0} {t('items_unit')}</Text>
            </View>
          </View>
          
          <View style={{ gap: 16 }}>
            {estimation.items?.map((item: any) => (
              <View key={item.id} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' }}>
                <View style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
                  {item.productImageUrl ? (
                    <Image source={{ uri: item.productImageUrl }} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                  ) : (
                    <Text style={{ fontSize: 24 }}>🔬</Text>
                  )}
                </View>
                <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{item.productName}</Text>
                  <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 4, width: '100%' }}>
                    <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{t('qty_label')} {item.quantity}</Text>
                    {item.unitPrice && (
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#137FEC' }}>{Number(item.unitPrice).toLocaleString()} DA</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {estimation.extraFee > 0 && (
             <View style={{ marginTop: 12, flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
               <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748B' }}>{t('service_fee')}</Text>
               <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>{Number(estimation.extraFee).toLocaleString()} DA</Text>
             </View>
          )}

          {estimation.estimatedTotal && (
            <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{t('grand_total')}</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#137FEC' }}>{Number(estimation.estimatedTotal).toLocaleString()} DA</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        {(estimation.address || estimation.phone) && (
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 16, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('contact_delivery')}</Text>
            <View style={{ gap: 12 }}>
              {estimation.address && (
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>{t('address_label')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{estimation.address}</Text>
                </View>
              )}
              {estimation.phone && (
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>{t('phone_label')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{estimation.phone}</Text>
                </View>
              )}
              {estimation.department && (
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 70 }}>{t('dept_label')}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{estimation.department}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notes */}
        {estimation.notes && (
          <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('my_notes')}</Text>
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{estimation.notes}</Text>
          </View>
        )}

        {/* Quoting Notes from Lab */}
        {estimation.quotingNotes && (
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#137FEC', marginBottom: 12, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('lab_response')}</Text>
            <Text style={{ fontSize: 14, color: '#1E40AF', lineHeight: 22, fontWeight: '600', textAlign: language === 'ar' ? 'right' : 'left' }}>{estimation.quotingNotes}</Text>
          </View>
        )}

        {/* Message Button */}
        <TouchableOpacity
          style={[{ height: 56, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginTop: 8 }, isMessaging && { opacity: 0.7 }]}
          onPress={handleMessageVendor}
          disabled={isMessaging}
        >
          {isMessaging ? <ActivityIndicator size="small" color="#111" /> : <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B' }}>{t('message_lab')}</Text>}
        </TouchableOpacity>

        {/* Confirm Order Button - ONLY IF QUOTED */}
        {estimation.status === 'quoted' && (
          <TouchableOpacity
            style={[{ height: 56, borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center', marginTop: 12 }, isConfirming && { opacity: 0.7 }]}
            onPress={handleConfirmQuote}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>{t('confirm_and_order')}</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
