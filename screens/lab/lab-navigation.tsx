import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TouchableOpacity from '@/components/touchable-opacity';
import Text from '@/components/text';
import { Routes } from '@/utils/routes';
import M1Icon from '@/assets/icons/menu/m1-icon';
import M2Icon from '@/assets/icons/menu/m2-icon';
import M4Icon from '@/assets/icons/menu/m4-icon';
import { LabM1Navigation } from './m1/lab-m1-navigation';
import { LabM2Navigation } from './m2/lab-m2-navigation';
import { LabProfileScreen } from './m3/lab-profile-screen';

function useTabScreens() {
  return [
    { key: 'Dashboard', label: 'لوحة التحكم', routeName: 'LabDashboard', component: LabM1Navigation, icon: M1Icon },
    {
      key: 'Requests',
      label: 'الطلبات الواردة',
      routeName: Routes.LabM2Navigation,
      component: LabM2Navigation,
      icon: M2Icon,
    },
    { key: 'Profile', label: 'الرسائل', routeName: Routes.M4, component: LabProfileScreen, icon: M4Icon },
  ];
}

const Tab = createBottomTabNavigator();

export function LabNavigation() {
  const tabs = useTabScreens();
  const height = Platform.OS === 'ios' ? 88 : 68;
  return (
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
      }}>
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.key}
          name={tab.routeName}
          component={tab.component}
          options={{
            tabBarButton: (props) => (
              <CustomTabButton {...props} tab={tab} height={height} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const CustomTabButton = ({ tab, height, ...props }: any) => {
  const isFocused = props.accessibilityState?.selected;

  const activeColor = '#0d9488'; // Teal for labs
  const inactiveColor = '#64748b';

  return (
    <TouchableOpacity
      {...props}
      style={[
        props.style,
        {
          flex: 1,
          height,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      activeOpacity={0.9}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 24, height: 24, marginBottom: 4 }}>
          <tab.icon isActive={isFocused} color={isFocused ? activeColor : inactiveColor} />
        </View>
        <Text
          style={{
            fontSize: 12,
            color: isFocused ? activeColor : inactiveColor,
            fontWeight: isFocused ? '700' : '500',
          }}>
          {tab.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
