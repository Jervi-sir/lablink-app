import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/zustand/auth-store';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '@/utils/routes';
import api from '@/utils/api/axios-instance';
import { User, LogOut, Mail, Phone, Building2, Save, Edit2, Shield, Copy, Bell, CheckCircle2, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { registerForPushNotificationsAsync } from '@/utils/notifications/push-notifications';
import { SERVER_URL } from '@/utils/api/api';

const inputClassName = "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-right text-base text-slate-900";

export const LabProfileScreen = () => {
  const { user, profile, clearAuth, updateUser } = useAuthStore();
  const navigation = useNavigation<any>();
  const labProfile = (profile && 'brand_name' in profile ? profile : user?.lab) || null;

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    brand_name: labProfile?.brand_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    password: '',
    password_confirmation: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      brand_name: labProfile?.brand_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
    }));
  }, [labProfile?.brand_name, user?.email, user?.phone_number]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => {
            clearAuth();
            navigation.replace(Routes.LoginScreen);
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('brand_name', formData.brand_name);
      data.append('email', formData.email);
      data.append('phone_number', formData.phone_number);
      
      if (formData.password) {
        data.append('password', formData.password);
        data.append('password_confirmation', formData.password_confirmation);
      }

      if (selectedImage) {
        const uriParts = selectedImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        data.append('avatar', {
          uri: selectedImage,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response: any = await api.post('/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 'success') {
        Alert.alert('نجاح', 'تم تحديث الملف الشخصي بنجاح');
        setEditing(false);
        setSelectedImage(null);
        
        if (response.data) {
          updateUser(response.data);
        }
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('خطأ', error.response?.data?.message || 'فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="bg-white px-6 pb-6 pt-5 border-b border-slate-100 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-slate-900">الملف الشخصي</Text>
          <Pressable
            onPress={() => setEditing(!editing)}
            className={`h-10 w-10 items-center justify-center rounded-full ${editing ? 'bg-amber-100' : 'bg-blue-100'}`}
          >
            {editing ? <Save size={20} color="#b45309" /> : <Edit2 size={20} color="#2563eb" />}
          </Pressable>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 pb-12" showsVerticalScrollIndicator={false}>
          {/* Header Info */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="h-28 w-28 items-center justify-center rounded-[36px] bg-blue-600 shadow-xl shadow-blue-200 overflow-hidden">
                {selectedImage ? (
                  <View className="h-full w-full">
                    <Text className="absolute z-10 top-1 right-1 bg-white/20 px-1 rounded text-[8px] text-white">جديد</Text>
                    <Image source={{ uri: selectedImage }} className="h-full w-full" style={{ width: '100%', height: '100%' }} />
                  </View>
                ) : labProfile?.avatar_url ? (
                  <Image 
                    source={{ uri: `${SERVER_URL}/storage/${labProfile.avatar_url}` }} 
                    className="h-full w-full" 
                    style={{ width: '100%', height: '100%' }} 
                  />
                ) : (
                  <Text className="text-5xl">{labProfile?.icon || '🔬'}</Text>
                )}
              </View>
              
              {editing && (
                <Pressable
                  onPress={pickImage}
                  className="absolute -bottom-2 -right-2 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100"
                >
                  <Camera size={20} color="#2563eb" />
                </Pressable>
              )}
            </View>

            <Text className="mt-6 text-2xl font-bold text-slate-900">{labProfile?.brand_name}</Text>
            <View className="mt-1 flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Shield size={12} color="#64748b" />
              <Text className="text-xs text-slate-500 font-medium">مخبر معتمد</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View className="gap-5">
            <View>
              <View className="flex-row-reverse items-center gap-2 mb-2">
                <Building2 size={16} color="#64748b" />
                <Text className="text-right text-sm font-bold text-slate-700">اسم العلامة التجارية</Text>
              </View>
              <TextInput
                className={`${inputClassName} ${!editing ? 'bg-slate-50 border-transparent text-slate-500' : ''}`}
                editable={editing}
                value={formData.brand_name}
                onChangeText={(val) => setFormData({ ...formData, brand_name: val })}
                placeholder="اسم المخبر"
                textAlign="right"
              />
            </View>

            <View>
              <View className="flex-row-reverse items-center gap-2 mb-2">
                <Mail size={16} color="#64748b" />
                <Text className="text-right text-sm font-bold text-slate-700">البريد الإلكتروني</Text>
              </View>
              <TextInput
                className={`${inputClassName} ${!editing ? 'bg-slate-50 border-transparent text-slate-500' : ''}`}
                editable={editing}
                value={formData.email}
                onChangeText={(val) => setFormData({ ...formData, email: val })}
                placeholder="email@example.com"
                keyboardType="email-address"
                textAlign="right"
              />
            </View>

            <View>
              <View className="flex-row-reverse items-center gap-2 mb-2">
                <Phone size={16} color="#64748b" />
                <Text className="text-right text-sm font-bold text-slate-700">رقم الهاتف</Text>
              </View>
              <TextInput
                className={`${inputClassName} ${!editing ? 'bg-slate-50 border-transparent text-slate-500' : ''}`}
                editable={editing}
                value={formData.phone_number}
                onChangeText={(val) => setFormData({ ...formData, phone_number: val })}
                placeholder="05XX XX XX XX"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>

            {editing && (
              <>
                <View className="mt-4 border-t border-slate-100 pt-6">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-right text-sm font-bold text-slate-700">تغيير كلمة المرور</Text>
                  </View>
                  <TextInput
                    className={inputClassName}
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(val) => setFormData({ ...formData, password: val })}
                    placeholder="كلمة المرور الجديدة"
                    textAlign="right"
                  />
                </View>
                <View>
                  <TextInput
                    className={inputClassName}
                    secureTextEntry
                    value={formData.password_confirmation}
                    onChangeText={(val) => setFormData({ ...formData, password_confirmation: val })}
                    placeholder="تأكيد كلمة المرور"
                    textAlign="right"
                  />
                </View>
              </>
            )}
          </View>

          {editing && (
            <Pressable
              onPress={handleSave}
              disabled={loading}
              className={`mt-10 flex-row items-center justify-center gap-3 rounded-[24px] py-4 shadow-lg shadow-blue-200 ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save size={20} color="white" />
                  <Text className="text-lg font-bold text-white">حفظ التغييرات</Text>
                </>
              )}
            </Pressable>
          )}

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            className="mt-10 flex-row items-center justify-center gap-3 rounded-[24px] bg-rose-50 border border-rose-100 py-4"
          >
            <LogOut size={20} color="#e11d48" />
            <Text className="text-lg font-bold text-rose-600">تسجيل الخروج</Text>
          </Pressable>

          {/* Debug Info / Push Token Section */}
          <View className="mt-10 pt-6 border-t border-slate-100 items-center">
            <PushTokenDebug />
            <Text className="mt-4 text-center text-xs text-slate-400">LabLink v1.0.0 • الإصدار التجريبي</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PushTokenDebug = () => {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchToken = async () => {
    try {
      const t = await registerForPushNotificationsAsync();
      setToken(t || 'لم يتم العثور على رمز');
    } catch (e) {
      setToken('خطأ في جلب الرمز');
    }
  };

  const copyToClipboard = async () => {
    if (token) {
      await Clipboard.setStringAsync(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!token) {
    return (
      <Pressable onPress={fetchToken} className="flex-row items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
        <Bell size={14} color="#64748b" />
        <Text className="text-xs text-slate-500 font-bold">عرض رمز الإشعارات (للتجربة)</Text>
      </Pressable>
    );
  }

  return (
    <View className="w-full bg-slate-100 p-4 rounded-2xl border border-slate-200">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-bold text-slate-500 text-right">رمز Expo Push</Text>
        <Pressable onPress={copyToClipboard} className="flex-row items-center gap-1">
          {copied ? (
            <CheckCircle2 size={14} color="#22c55e" />
          ) : (
            <Copy size={14} color="#2563eb" />
          )}
          <Text className={`text-[10px] font-bold ${copied ? 'text-green-600' : 'text-blue-600'}`}>
            {copied ? 'تم النسخ' : 'نسخ الرمز'}
          </Text>
        </Pressable>
      </View>
      <Text selectable numberOfLines={1} className="text-[10px] text-slate-400 font-mono">
        {token}
      </Text>
    </View>
  );
};
