import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import api from '@/utils/api/axios-instance';
import { ApiRoutes, buildRoute } from '@/utils/api/api';
import { useAuthStore } from '@/zustand/auth-store';

// ─── Configure notification handler ───────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Registration ─────────────────────────────────────────
function handleRegistrationError(errorMessage: string) {
  console.warn('[PushNotifications]', errorMessage);
  // Don't throw — we don't want a failed push registration to crash the app
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('[PushNotifications] ❌ Not a physical device — push tokens only work on real devices');
    return undefined;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[PushNotifications] ❌ Permission not granted:', finalStatus);
    return undefined;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? 
    Constants?.easConfig?.projectId ??
    Constants?.projectId;

  console.log('[PushNotifications] projectId:', projectId);

  if (!projectId) {
    console.warn('[PushNotifications] ❌ Project ID not found. Ensure it is defined in app.json.');
    return undefined;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log('[PushNotifications] ✅ Token:', pushTokenString);
    return pushTokenString;
  } catch (e: any) {
    console.warn('[PushNotifications] ❌ Failed to get push token:', e.message || e);
    return undefined;
  }
}



// ─── Send token to backend ────────────────────────────────
export async function sendPushTokenToServer(token: string): Promise<void> {
  try {
    const user = useAuthStore.getState().user;
    const route = user?.type === 'lab' 
      ? ApiRoutes.auth.business.pushToken 
      : ApiRoutes.auth.student.pushToken;

    await api.post(buildRoute(route), {
      expo_push_token: token,
    });
    console.log('[PushNotifications] Token sent to server');
  } catch (error: any) {
    console.error('[PushNotifications] Failed to send token:', error?.response?.data || error.message);
  }
}

// ─── Combined: register + send ────────────────────────────
export async function registerAndSyncPushToken(): Promise<string | undefined> {
  const token = await registerForPushNotificationsAsync();
  console.log("token:", JSON.stringify(token, null, 2));
  if (token) {
    await sendPushTokenToServer(token);
  }
  return token;
}

// ─── Send test notification (via Expo push API) ───────────
export async function sendTestPushNotification(expoPushToken: string): Promise<void> {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'LabLink Notification',
    body: 'Push notifications are working! 🎉',
    data: { type: 'test' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// ─── Notification listeners ───────────────────────────────
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
