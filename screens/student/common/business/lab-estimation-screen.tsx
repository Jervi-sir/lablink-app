import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { useLabCartStore } from "@/screens/student/zustand/lab-cart-store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, TextInput, View } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  missing_details: { en: 'Missing details', fr: 'Détails manquants', ar: 'تفاصيل ناقصة' },
  missing_details_desc: { en: 'Please add a phone number or address so the lab can reach you.', fr: 'Veuillez ajouter un numéro de téléphone ou une adresse pour que le labo puisse vous joindre.', ar: 'المرجو إضافة رقم هاتف أو عنوان ليتمكن المختبر من التواصل معك.' },
  failed_to_send: { en: 'Failed to send estimation request.', fr: 'Échec de l\'envoi de la demande d\'estimation.', ar: 'فشل إرسال طلب التقدير.' },
  request_failed: { en: 'Request failed', fr: 'Échec de la demande', ar: 'فشل الطلب' },
  request_sent: { en: 'Request sent', fr: 'Demande envoyée', ar: 'تم إرسال الطلب' },
  request_received: { en: 'received your estimation request with the selected products and services.', fr: 'a reçu votre demande d\'estimation avec les produits et services sélectionnés.', ar: 'تلقى طلب التقدير الخاص بك مع المنتجات والخدمات المختارة.' },
  request_code: { en: 'Request Code', fr: 'Code de la demande', ar: 'رمز الطلب' },
  items: { en: 'Items', fr: 'Articles', ar: 'العناصر' },
  back_to_labs: { en: 'Back to labs', fr: 'Retour aux laboratoires', ar: 'العودة للمختبرات' },
  finalize_request: { en: 'Finalize Request', fr: 'Finaliser la demande', ar: 'إنهاء الطلب' },
  cart_empty: { en: 'Your lab cart is empty', fr: 'Votre panier de laboratoire est vide', ar: 'سلة المختبر فارغة' },
  cart_empty_desc: { en: 'Add products or services from a single lab, then come back here to send the estimation request.', fr: 'Ajoutez des produits ou services d\'un seul laboratoire, puis revenez ici pour envoyer la demande d\'estimation.', ar: 'أضف منتجات أو خدمات من مختبر واحد، ثم عد هنا لإرسال طلب التقدير.' },
  go_back: { en: 'Go back', fr: 'Retourner', ar: 'العودة' },
  lab_cart: { en: 'Lab Cart', fr: 'Panier Labo', ar: 'سلة المختبر' },
  cart_desc: { en: 'Review your selected products and services, then send one estimation request to this lab.', fr: 'Vérifiez vos produits et services sélectionnés, puis envoyez une demande d\'estimation à ce laboratoire.', ar: 'راجع المنتجات والخدمات المختارة، ثم أرسل طلب تقدير واحد لهذا المختبر.' },
  selected_items_label: { en: 'Selected items', fr: 'Articles sélectionnés', ar: 'العناصر المختارة' },
  remove: { en: 'Remove', fr: 'Supprimer', ar: 'إزالة' },
  contact_details: { en: 'Contact details', fr: 'Coordonnées', ar: 'تفاصيل الاتصال' },
  address_placeholder: { en: 'Campus address or preferred delivery point', fr: 'Adresse du campus ou point de livraison préféré', ar: 'عنوان الحرم الجامعي أو نقطة التسليم المفضلة' },
  department_placeholder: { en: 'Department or faculty', fr: 'Département ou faculté', ar: 'القسم أو الكلية' },
  phone_placeholder: { en: 'Phone number', fr: 'Numéro de téléphone', ar: 'رقم الهاتف' },
  notes_placeholder: { en: 'Add experiment context, specs, preferred timeline, or anything the lab should know', fr: 'Ajoutez le contexte de l\'expérience, les spécifications, le calendrier préféré ou tout ce que le laboratoire devrait savoir.', ar: 'أضف سياق التجربة، المواصفات، الجدول الزمني المفضل، أو أي شيء يجب أن يعرفه المختبر.' },
  request_recap: { en: 'Request recap', fr: 'Récapitulatif de la demande', ar: 'ملخص الطلب' },
  total_items: { en: 'Total items', fr: 'Total des articles', ar: 'إجمالي العناصر' },
  sending_request: { en: 'Sending request...', fr: 'Envoi de la demande...', ar: 'جاري إرسال الطلب...' },
  send_estimation_request: { en: 'Send estimation request', fr: 'Envoyer la demande d\'estimation', ar: 'إرسال طلب التقدير' },
};

