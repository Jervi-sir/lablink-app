import api, { apiPublic, setAxiosAuthToken } from '@/utils/api/axios-instance';
import { registerAndSyncPushToken } from '@/utils/notifications/push-notifications';
import { ApiRoutes, buildRoute } from '@/utils/api/api';
import { Routes } from '@/utils/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
  name: string;
  state: string;
  email: string;
  phone: string;
  password: string;
  universityId: string;
  acceptTerms: boolean;
}

import { useAuthStore } from '@/zustand/auth-store';

const inputClassName =
  'rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-right text-base text-slate-900';

export function StudentRegistrationScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    state: '',
    email: 'student@email.com',
    phone: '0550000000',
    password: '',
    universityId: '123456789',
    acceptTerms: false,
  });
  const [showStateOptions, setShowStateOptions] = useState(false);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const response = await apiPublic.get(ApiRoutes.taxonomies, { params: { types: 'wilayas' } });
        setWilayas(response.wilayas);
      } catch (error) {
        console.error('Failed to fetch wilayas:', error);
      } finally {
        setIsLoadingTaxonomies(false);
      }
    };

    fetchTaxonomies();
  }, []);

  const isValid = useMemo(() => {
    return Boolean(
      formData.name.trim() &&
      formData.state &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.password.trim() &&
      formData.universityId.trim() &&
      formData.acceptTerms
    );
  }, [formData]);

  const setField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await apiPublic.post(ApiRoutes.auth.student.register, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        state: formData.state,
        university_id: formData.universityId,
      });

      if (response.status === 'success') {
        const { token, user, student } = response.data;
        setAuth(token, user, student);
        registerAndSyncPushToken();
        navigation.navigate(Routes.StudentNavigation);
      } else {
        Alert.alert('خطأ', response.message || 'فشل التسجيل');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || 'فشل الاتصال بالخادم';
      Alert.alert('خطأ', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-blue-700 px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          className="mb-5 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2"
          onPress={() => navigation.goBack()}>
          <Text className="text-base font-medium text-white">رجوع</Text>
        </Pressable>

        <Text className="text-right text-3xl font-bold text-white">تسجيل طالب / باحث</Text>
        <Text className="mt-2 text-right text-sm text-blue-100">
          Student / Researcher Registration
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-6 pb-10 pt-6"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            الاسم الكامل <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            onChangeText={(value) => setField('name', value)}
            placeholder="أدخل اسمك الكامل"
            placeholderTextColor="#94a3b8"
            textAlign="right"
            value={formData.name}
          />
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            الولاية <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            className={inputClassName}
            disabled={isLoadingTaxonomies}
            onPress={() => setShowStateOptions((current) => !current)}>
            {isLoadingTaxonomies ? (
              <ActivityIndicator color="#2563eb" size="small" />
            ) : (
              <Text
                className={`${formData.state ? 'text-slate-900' : 'text-slate-400'} text-right text-base`}>
                {wilayas.find(w => w.id === formData.state)?.ar || 'اختر الولاية'}
              </Text>
            )}
          </Pressable>

          {showStateOptions ? (
            <View className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {wilayas.map((state) => (
                <Pressable
                  key={state.id}
                  className="border-b border-slate-100 px-4 py-3 last:border-b-0"
                  onPress={() => {
                    setField('state', state.id);
                    setShowStateOptions(false);
                  }}>
                  <Text className="text-right text-base text-slate-700">{state.number} - {state.ar}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            البريد الإلكتروني <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            autoCapitalize="none"
            className={inputClassName}
            keyboardType="email-address"
            onChangeText={(value) => setField('email', value)}
            placeholder="example@university.dz"
            placeholderTextColor="#94a3b8"
            textAlign="left"
            value={formData.email}
          />
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            رقم الهاتف <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            keyboardType="phone-pad"
            onChangeText={(value) => setField('phone', value)}
            placeholder="+213 XXX XXX XXX"
            placeholderTextColor="#94a3b8"
            textAlign="left"
            value={formData.phone}
          />
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            كلمة المرور <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            onChangeText={(value) => setField('password', value)}
            placeholder="********"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            textAlign="left"
            value={formData.password}
          />
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            الرقم التسجيلي الجامعي <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            onChangeText={(value) => setField('universityId', value)}
            placeholder="أدخل الرقم التسجيلي"
            placeholderTextColor="#94a3b8"
            textAlign="right"
            value={formData.universityId}
          />
        </View>

        <View className="flex-row items-start gap-3 rounded-2xl bg-slate-100 px-4 py-4">
          <Switch
            onValueChange={(value) => setField('acceptTerms', value)}
            thumbColor="#ffffff"
            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
            value={formData.acceptTerms}
          />
          <Text className="flex-1 text-right text-sm leading-6 text-slate-700">
            أوافق على جميع بياناتي الشخصية و معالجتها وفقًا للقانون رقم
            {' '} <Text className="font-semibold text-blue-600">18-07</Text>
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className={`mt-2 rounded-[22px] px-5 py-4 ${isValid && !isSubmitting ? 'bg-blue-700' : 'bg-blue-300'}`}
          disabled={!isValid || isSubmitting}
          onPress={handleRegister}
          style={({ pressed }) => ({
            transform: [{ scale: pressed && isValid && !isSubmitting ? 0.98 : 1 }],
            opacity: pressed && isValid && !isSubmitting ? 0.92 : 1,
          })}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">متابعة</Text>
          )}
        </Pressable>
        <View className="mt-4 flex-row items-center justify-center gap-2">
          <Text className="text-slate-600">لديك حساب بالفعل؟</Text>
          <Pressable onPress={() => navigation.navigate(Routes.LoginScreen)}>
            <Text className="font-bold text-blue-600">تسجيل الدخول</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
