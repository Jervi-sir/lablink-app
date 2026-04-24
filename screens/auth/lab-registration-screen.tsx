import * as DocumentPicker from 'expo-document-picker';
import api, { apiPublic, setAxiosAuthToken } from '@/utils/api/axios-instance';
import { registerAndSyncPushToken } from '@/utils/notifications/push-notifications';
import { ApiRoutes, buildRoute } from '@/utils/api/api';
import { Routes } from '@/utils/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/zustand/auth-store';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, TextInput, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
  labName: string;
  email: string;
  state: string;
  specialty: string;
  phone: string;
  password: string;
  commercialRegistry: string;
  accreditationFile: string | null;
  acceptTerms: boolean;
}

const inputClassName =
  'rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-right text-base text-slate-900';

function UploadField({
  label,
  placeholder,
  icon,
  fileName,
  onPress,
  isLoading,
}: {
  label: string;
  placeholder: string;
  icon: string;
  fileName: string | null;
  onPress: () => void;
  isLoading?: boolean;
}) {
  return (
    <View>
      <Text className="mb-2 text-right text-sm font-semibold text-slate-700">{label}</Text>
      <Pressable
        accessibilityRole="button"
        className="flex-row items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-5"
        disabled={isLoading}
        onPress={onPress}>
        {isLoading ? (
          <ActivityIndicator color="#0f766e" />
        ) : (
          <>
            <Text className="text-2xl text-teal-600">{icon}</Text>
            <View>
              {fileName ? (
                <Text className="text-center text-sm font-semibold text-teal-700">{fileName}</Text>
              ) : (
                <>
                  <Text className="text-center text-sm font-medium text-slate-600">{placeholder}</Text>
                  <Text className="mt-1 text-center text-xs text-slate-400">PDF Document</Text>
                </>
              )}
            </View>
          </>
        )}
      </Pressable>
    </View>
  );
}

