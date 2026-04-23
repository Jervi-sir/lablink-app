import { apiPublic } from '@/utils/api/axios-instance';
import { ApiRoutes } from '@/utils/api/api';
import { Routes } from '@/utils/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/zustand/auth-store';

const inputClassName =
  'rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-right text-base text-slate-900';

export function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [phone, setPhone] = useState('0558054300');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف وكلمة المرور');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiPublic.post(ApiRoutes.auth.login, {
        phone_number: phone,
        password: password,
      });

      if (response.status === 'success') {
        const { token, user, profile, type } = response.data;
        // Merge profile and type into user object for simpler state or keep separate
        setAuth(token, { ...user, type }, profile);

        if (type === 'student') {
          navigation.replace(Routes.StudentNavigation);
        } else if (type === 'lab') {
          navigation.replace(Routes.LabNavigation);
        }
      } else {
        Alert.alert('خطأ', response.message || 'فشل تسجيل الدخول');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'بيانات الاعتماد غير صحيحة';
      Alert.alert('خطأ', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className='flex-1 bg-white'>
        <View className="bg-slate-900 px-6 pb-10 pt-6">
          <Pressable
            accessibilityRole="button"
            className="mb-8 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2"
            onPress={() => navigation.goBack()}>
            <Text className="text-base font-medium text-white">رجوع</Text>
          </Pressable>

          <Text className="text-right text-4xl font-bold text-white">تسجيل الدخول</Text>
          <Text className="mt-2 text-right text-base text-slate-400">Login to your account</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-6 pb-10 pt-8"
          showsVerticalScrollIndicator={false}>

          <View>
            <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
              رقم الهاتف <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className={inputClassName}
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="05XX XX XX XX"
              placeholderTextColor="#94a3b8"
              textAlign="left"
              value={phone}
            />
          </View>

          <View>
            <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
              كلمة المرور <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className={inputClassName}
              onChangeText={setPassword}
              placeholder="********"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              textAlign="left"
              value={password}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            className={`mt-4 rounded-[22px] px-5 py-5 ${!isSubmitting ? 'bg-blue-600' : 'bg-blue-300'}`}
            disabled={isSubmitting}
            onPress={handleLogin}
            style={({ pressed }) => ({
              transform: [{ scale: pressed && !isSubmitting ? 0.98 : 1 }],
              opacity: pressed && !isSubmitting ? 0.92 : 1,
            })}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-lg font-bold text-white">دخول</Text>
            )}
          </Pressable>

          <View className="mt-4 flex-row-reverse items-center justify-center gap-2">
            <Text className="text-slate-600">ليس لديك حساب؟</Text>
            <Pressable onPress={() => navigation.navigate(Routes.UserTypeSelection)}>
              <Text className="font-bold text-blue-600">سجل الآن</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

    </SafeAreaView>
  );
}
