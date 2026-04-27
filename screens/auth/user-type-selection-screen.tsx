import React from 'react';
import { Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { Routes } from 'utils/routes';

type UserType = 'student' | 'lab' | 'supplier';

interface UserTypeSelectionScreenProps {
  onSelectUserType?: (type: UserType) => void;
  navigation?: { navigate: (route: string) => void; goBack: () => void };
}

interface UserTypeOption {
  id: UserType;
  title: string;
  titleEn: string;
  icon: string;
  iconBackground: string;
  borderColor: string;
  description: string;
}

const userTypes: UserTypeOption[] = [
  {
    id: 'student',
    title: 'طالب / باحث',
    titleEn: 'Student / Researcher',
    icon: 'U',
    iconBackground: 'bg-blue-600',
    borderColor: 'border-blue-200',
    description: 'للطلاب والباحثين الأكاديميين',
  },
  {
    id: 'lab',
    title: 'مخبر',
    titleEn: 'Laboratory',
    icon: 'L',
    iconBackground: 'bg-teal-600',
    borderColor: 'border-teal-200',
    description: 'للمخابر والمراكز البحثية',
  },
];

export function UserTypeSelectionScreen({
  onSelectUserType,
  navigation,
}: UserTypeSelectionScreenProps) {
  const handleSelect = (type: UserType) => {
    onSelectUserType?.(type);

    if (type === 'student') {
      navigation?.navigate(Routes.StudentRegistrationScreen);
      return;
    }

    if (type === 'lab') {
      navigation?.navigate(Routes.LabRegistrationScreen);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle='dark-content' />
      <View className="bg-blue-700 px-6 pb-10 pt-6">
        <View className="rounded-[28px] border border-white/15 bg-blue-600 px-6 py-8">
          <Text className="text-center text-4xl font-extrabold tracking-[4px] text-white">
            LabLink
          </Text>
          <Text className="mt-3 text-center text-base text-blue-100">انضم إلى منصة المخابر</Text>
        </View>
      </View>

      <View className="flex-1 px-6 pb-8 pt-8">
        <Text className="text-center text-3xl font-bold text-slate-900">اختر نوع الحساب</Text>
        <Text className="mt-2 text-center text-base text-slate-500">Select Account Type</Text>

        <View className="mt-8 gap-4">
          {userTypes.map((type) => (
            <Pressable
              key={type.id}
              accessibilityRole="button"
              className={`rounded-[28px] border bg-white px-5 py-5 ${type.borderColor}`}
              onPress={() => handleSelect(type.id)}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.94 : 1,
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: pressed ? 0.08 : 0.12,
                shadowRadius: 20,
                elevation: pressed ? 2 : 4,
                borderWidth: 1,
              })}>
              <View className="flex-row items-center gap-4">
                <View
                  className={`h-16 w-16 items-center justify-center rounded-full ${type.iconBackground}`}>
                  <Text className="text-2xl font-extrabold text-white">{type.icon}</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-right text-xl font-bold text-slate-900">{type.title}</Text>
                  <Text className="mt-1 text-right text-sm text-slate-500">{type.titleEn}</Text>
                  <Text className="mt-2 text-right text-sm leading-5 text-slate-700">
                    {type.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="mt-auto items-center pb-2">
          <Pressable
            onPress={() => navigation?.goBack()}
            className="flex-row items-center gap-2 rounded-2xl bg-slate-100 px-8 py-4"
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}>
            <ArrowLeft size={20} color="#64748b" />
            <Text className="font-semibold text-slate-600">العودة </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