export default function LabEstimationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];
  const { businessId } = route.params || {};

  const carts = useLabCartStore((state) => state.carts);
  const currentCart = carts[Number(businessId)];
  const business = currentCart?.business;
  const items = currentCart?.items || [];

  const updateQuantity = useLabCartStore((state) => state.updateQuantity);
  const removeItem = useLabCartStore((state) => state.removeItem);
  const clearCart = useLabCartStore((state) => state.clearCart);

  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);

  const itemCount = useMemo(
    () => items.reduce((total: number, item: any) => total + item.quantity, 0),
    [items]
  );

  const submitRequest = async () => {
    if (!business || items.length === 0 || submitting) {
      return;
    }

    if (!phone.trim() && !address.trim()) {
      Alert.alert(t('missing_details'), t('missing_details_desc'));
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(buildRoute(ApiRoutes.estimationRequests.store), {
        business_id: business.id,
        address: address.trim() || null,
        department: department.trim() || null,
        phone: phone.trim() || null,
        notes: notes.trim() || null,
        items: items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });

      if (response?.data) {
        setSubmittedRequest(response.data);
        if (business) clearCart(business.id);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('failed_to_send');
      Alert.alert(t('request_failed'), message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRequest) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>✓</Text>
          </View>
          <Text style={{ marginTop: 24, fontSize: 24, fontWeight: '900', color: '#0F172A' }}>{t('request_sent')}</Text>
          <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center', fontWeight: '600' }}>
            {business?.name || 'The lab'} {t('request_received')}
          </Text>
          <View style={{ width: '100%', marginTop: 24, backgroundColor: '#FFF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#E2E8F0' }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>{t('request_code')}</Text>
              <Text style={{ fontSize: 14, color: '#137FEC', fontWeight: '900' }}>{submittedRequest.code}</Text>
            </View>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>{t('items')}</Text>
              <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '800' }}>{submittedRequest.itemCount}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ marginTop: 28, height: 54, width: '100%', borderRadius: 16, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF' }}>{t('back_to_labs')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>{t('finalize_request')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {!business || items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center' }}>{t('cart_empty')}</Text>
          <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 22, color: '#64748B', textAlign: 'center' }}>
            {t('cart_empty_desc')}
          </Text>
          <TouchableOpacity
            style={{ marginTop: 24, height: 50, paddingHorizontal: 24, borderRadius: 14, backgroundColor: '#137FEC', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFF' }}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
            <View style={{ backgroundColor: '#0F172A', borderRadius: 24, padding: 20, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#93C5FD', textTransform: 'uppercase' }}>{t('lab_cart')}</Text>
              <Text style={{ marginTop: 8, fontSize: 24, fontWeight: '900', color: '#FFF', textAlign: language === 'ar' ? 'right' : 'left' }}>{business.name}</Text>
              <Text style={{ marginTop: 6, fontSize: 14, lineHeight: 22, color: '#CBD5E1', fontWeight: '600', textAlign: language === 'ar' ? 'right' : 'left' }}>
                {t('cart_desc')}
              </Text>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('selected_items_label')}</Text>
              <View style={{ marginTop: 16, gap: 14 }}>
                {items.map((item: any) => (
                  <View key={item.productId} style={{ borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 18, padding: 16 }}>
                    <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: 12 }}>
                      <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{item.name}</Text>
                        <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'capitalize' }}>
                          {item.productType}{item.unit ? ` • ${item.unit}` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => business && removeItem(business.id, item.productId)}>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#EF4444' }}>{t('remove')}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 14, flexDirection: language === 'ar' ? 'row' : 'row-reverse', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 4 }}>
                        <TouchableOpacity pressGuardMode="off" style={{ width: 36, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => business && updateQuantity(business.id, item.productId, item.quantity - 1)}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ width: 28, textAlign: 'center', fontSize: 15, fontWeight: '800', color: '#0F172A' }}>{item.quantity}</Text>
                        <TouchableOpacity pressGuardMode="off" style={{ width: 36, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => business && updateQuantity(business.id, item.productId, item.quantity + 1)}>
                          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('contact_details')}</Text>
              <View style={{ marginTop: 16, gap: 14 }}>
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}
                  placeholder={t('address_placeholder')}
                  placeholderTextColor="#94A3B8"
                  value={address}
                  onChangeText={setAddress}
                />
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}
                  placeholder={t('department_placeholder')}
                  placeholderTextColor="#94A3B8"
                  value={department}
                  onChangeText={setDepartment}
                />
                <TextInput
                  style={{ minHeight: 54, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}
                  placeholder={t('phone_placeholder')}
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <TextInput
                  style={{ minHeight: 120, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 16, paddingTop: 16, color: '#0F172A', textAlignVertical: 'top', textAlign: language === 'ar' ? 'right' : 'left' }}
                  placeholder={t('notes_placeholder')}
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            <View style={{ marginTop: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('request_recap')}</Text>
              <View style={{ marginTop: 16, gap: 12 }}>
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>{t('total_items')}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#0F172A' }}>{itemCount}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20 }}>
            <TouchableOpacity
              style={{ height: 56, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8, opacity: submitting ? 0.8 : 1 }}
              onPress={submitRequest}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator size="small" color="#FFF" /> : null}
              <Text style={{ fontSize: 16, fontWeight: '900', color: '#FFF' }}>{submitting ? t('sending_request') : t('send_estimation_request')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}
