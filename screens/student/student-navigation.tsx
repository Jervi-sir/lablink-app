import { Platform, StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from '@/utils/routes';
import { Store, FlaskConical, User } from 'lucide-react-native';
import { StudentM1Navigation } from './m1/student-m1-navigation';
import { StudentProfileScreen } from './m3/student-profile-screen';
import OrderNavigation from '../commons/orders/order-navigation';

function useTabScreens() {
  return [
    { key: 'M1', label: 'الموردين', routeName: Routes.M1, component: StudentM1Navigation, icon: Store },
    {
      key: 'M2',
      label: 'المختبرات',
      routeName: Routes.M2,
      component: OrderNavigation,
      icon: FlaskConical,
    },
    { key: 'M4', label: 'الملف الشخصي', routeName: Routes.M4, component: StudentProfileScreen, icon: User },
  ];
}

const Tab = createBottomTabNavigator();

export function StudentNavigation() {
  const insets = useSafeAreaInsets();
  const tabs = useTabScreens();

  const height = 60 + insets.bottom + 10;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: Platform.OS === 'android' ? height : 80,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab.Screen
            key={tab.key}
            name={tab.routeName}
            component={tab.component}
            options={{
              tabBarIcon: ({ focused }) => (
                <CustomTabIcon tab={tab} focused={focused} />
              ),
              tabBarItemStyle: {
                flex: 1,
                height,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: insets.bottom,
              },
            }}
          />
        ))}
      </Tab.Navigator>
    </>
  );
}

const CustomTabIcon = ({ tab, focused }: { tab: any; focused: boolean }) => {
  const activeColor = '#2563eb';
  const inactiveColor = '#64748b';

  return (
    <View className="items-center justify-center">
      {focused && (
        <View
          className="absolute h-10 w-10 rounded-full opacity-10"
        // style={{ backgroundColor: activeColor }}
        />
      )}

      <View className="mb-1 h-6 w-6 items-center justify-center">
        <tab.icon
          color={focused ? activeColor : inactiveColor}
          size={22}
          strokeWidth={focused ? 2.5 : 2}
        />
      </View>

      {/* <Text
        style={{
          fontSize: 10,
          color: focused ? activeColor : inactiveColor,
          fontWeight: focused ? '800' : '500',
          marginTop: 2,
        }}
      >
        {tab.label}
      </Text> */}

      {focused && (
        <View
          className="mt-1 h-1 w-1 rounded-full"
          style={{ backgroundColor: activeColor }}
        />
      )}
    </View>
  );
};