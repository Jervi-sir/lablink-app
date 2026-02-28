import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "@/assets/icons/arrow-icon";
import { useState, useEffect } from "react";
import { OptionWithSwitch } from "../../../student/components/options/option-with-switch";
import {
  registerForPushNotificationsAsync,
  sendPushTokenToServer,
  sendTestPushNotification,
} from "@/utils/notifications/push-notifications";
import * as Notifications from 'expo-notifications';
import api from "@/utils/api/axios-instance";
import { ApiRoutes, buildRoute } from "@/utils/api/api";
import { paddingHorizontal } from "@/utils/variables/styles";

type NotificationSettings = {
  enabled: boolean;
  enableOrderStatusUpdates: boolean;
  enableChatMessages: boolean;
  enablePromotions: boolean;
  expoPushToken: string | null;
};

export default function BusinessNotificationsScreen() {
  const navigation = useNavigation();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    enableOrderStatusUpdates: true,
    enableChatMessages: true,
    enablePromotions: false,
    expoPushToken: null,
  });

  // Fetch settings from server + check device permission
  useEffect(() => {
    const init = async () => {
      try {
        // Fetch saved settings from server
        const res = await api.get(buildRoute(ApiRoutes.auth.business.notificationSettings));
        if (res?.settings) {
          setSettings(res.settings);
        }

        // Check device permission
        const { status } = await Notifications.getPermissionsAsync();
        setPushEnabled(status === 'granted');

        if (status === 'granted') {
          const token = await registerForPushNotificationsAsync();
          if (token) setPushToken(token);
        }
      } catch (err) {
        console.error('[BusinessNotificationsScreen] Init error:', err);
      }
      setLoading(false);
    };
    init();
  }, []);

  // Update a single setting on the server
  const updateSetting = async (key: string, value: boolean) => {
    try {
      const res = await api.put(buildRoute(ApiRoutes.auth.business.notificationSettings), {
        [key]: value,
      });
      if (res?.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error('[BusinessNotificationsScreen] Update error:', err);
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
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive push notifications.',
          [{ text: 'OK' }]
        );
      }
    } else {
      await updateSetting('enabled', false);
      setSettings(prev => ({ ...prev, enabled: false }));
    }
  };

  return (
    <ScreenWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: paddingHorizontal }}>
        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <ArrowIcon size={24} color="#111" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : (
        <View style={{ padding: paddingHorizontal }}>
          {/* Push Notification Status */}
          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>Push Notifications</Text>

            <OptionWithSwitch
              label="Enable Push Notifications"
              value={pushEnabled && settings.enabled}
              onValueChange={handleTogglePush}
            />
          </View>

          {/* Notification Categories */}
          <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>Categories</Text>

            <OptionWithSwitch
              label="Order Status Updates"
              value={settings.enableOrderStatusUpdates}
              onValueChange={(v) => {
                setSettings(prev => ({ ...prev, enableOrderStatusUpdates: v }));
                updateSetting('enable_order_status_updates', v);
              }}
            />
            <OptionWithSwitch
              label="New Chat Messages"
              value={settings.enableChatMessages}
              onValueChange={(v) => {
                setSettings(prev => ({ ...prev, enableChatMessages: v }));
                updateSetting('enable_chat_messages', v);
              }}
            />
            <OptionWithSwitch
              label="New Inventory & Promotions"
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
