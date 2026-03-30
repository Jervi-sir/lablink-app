import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, TextInput, Switch, Dimensions, Platform, ActivityIndicator, Alert, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { useState, useCallback, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { Routes } from "@/utils/helpers/routes";
import { useAuthStore } from "@/zustand/auth-store";
import { useLanguageStore } from "@/zustand/language-store";

const { width } = Dimensions.get('window');

// No step-based constants needed now


const translations = {
  checkout: { en: 'Checkout', fr: 'Paiement', ar: 'الدفع' },
  delivery_location: { en: 'Delivery Location', fr: 'Lieu de livraison', ar: 'موقع التسليم' },
  where_send: { en: 'Where should we send the equipment?', fr: 'Où devons-nous envoyer l\'équipement ?', ar: 'أين يجب أن نرسل المعدات؟' },
  full_address: { en: 'Full Address / Campus Location *', fr: 'Adresse complète / Emplacement du campus *', ar: 'العنوان الكامل / موقع الحرم الجامعي *' },
  address_placeholder: { en: 'e.g. Building B, Room 302...', fr: 'ex. Bâtiment B, Bureau 302...', ar: 'مثلاً المبنى ب، الغرفة 302...' },
  department_faculty: { en: 'Department / Faculty', fr: 'Département / Faculté', ar: 'القسم / الكلية' },
  dept_placeholder: { en: 'e.g. Biological Sciences', fr: 'ex. Sciences biologiques', ar: 'مثلاً العلوم البيولوجية' },
  contact_phone: { en: 'Contact Phone', fr: 'Téléphone de contact', ar: 'هاتف التواصل' },
  hazardous_materials: { en: 'Hazardous Materials', fr: 'Matières dangereuses', ar: 'مواد خطرة' },
  hazmat_desc: { en: 'Requires specialized handling & safety documentation.', fr: 'Nécessite une manipulation spécialisée et une documentation de sécurité.', ar: 'يتطلب معالجة متخصصة ووثائق سلامة.' },
  review_order: { en: 'Review Order', fr: 'Vérifier la commande', ar: 'مراجعة الطلب' },
  order_summary: { en: 'Order Summary', fr: 'Résumé de la commande', ar: 'ملخص الطلب' },
  equipment: { en: 'Equipment', fr: 'Équipement', ar: 'معدات' },
  subtotal: { en: 'Subtotal', fr: 'Sous-total', ar: 'المجموع الفرعي' },
  shipping_handling: { en: 'Shipping & Handling', fr: 'Expédition et manutention', ar: 'الشحن والتداول' },
  vat: { en: 'VAT (19%)', fr: 'TVA (19%)', ar: 'ضريبة القيمة المضافة (19%)' },
  total_amount: { en: 'Total Amount', fr: 'Montant total', ar: 'المبلغ الإجمالي' },
  delivery_details: { en: 'Delivery Details', fr: 'Détails de livraison', ar: 'تفاصيل التسليم' },
  edit: { en: 'Edit', fr: 'Modifier', ar: 'تعديل' },
  address: { en: 'Address', fr: 'Adresse', ar: 'العنوان' },
  dept: { en: 'Dept.', fr: 'Dépt.', ar: 'القسم' },
  phone: { en: 'Phone', fr: 'Tél.', ar: 'الهاتف' },
  hazmat_handling: { en: 'Hazardous Materials Handling', fr: 'Manipulation de matières dangereuses', ar: 'معالجة المواد الخطرة' },
  payment: { en: 'Payment', fr: 'Paiement', ar: 'الدفع' },
  pay_on_delivery: { en: 'Pay on delivery', fr: 'Payer à la livraison', ar: 'الدفع عند الاستلام' },
  terms_safety: { en: 'Terms & Safety', fr: 'Conditions et sécurité', ar: 'الشروط والسلامة' },
  terms_desc: { en: 'By submitting, you agree to the laboratory\'s handling policies and safety protocols.', fr: 'En soumettant, vous acceptez les politiques de manipulation et les protocoles de sécurité du laboratoire.', ar: 'من خلال الإرسال، فإنك توافق على سياسات المعالجة وبروتوكولات السلامة الخاصة بالمختبر.' },
  placing_order: { en: 'Placing Order...', fr: 'Commande en cours...', ar: 'جاري تقديم الطلب...' },
  confirm_place_order: { en: 'Confirm & Place Order', fr: 'Confirmer et passer la commande', ar: 'تأكيد وتقديم الطلب' },
  missing_address: { en: 'Missing Address', fr: 'Adresse manquante', ar: 'العنوان مفقود' },
  missing_address_desc: { en: 'Please enter a delivery address before submitting.', fr: 'Veuillez saisir une adresse de livraison avant de soumettre.', ar: 'يرجى إدخال عنوان التسليم قبل التقديم.' },
  order_failed: { en: 'Order Failed', fr: 'Échec de la commande', ar: 'فشل الطلب' },
  something_went_wrong: { en: 'Something went wrong. Please try again.', fr: 'Quelque chose s\'est mal passé. Veuillez réessayer.', ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
  order_code: { en: 'Order Code', fr: 'Code de commande', ar: 'رمز الطلب' },
  continue_searching: { en: 'Continue Searching', fr: 'Continuer la recherche', ar: 'متابعة البحث' },
  order_placed_title: { en: '{type} Placed!', fr: '{type} effectuée !', ar: 'تم تقديم {type}!' },
  order_success_desc: { en: 'Your order has been registered successfully. The supplier will process it shortly.', fr: 'Votre commande a été enregistrée avec succès. Le fournisseur la traitera prochainement.', ar: 'تم تسجيل طلبك بنجاح. سيقوم المورد بمعالجته قريباً.' },
  estimation_success_desc: { en: 'Your proposal request has been submitted successfully. You\'ll be notified once it\'s confirmed.', fr: 'Votre demande de proposition a été soumise avec succès. Vous serez informé une fois qu\'elle sera confirmée.', ar: 'تم تقديم طلب المقترح بنجاح. سيتم إخطارك بمجرد تأكيده. ' },
  order_label: { en: 'Order', fr: 'Commande', ar: 'طلب' },
  estimation_label: { en: 'Estimation Request', fr: 'Demande d\'estimation', ar: 'طلب تقدير' },
  total_label: { en: 'Total', fr: 'Total', ar: 'الإجمالي' },
};

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
  const { product, quantity = 1 } = route.params || {};

  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isHazmat, setIsHazmat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const { authType } = useAuthStore();
  const isBusiness = authType === 'business';

  const productOwnerCategory = product?.business?.category?.code;
  const isSupplierProduct = productOwnerCategory === 'supplier';
  const typeLabel = isSupplierProduct ? t('order_label') : t('estimation_label');

  // Form States
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  // Compute prices
  const productPrice = typeof product?.price === 'number' ? product.price : parseFloat(String(product?.price || '0').replace(/[^0-9.]/g, '')) || 0;
  const subtotal = productPrice * quantity;
  const shippingFee = isHazmat ? 2500 : 800;
  const tax = Math.round(subtotal * 0.19);
  const total = subtotal + shippingFee + tax;

  const formatPrice = (price: number) => `${price.toLocaleString()} DA`;

  const canProceedDelivery = address.trim().length > 0;

  const submitOrder = useCallback(async () => {
    if (submitting) return;

    if (!address.trim()) {
      Alert.alert(t('missing_address'), t('missing_address_desc'));
      setIsReviewMode(false);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        shipping_address: address.trim(),
        department: department.trim() || null,
        phone: phone.trim() || null,
        payment_method: paymentMethod,
        is_hazmat: isHazmat,
        products: [
          {
            id: product.id,
            quantity: quantity,
          }
        ],
      };

      const response = await api.post(buildRoute(ApiRoutes.orders.store), payload);

      if (response && response.data) {
        setPlacedOrder(response.data);
        setOrderPlaced(true);
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const message =
        error?.response?.data?.message
        || error?.message
        || t('something_went_wrong');
      Alert.alert(t('order_failed'), message);
    } finally {
      setSubmitting(false);
    }
  }, [address, department, phone, paymentMethod, isHazmat, product, quantity, submitting]);

  // ── Success Screen ──
  if (orderPlaced) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          {/* Success Circle */}
          <View style={{
            width: 100, height: 100, borderRadius: 50, backgroundColor: '#E9F7EF',
            justifyContent: 'center', alignItems: 'center', marginBottom: 24,
            shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 6,
          }}>
            <Text style={{ fontSize: 44 }}>✓</Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: '900', color: '#111', textAlign: 'center' }}>
            {t('order_placed_title', { type: typeLabel })}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            {isSupplierProduct
              ? t('order_success_desc')
              : t('estimation_success_desc')
            }
          </Text>

          <Confetti />

          {placedOrder?.code && (
            <View style={{
              marginTop: 24, backgroundColor: '#FFF', borderRadius: 16, padding: 16, width: '100%',
              borderWidth: 1, borderColor: '#F1F5F9',
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
            }}>
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>{t('order_code')}</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#137FEC', letterSpacing: 1 }}>{placedOrder.code}</Text>
              </View>
              {placedOrder.total_price && (
                <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8' }}>{t('total_label')}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#111' }}>{formatPrice(parseFloat(placedOrder.total_price))}</Text>
                </View>
              )}
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 32, width: '100%' }}>
            <TouchableOpacity
              style={{
                flex: 1, height: 54, backgroundColor: '#137FEC', borderRadius: 14,
                justifyContent: 'center', alignItems: 'center',
                shadowColor: "#137FEC", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
              }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>{t('continue_searching')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // Step Indicator Removed


  // ── Step 1: Delivery ──
  const renderDeliveryStep = () => (
    <View style={{ padding: 20, gap: 20 }}>
      <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('delivery_location')}</Text>
        <Text style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('where_send')}</Text>

        <View style={{ marginTop: 20, gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('full_address')}</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: address.trim() ? '#137FEC' : '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
              placeholder={t('address_placeholder')}
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('department_faculty')}</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
              placeholder={t('dept_placeholder')}
              value={department}
              onChangeText={setDepartment}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B', marginLeft: language === 'ar' ? 0 : 4, marginRight: language === 'ar' ? 4 : 0, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('contact_phone')}</Text>
            <TextInput
              style={{ height: 52, backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 16, fontSize: 15, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0', textAlign: language === 'ar' ? 'right' : 'left' }}
              placeholder="+213 --- -- -- --"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: '#FEF2F2', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#FEE2E2' }}>
        <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>☢️</Text>
          </View>
          <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#991B1B' }}>{t('hazardous_materials')}</Text>
            <Text style={{ fontSize: 12, color: '#B91C1C', marginTop: 2, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('hazmat_desc')}</Text>
          </View>
          <Switch
            value={isHazmat}
            onValueChange={setIsHazmat}
            trackColor={{ false: "#E2E8F0", true: "#EF4444" }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          height: 58, backgroundColor: canProceedDelivery ? '#137FEC' : '#94A3B8', borderRadius: 16,
          justifyContent: 'center', alignItems: 'center', marginTop: 10,
          shadowColor: "#137FEC", shadowOffset: { width: 0, height: 8 }, shadowOpacity: canProceedDelivery ? 0.2 : 0, shadowRadius: 12, elevation: canProceedDelivery ? 4 : 0,
        }}
        onPress={() => canProceedDelivery && setIsReviewMode(true)}
        disabled={!canProceedDelivery}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>{t('review_order')}</Text>
      </TouchableOpacity>
    </View>
  );



  // ── Step 3: Review ──
  const renderReviewStep = () => {
    const labName = product?.business?.name || product?.lab || 'Facility';

    return (
      <View style={{ padding: 20, gap: 20 }}>
        {/* Order Item */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('order_summary')}</Text>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', marginTop: 16, gap: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
            <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 28 }}>🔬</Text>
            </View>
            <View style={{ flex: 1, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }} numberOfLines={2}>{product?.name || t('equipment')}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600', textAlign: language === 'ar' ? 'right' : 'left' }}>{labName}</Text>
              <Text style={{ fontSize: 13, color: '#137FEC', fontWeight: '700', marginTop: 4 }}>Qty: {quantity}</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E293B' }}>{formatPrice(productPrice)}</Text>
          </View>

          {/* Pricing Breakdown */}
          <View style={{ marginTop: 20, gap: 12 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('subtotal')}</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('shipping_handling')}</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(shippingFee)}</Text>
            </View>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>{t('vat')}</Text>
              <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '700' }}>{formatPrice(tax)}</Text>
            </View>
            <View style={{ marginTop: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>{t('total_amount')}</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>{t('delivery_details')}</Text>
            <TouchableOpacity onPress={() => setIsReviewMode(false)}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#137FEC' }}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 16, gap: 10 }}>
            <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('address')}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{address}</Text>
            </View>
            {department ? (
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('dept')}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{department}</Text>
              </View>
            ) : null}
            {phone ? (
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#94A3B8', width: 80, textAlign: language === 'ar' ? 'right' : 'left' }}>{t('phone')}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>{phone}</Text>
              </View>
            ) : null}
            {isHazmat && (
              <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 13 }}>☢️</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>{t('hazmat_handling')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method - Fixed to Payment on delivery */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>{t('payment')}</Text>
          </View>
          <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 12, backgroundColor: '#F0F7FF', borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
            <Text style={{ fontSize: 20 }}>🏦</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>{t('pay_on_delivery')}</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B', textAlign: language === 'ar' ? 'right' : 'left' }}>{t('terms_safety')}</Text>
          <View style={{ padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginTop: 12 }}>
            <Text style={{ fontSize: 13, color: '#64748B', lineHeight: 18, fontWeight: '500', textAlign: 'center' }}>{t('terms_desc')}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            {
              height: 58, backgroundColor: '#10B981', borderRadius: 16,
              justifyContent: 'center', alignItems: 'center', marginTop: 10,
              shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
              flexDirection: 'row', gap: 8,
            },
            submitting && { opacity: 0.7 },
          ]}
          onPress={submitOrder}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>{t('placing_order')}</Text>
            </>
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFF' }}>{t('confirm_place_order')}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <View style={{ height: 60, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
        <TouchableOpacity
          style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => isReviewMode ? setIsReviewMode(false) : navigation.goBack()}
        >
          <View style={{ transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }] }}>
            <ArrowIcon size={22} color="#111" />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center' }}>{t('checkout')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {!isReviewMode ? renderDeliveryStep() : renderReviewStep()}
      </ScrollView>
    </ScreenWrapper>
  );
}

const ConfettiPiece = ({ index }: { index: number }) => {
  const x = useSharedValue(Math.random() * width);
  const y = useSharedValue(-20);
  const rotation = useSharedValue(Math.random() * 360);
  const color = ['#137FEC', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5];

  useEffect(() => {
    y.value = withDelay(
      index * 50,
      withTiming(Dimensions.get('window').height + 100, {
        duration: 2500 + Math.random() * 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    rotation.value = withTiming(rotation.value + 720, { duration: 3000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 12,
          backgroundColor: color,
          borderRadius: 2,
          zIndex: 999,
        },
        animatedStyle,
      ]}
    />
  );
};

const Confetti = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="none">
      {[...Array(40)].map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

