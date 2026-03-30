import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect } from "react";
import { OptionWithSwitch } from "../../../../components/options/option-with-switch";
import {
  registerForPushNotificationsAsync,
  sendPushTokenToServer,
  sendTestPushNotification,
} from "@/utils/notifications/push-notifications";
import * as Notifications from 'expo-notifications';
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  notifications: { en: 'Notifications', fr: 'Notifications', ar: 'التنبيهات' },
  push_notifications: { en: 'Push Notifications', fr: 'Notifications Push', ar: 'تنبيهات الهاتف' },
  enable_push: { en: 'Enable Push Notifications', fr: 'Activer les notifications push', ar: 'تفعيل تنبيهات الهاتف' },
  categories: { en: 'Categories', fr: 'Catégories', ar: 'الفئات' },
  order_status: { en: 'Order Status Updates', fr: 'Mises à jour du statut des commandes', ar: 'تحديثات حالة الطلب' },
  chat_messages: { en: 'New Chat Messages', fr: 'Nouveaux messages de discussion', ar: 'رسائل دردشة جديدة' },
  promotions: { en: 'New Inventory & Promotions', fr: 'Nouvel inventaire et promotions', ar: 'منتجات وعروض جديدة' },
  disabled_title: { en: 'Notifications Disabled', fr: 'Notifications désactivées', ar: 'التنبيهات معطلة' },
  disabled_msg: { en: 'Please enable notifications in your device settings to receive push notifications.', fr: 'Veuillez activer les notifications dans les paramètres de votre appareil pour recevoir des notifications push.', ar: 'يرجى تفعيل التنبيهات في إعدادات جهازك لتلقي التنبيهات.' },
  no_token_title: { en: 'No Push Token', fr: 'Pas de jeton push', ar: 'لا يوجد رمز تنبيه' },
  no_token_msg: { en: 'Push notifications are not enabled.', fr: 'Les notifications push ne sont pas activées.', ar: 'تنبيهات الهاتف غير مفعلة.' },
  sent_title: { en: 'Sent!', fr: 'Envoyé !', ar: 'تم الإرسال!' },
  sent_msg: { en: 'A test notification has been sent to your device.', fr: 'Une notification de test a été envoyée à votre appareil.', ar: 'تم إرسال تنبيه تجريبي إلى جهازك.' },
  error: { en: 'Error', fr: 'Erreur', ar: 'خطأ' },
  failed_test: { en: 'Failed to send test notification.', fr: "Échec de l'envoi de la notification de test.", ar: 'فشل إرسال التنبيه التجريبي.' },
};

type NotificationSettings = {
  enabled: boolean;
  enableOrderStatusUpdates: boolean;
  enableChatMessages: boolean;
  enablePromotions: boolean;
  expoPushToken: string | null;
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const language = useLanguageStore((s) => s.language);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const t = (key: keyof typeof translations) => translations[key][language];

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    enableOrderStatusUpdates: true,
    enableChatMessages: true,
    enablePromotions: false,
    expoPushToken: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get(buildRoute(ApiRoutes.auth.student.notificationSettings));
        if (res?.settings) setSettings(res.settings);
        const { status } = await Notifications.getPermissionsAsync();
        setPushEnabled(status === 'granted');
        if (status === 'granted') {
          const token = await registerForPushNotificationsAsync();
          if (token) setPushToken(token);
        }
      } catch (err) {
        console.error('[NotificationsScreen] Init error:', err);
      }
      setLoading(false);
    };
    init();
  }, []);

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const res = await api.put(buildRoute(ApiRoutes.auth.student.notificationSettings), { [key]: value });
      if (res?.settings) setSettings(res.settings);
    } catch (err) {
      console.error('[NotificationsScreen] Update error:', err);
    }
  };

  const handleTogglePush = async (value: boolean) => {
    if (value) {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setPushEnabled(true);
        setPushToken(token);
        await sendPushTokenToServer(token);
        await updateSetting('enabled', true);
      } else {
        Alert.alert(t('disabled_title'), t('disabled_msg'), [{ text: 'OK' }]);
      }
    } else {
      await updateSetting('enabled', false);
      setSettings(prev => ({ ...prev, enabled: false }));
    }
  };

  const handleTestNotification = async () => {
    if (!pushToken) {
      Alert.alert(t('no_token_title'), t('no_token_msg'));
      return;
    }
    try {
      await sendTestPushNotification(pushToken);
      Alert.alert(t('sent_title'), t('sent_msg'));
    } catch {
      Alert.alert(t('error'), t('failed_test'));
    }
  };

  return (
    <ScreenWrapper>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{t('notifications')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#137FEC" />
        </View>
      ) : (
        <View style={{ padding: paddingHorizontal }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: paddingHorizontal, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>{t('push_notifications')}</Text>
            <OptionWithSwitch
              label={t('enable_push')}
              value={pushEnabled && settings.enabled}
              onValueChange={handleTogglePush}
            />
          </View>

          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: paddingHorizontal, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>{t('categories')}</Text>
            <OptionWithSwitch
              label={t('order_status')}
              value={settings.enableOrderStatusUpdates}
              onValueChange={(v) => {
                setSettings(prev => ({ ...prev, enableOrderStatusUpdates: v }));
                updateSetting('enable_order_status_updates', v);
              }}
            />
            <OptionWithSwitch
              label={t('chat_messages')}
              value={settings.enableChatMessages}
              onValueChange={(v) => {
                setSettings(prev => ({ ...prev, enableChatMessages: v }));
                updateSetting('enable_chat_messages', v);
              }}
            />
            <OptionWithSwitch
              label={t('promotions')}
              value={settings.enablePromotions}
              onValueChange={(v) => {
                setSettings(prev => ({ ...prev, enablePromotions: v }));
                updateSetting('enable_promotions', v);
              }}
            />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