export function LabRegistrationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [formData, setFormData] = useState<FormData>({
    labName: '',
    email: 'lab@lablink.org',
    state: '',
    specialty: '',
    phone: '0550000001',
    password: '',
    commercialRegistry: '123456789',
    accreditationFile: null,
    acceptTerms: false,
  });
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showSpecialties, setShowSpecialties] = useState(false);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [labCategories, setLabCategories] = useState<any[]>([]);
  const [showStateOptions, setShowStateOptions] = useState(false);
  const [isLoadingTaxonomies, setIsLoadingTaxonomies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const response = await apiPublic.get(ApiRoutes.taxonomies, { params: { types: 'wilayas,lab_categories' } });
        if (response.status === 'success') {
          if (response.data.wilayas) {
            setWilayas(response.data.wilayas);
          }
          if (response.data.lab_categories) {
            setLabCategories(response.data.lab_categories);
          }
        }
      } catch (error) {
        console.error('Failed to fetch taxonomies:', error);
      } finally {
        setIsLoadingTaxonomies(false);
      }
    };

    fetchTaxonomies();
  }, []);

  const isValid = useMemo(
    () =>
      Boolean(
        formData.labName.trim() &&
        formData.email.trim() &&
        formData.state &&
        formData.specialty &&
        formData.phone.trim() &&
        formData.password.trim() &&
        formData.commercialRegistry.trim() &&
        formData.accreditationFile &&
        formData.acceptTerms
      ),
    [formData]
  );

  const setField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleDocumentPick = async (field: 'accreditationFile') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setUploadingField(field);

        const formDataPayload = new FormData();
        formDataPayload.append('file', {
          uri: file.uri,
          name: file.name || 'document.pdf',
          type: file.mimeType || 'application/pdf',
        } as any);

        const response = await apiPublic.post(ApiRoutes.uploads.temp, formDataPayload, {
          transformRequest: (data) => data,   // prevent Axios JSON serialization
          headers: {
            'Content-Type': 'multipart/form-data',  // ← explicit header
          },
        });

        setField(field, response.data.path);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء رفع الملف: ' + (error.message || 'خطأ غير معروف'));
    } finally {
      setUploadingField(null);
    }
  };

  const handleRegister = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await apiPublic.post(ApiRoutes.auth.business.register, {
        labName: formData.labName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        state: formData.state,
        specialty: formData.specialty,
        commercialRegistry: formData.commercialRegistry,
        accreditationFile: formData.accreditationFile,
      });

      if (response.status === 'success') {
        const { token, user, lab } = response.data;
        setAuth(token, user, lab);
        registerAndSyncPushToken();
        navigation.navigate(Routes.LabNavigation);
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
      <View className="bg-teal-700 px-6 pb-6 pt-4">
        <Pressable
          accessibilityRole="button"
          className="mb-5 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2"
          onPress={() => navigation.goBack()}>
          <Text className="text-base font-medium text-white">رجوع</Text>
        </Pressable>

        <Text className="text-right text-3xl font-bold text-white">تسجيل مخبر</Text>
        <Text className="mt-2 text-right text-sm text-teal-100">Laboratory Registration</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-6 pb-10 pt-6"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            اسم المخبر <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            onChangeText={(value) => setField('labName', value)}
            placeholder="أدخل اسم المخبر"
            placeholderTextColor="#94a3b8"
            textAlign="right"
            value={formData.labName}
          />
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
            placeholder="lab@example.com"
            placeholderTextColor="#94a3b8"
            textAlign="left"
            value={formData.email}
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
              <ActivityIndicator color="#0f766e" size="small" />
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
            التخصص <Text className="text-red-500">*</Text>
          </Text>
          <Pressable
            accessibilityRole="button"
            className={inputClassName}
            onPress={() => setShowSpecialties((current) => !current)}>
            <Text
              className={`${formData.specialty ? 'text-slate-900' : 'text-slate-400'} text-right text-base`}>
              {labCategories.find(c => c.id === formData.specialty)?.ar || 'اختر التخصص'}
            </Text>
          </Pressable>

          {showSpecialties ? (
            <View className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {labCategories.map((cat) => (
                <Pressable
                  key={cat.id}
                  className="border-b border-slate-100 px-4 py-3 last:border-b-0"
                  onPress={() => {
                    setField('specialty', cat.id);
                    setShowSpecialties(false);
                  }}>
                  <Text className="text-right text-base text-slate-700">{cat.ar}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View>
          <Text className="mb-2 text-right text-sm font-semibold text-slate-700">
            رقم الهاتف / الخط الأرضي <Text className="text-red-500">*</Text>
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
            السجل التجاري <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={inputClassName}
            onChangeText={(value) => setField('commercialRegistry', value)}
            placeholder="رقم السجل التجاري"
            placeholderTextColor="#94a3b8"
            textAlign="right"
            value={formData.commercialRegistry}
          />
        </View>

        <UploadField
          fileName={formData.accreditationFile}
          icon="⬆"
          isLoading={uploadingField === 'accreditationFile'}
          label="شهادة الاعتماد (PDF) *"
          onPress={() => handleDocumentPick('accreditationFile')}
          placeholder="رفع شهادة الاعتماد"
        />

        <View className="flex-row items-start gap-3 rounded-2xl bg-slate-100 px-4 py-4">
          <Switch
            onValueChange={(value) => setField('acceptTerms', value)}
            thumbColor="#ffffff"
            trackColor={{ false: '#cbd5e1', true: '#0f766e' }}
            value={formData.acceptTerms}
          />
          <Text className="flex-1 text-right text-sm leading-6 text-slate-700">
            أوافق على <Text className="font-semibold text-teal-600">الشروط والأحكام</Text> وسياسة
            الخصوصية الخاصة بمنصة LabLink
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className={`mt-2 rounded-[22px] px-5 py-4 ${isValid && !isSubmitting ? 'bg-teal-700' : 'bg-teal-300'}`}
          // disabled={!isValid || isSubmitting}
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
