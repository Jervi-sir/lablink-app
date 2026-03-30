import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions } from "react-native";
import { useLanguageStore } from "@/zustand/language-store";

const { width } = Dimensions.get('window');

const translations = {
  notifications: { en: 'Notifications', fr: 'Notifications', ar: 'الإشعارات' },
  mark_all_read: { en: 'Mark all read', fr: 'Tout marquer comme lu', ar: 'تحديد الكل كمقروء' },
  all: { en: 'All', fr: 'Tous', ar: 'الكل' },
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  messages: { en: 'Messages', fr: 'Messages', ar: 'الرسائل' },
  system: { en: 'System', fr: 'Système', ar: 'النظام' },
  today: { en: 'TODAY', fr: 'AUJOURD\'HUI', ar: 'اليوم' },
  yesterday: { en: 'YESTERDAY', fr: 'HIER', ar: 'أمس' },
  home: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
  browse: { en: 'Browse', fr: 'Parcourir', ar: 'تصفح' },
  alerts: { en: 'Alerts', fr: 'Alertes', ar: 'التنبيهات' },
  profile: { en: 'Profile', fr: 'Profil', ar: 'الملف الشخصي' },
};

const NOTIFICATIONS_DATA = [
  {
    section: 'today',
    data: [
      {
        id: '1',
        title: 'Order #123 Shipped',
        message: 'Your glassware kit is on the way. Track your package to see arrival...',
        time: '10m ago',
        type: 'order',
        unread: true,
        iconBg: '#E7F2FD',
        iconColor: '#137FEC'
      },
      {
        id: '2',
        title: 'Lab XYZ Replied',
        message: 'Professor Smith: Please confirm the quantity for the titration...',
        time: '1h ago',
        type: 'message',
        unread: true,
        iconBg: '#F5F3FF',
        iconColor: '#8B5CF6'
      }
    ]
  },
  {
    section: 'yesterday',
    data: [
      {
        id: '3',
        title: 'New Kit Available',
        message: 'Organic Chemistry Set B is now in stock for the upcoming semester.',
        time: '1d ago',
        type: 'system',
        unread: false,
        iconBg: '#E9F7EF',
        iconColor: '#27AE60'
      },
      {
        id: '4',
        title: 'Account Verified',
        message: 'Your student verification was successful. You can now access...',
        time: '2d ago',
        type: 'system',
        unread: false,
        iconBg: '#FFFBEB',
        iconColor: '#F59E0B'
      },
      {
        id: '5',
        title: 'Order #118 Delivered',
        message: 'Package was left at the front desk.',
        time: '5d ago',
        type: 'order',
        unread: false,
        iconBg: '#F3F4F6',
        iconColor: '#6B7280'
      }
    ]
  }
];

export default function NotificationsScreen() {
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key]?.[language] || key;

  const FILTER_TABS = [
    { key: 'all', label: t('all') },
    { key: 'orders', label: t('orders') },
    { key: 'messages', label: t('messages') },
    { key: 'system', label: t('system') },
  ];

  return (
    <ScreenWrapper style={{ backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111' }}>{t('notifications')}</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#137FEC' }}>{t('mark_all_read')}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={{ paddingBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}>
          {FILTER_TABS.map((tab, index) => (
            <TouchableOpacity key={tab.key} style={[
              { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
              index === 0 && { backgroundColor: '#137FEC', borderColor: '#137FEC' }
            ]}>
              <Text style={[
                { fontSize: 14, fontWeight: '600', color: '#5D6575' },
                index === 0 && { color: '#FFF' }
              ]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: '#F8F9FB', paddingBottom: 100 }}>
        {NOTIFICATIONS_DATA.map((section) => (
          <View key={section.section} style={{ paddingTop: 24 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#6B7280', paddingHorizontal: 16, marginBottom: 12, textAlign: language === 'ar' ? 'right' : 'left' }}>{t(section.section as any)}</Text>
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {section.data.map((item) => (
                <TouchableOpacity key={item.id} style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 16, gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 }}>
                  <View style={[{ width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }, { backgroundColor: item.iconBg }]}>
                    <View style={[{ width: 18, height: 14, borderRadius: 2 }, { backgroundColor: item.iconColor }]} />
                  </View>

                  <View style={{ flex: 1, gap: 4, alignItems: language === 'ar' ? 'flex-end' : 'flex-start' }}>
                    <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#111' }}>{item.title}</Text>
                      <View style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>{item.time}</Text>
                        {item.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#137FEC' }} />}
                      </View>
                    </View>
                    <Text style={{ fontSize: 13, color: '#5D6575', lineHeight: 18, fontWeight: '500', textAlign: language === 'ar' ? 'right' : 'left' }} numberOfLines={2}>{item.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Mock */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#FFF', flexDirection: language === 'ar' ? 'row-reverse' : 'row', borderTopWidth: 1, borderTopColor: '#F0F2F5', paddingBottom: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 24, height: 24, backgroundColor: '#9CA3AF', borderRadius: 4 }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#9CA3AF' }}>{t('home')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 24, height: 24, backgroundColor: '#9CA3AF', borderRadius: 4 }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#9CA3AF' }}>{t('browse')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <View style={[{ width: 24, height: 24, backgroundColor: '#9CA3AF', borderRadius: 4 }, { backgroundColor: '#137FEC', position: 'relative' }]}>
            <View style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, backgroundColor: '#FF4D4D', borderRadius: 3, borderWidth: 1, borderColor: '#FFF' }} />
          </View>
          <Text style={[{ fontSize: 11, fontWeight: '600', color: '#9CA3AF' }, { color: '#137FEC' }]}>{t('alerts')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 24, height: 24, backgroundColor: '#9CA3AF', borderRadius: 4 }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#9CA3AF' }}>{t('profile')}</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}