import { Platform, StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableOpacity from '@/components/touchable-opacity';
import Text from '@/components/text';
import { Routes } from '@/utils/routes';
import { LayoutGrid, ClipboardList, User } from 'lucide-react-native';
import { LabM1Navigation } from './m1/lab-m1-navigation';
import { LabM2Navigation } from './m2/lab-m2-navigation';
import { LabProfileScreen } from './m3/lab-profile-screen';

function useTabScreens() {
  return [
    {
      key: 'Dashboard',
      label: 'لوحة التحكم',
      routeName: 'LabDashboard',
      component: LabM1Navigation,
      icon: LayoutGrid
    },
    {
      key: 'Requests',
      label: 'الطلبات',
      routeName: Routes.LabM2Navigation,
      component: LabM2Navigation,
      icon: ClipboardList,
    },
    {
      key: 'Profile',
      label: 'الملف الشخصي',
      routeName: Routes.M4,
      component: LabProfileScreen,
      icon: User
    },
  ];
}

const Tab = createBottomTabNavigator();

export function LabNavigation() {
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
            height,
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
  const activeColor = '#0d9488'; // Teal for labs
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
