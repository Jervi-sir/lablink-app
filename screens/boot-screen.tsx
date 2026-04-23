import { useAuthStore } from '@/zustand/auth-store';
import { bootstrapAuth } from '@/utils/api/bootstrap-auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '@/utils/routes';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeInUp, 
  FadeOut, 
  useAnimatedStyle, 
  useSharedValue, 
  withSequence, 
  withTiming,
  withSpring
} from 'react-native-reanimated';

export function BootScreen({ navigation }: { navigation?: { navigate: (route: string) => void, replace: (route: string) => void } }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isBooting, setIsBooting] = useState(true);

  const bounceOffset = useSharedValue(0);
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceOffset.value }],
  }));

  useEffect(() => {
    if (!isBooting) {
      // Bounce animation: slightly up then back down with a spring
      bounceOffset.value = withSequence(
        withSpring(-15, { damping: 10, stiffness: 100 }),
        withSpring(0, { damping: 10, stiffness: 100 })
      );
    }
  }, [isBooting]);

  useEffect(() => {
    const init = async () => {
      const startTime = Date.now();
      const result = await bootstrapAuth();

      // Calculate remaining time to reach 2.5 seconds (slightly longer to show off animations)
      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(0, 2500 - elapsedTime);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      if (result.ok) {
        const { user, token } = result;
        setAuth(token, user, user.profile);

        if (user.type === 'student') {
          navigation?.replace(Routes.StudentNavigation);
        } else if (user.type === 'lab') {
          navigation?.replace(Routes.LabNavigation);
        } else {
          setIsBooting(false);
        }
      } else {
        setIsBooting(false);
      }
    };

    init();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 justify-between overflow-hidden px-6 pb-12 pt-6">
        {/* Decorative Blobs */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(1000)}
          className="absolute left-[-40px] top-20 h-48 w-48 rounded-full bg-blue-500/20"
        />
        <Animated.View
          entering={FadeInDown.delay(300).duration(1000)}
          className="absolute bottom-24 right-[-30px] h-56 w-56 rounded-full bg-teal-400/15"
        />
        <Animated.View
          entering={FadeInDown.delay(500).duration(1000)}
          className="absolute left-24 top-44 h-24 w-24 rounded-full bg-white/5"
        />

        <Animated.View
          entering={FadeInDown.delay(200).duration(800)}
          className="items-end"
        >
          <View className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <Text className="text-xs font-semibold uppercase tracking-[3px] text-blue-100">
              LabLink
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={bounceStyle}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(800).springify()}
            className="mb-8 h-32 w-32 items-center justify-center rounded-[32px] border border-white/10 bg-blue-600/90"
          >
            <Text className="text-6xl">🔬</Text>
          </Animated.View>

          <Animated.Text
            entering={FadeInRight.delay(600).duration(800)}
            className="text-right text-5xl font-extrabold leading-[60px] text-white"
          >
            منصة تربط
          </Animated.Text>
          <Animated.Text
            entering={FadeInRight.delay(800).duration(800)}
            className="mt-1 text-right text-5xl font-extrabold leading-[60px] text-teal-300"
          >
            الباحث بالمخبر
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(1000).duration(800)}
            className="mt-6 text-right text-base leading-7 text-slate-300"
          >
            احجز الخدمات المخبرية، تواصل مع الموردين، وتابع العقود والطلبات من واجهة موحدة وسريعة.
          </Animated.Text>
        </Animated.View>

        <View className="min-h-[60px] justify-end">
          {isBooting ? (
            <Animated.View
              key="loader"
              entering={FadeInDown.duration(600)}
              exiting={FadeOut.duration(400)}
              className="items-center pb-4"
            >
              <ActivityIndicator size="small" color="#2dd4bf" />
            </Animated.View>
          ) : (
            <Animated.View
              key="actions"
              entering={FadeInUp.springify().damping(15)}
              className="w-full"
            >
              <Pressable
                accessibilityRole="button"
                className="rounded-[24px] bg-blue-600 py-5 active:opacity-90"
                onPress={() => navigation?.navigate(Routes.UserTypeSelection)}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text className="text-center text-lg font-bold text-white">ابدأ الآن</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                className="mt-3 rounded-[24px] border border-white/20 bg-white/5 py-5 active:opacity-90"
                onPress={() => navigation?.navigate(Routes.LoginScreen)}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text className="text-center text-lg font-bold text-white">تسجيل الدخول</Text>
              </Pressable>

              <Animated.Text 
                entering={FadeInDown.delay(400)}
                className="mt-6 text-center text-sm tracking-wide text-slate-500 uppercase font-medium"
              >
                Student • Lab • Supplier
              </Animated.Text>
            </Animated.View>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
