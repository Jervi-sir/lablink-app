import { ScreenWrapper } from "@/components/screen-wrapper";
import Text from "@/components/text";
import TouchableOpacity from "@/components/touchable-opacity";
import { View, ScrollView, Dimensions, Platform, ActivityIndicator, RefreshControl, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "@/utils/helpers/routes";
import { OptionSettings } from "../../../components/options/option-settings";
import { useEffect, useState, useCallback, useRef } from "react";
import { SheetManager } from "react-native-actions-sheet";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paddingHorizontal } from "@/utils/variables/styles";
import { useLanguageStore } from "@/zustand/language-store";

export default function StudentM5Navigation() {
  const navigation = useNavigation<any>();
  const { language } = useLanguageStore();
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState<any>({ orders: 0, saved_products: 0, saved_laboratories: 0, followed_facilities: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfileAndStats = useCallback(async () => {
    try {
      const [profileRes, statsRes]: any = await Promise.all([
        api.get(ApiRoutes.auth.student.me),
        api.get(ApiRoutes.stats)
      ]);
      setStudent(profileRes.user?.studentProfile || null);
      setStats(statsRes || { orders: 0, saved_products: 0, saved_laboratories: 0, followed_facilities: 0 });
    } catch (error) {
      console.error("Error fetching profile/stats:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndStats();
  }, [fetchProfileAndStats]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProfileAndStats();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({
        index: 0,
        routes: [{ name: Routes.AuthSelectorScreen }],
      });
      await api.post(ApiRoutes.auth.student.logout).catch(() => { });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const translations = {
    language: { en: 'Language', fr: 'Langue', ar: 'اللغة' },
    en: 'English',
    fr: 'Français',
    ar: 'العربية',
    saved_products: { en: 'Saved Products', fr: 'Produits enregistrés', ar: 'المنتجات المحفوظة' },
    saved_labs: { en: 'Saved Laboratories', fr: 'Laboratoires enregistrés', ar: 'المختبرات المحفوظة' },
    followed: { en: 'Followed Facilities', fr: 'Établissements suivis', ar: 'المرافق المتابعة' },
    edit_profile: { en: 'Edit Profile', fr: 'Modifier le profil', ar: 'تعديل الملف الشخصي' },
    notifications: { en: 'Notifications', fr: 'Notifications', ar: 'التنبيهات' },
    privacy: { en: 'Privacy & Security', fr: 'Confidentialité et sécurité', ar: 'الخصوصية والأمان' },
    help: { en: 'Help & Support', fr: 'Aide et support', ar: 'المساعدة والدعم' },
    my_collections: { en: 'My COLLECTIONS', fr: 'Mes COLLECTIONS', ar: 'مجموعاتي' },
    account_settings: { en: 'Account Settings', fr: 'Paramètres du compte', ar: 'إعدادات الحساب' },
    logout: { en: 'Log Out Account', fr: 'Se déconnecter', ar: 'تسجيل الخروج' },
    orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
    saved: { en: 'Saved', fr: 'Enregistré', ar: 'المحفوظة' },
    following: { en: 'Following', fr: 'Suivi', ar: 'المتابعة' },
    researcher: { en: 'Laboratory Researcher', fr: 'Chercheur en laboratoire', ar: 'باحث مختبر' },
    department: { en: 'Department', fr: 'Département', ar: 'القسم' },
  };

  const t = (key: keyof typeof translations) => {
    const val = translations[key];
    if (typeof val === 'string') return val;
    return (val as any)?.[language] || key;
  };

  const MENU_ITEMS = [
    { label: t('saved_products'), onPress: () => navigation.navigate(Routes.StudentSavedProductsScreen), count: stats?.saved_products?.toString() || '0' },
    { label: t('saved_labs'), onPress: () => navigation.navigate(Routes.StudentSavedBusinessesScreen), count: stats?.saved_laboratories?.toString() || '0' },
    { label: t('followed'), onPress: () => navigation.navigate(Routes.StudentFollowedBusinessesScreen), count: stats?.followed_facilities?.toString() || '0' },
  ];

  const SETTINGS_ITEMS = [
    { label: t('edit_profile'), onPress: () => navigation.navigate(Routes.EditProfileScreen) },
    { label: t('notifications'), onPress: () => navigation.navigate(Routes.NotificationsScreen) },
    { label: t('language'), value: t(language as any), onPress: () => navigation.navigate(Routes.LanguageScreen) },
    { label: t('privacy'), onPress: () => navigation.navigate(Routes.PrivacySecurityScreen) },
    { label: t('help'), onPress: () => navigation.navigate(Routes.HelpSupportScreen) },
  ];

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper style={{ backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </ScreenWrapper>
    );
  }

  const studentName = student?.fullName || 'Student';

  return (
    <ScreenWrapper>
      <View style={{ paddingHorizontal: paddingHorizontal }}>
        <View style={{ backgroundColor: '#FFF', padding: paddingHorizontal, paddingTop: 20, borderRadius: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5, zIndex: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>{studentName}</Text>
              <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '600' }}>{student?.studentCardId || `ID - ${t('researcher')}`}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>{student?.department?.name || t('department')}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingVertical: 16 }}>
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.orders || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('orders')}</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.saved_products || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('saved')}</Text>
            </View>
            <View style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
            <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{stats?.followed_facilities || '0'}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>{t('following')}</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: paddingHorizontal, gap: 24 }} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#137FEC']} />}>
        <View style={{ marginTop: 24 }}>
          <OptionSettings title={t('my_collections')} items={MENU_ITEMS} />
        </View>
        <View>
          <OptionSettings title={t('account_settings')} items={SETTINGS_ITEMS} />
        </View>
        <TouchableOpacity style={{ marginTop: 20, height: 56, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.8} onPress={() => {
          SheetManager.show('logout-sheet', { payload: { onLogout: handleLogout } });
        }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#EF4444' }}>{t('logout')}</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94A3B8', fontWeight: '500' }}>LabLink Alpha v0.1.2</Text>
      </ScrollView>
    </ScreenWrapper>
  );
}