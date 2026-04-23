import { Dimensions, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TouchableOpacity from '@/components/touchable-opacity';
import Text from '@/components/text';
import { Routes } from '@/utils/routes';
import M1Icon from '@/assets/icons/menu/m1-icon';
import M2Icon from '@/assets/icons/menu/m2-icon';
import M4Icon from '@/assets/icons/menu/m4-icon';
import { StudentM1Navigation } from './m1/student-m1-navigation';
import { StudentProfileScreen } from './m3/student-profile-screen';
import OrderNavigation from '../commons/orders/order-navigation';

const translations = {
  suppliers: { en: 'Suppliers', fr: 'Fournisseurs', ar: 'الموردين' },
  laboratories: { en: 'Laboratories', fr: 'Laboratoires', ar: 'المختبرات' },
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  inbox: { en: 'Inbox', fr: 'Messagerie', ar: 'الرسائل' },
};

function useTabScreens() {
  return [
    { key: 'M1', label: 'الموردين', routeName: Routes.M1, component: StudentM1Navigation, icon: M1Icon },
    {
      key: 'M2',
      label: 'المختبرات',
      routeName: Routes.M2,
      component: OrderNavigation,
      icon: M2Icon,
    },
    { key: 'M4', label: 'الرسائل', routeName: Routes.M4, component: StudentProfileScreen, icon: M4Icon },
  ];
}

const Tab = createBottomTabNavigator();

export function StudentNavigation() {
  const insets = useSafeAreaInsets();
  const tabs = useTabScreens();
  
  // Base height for the tab bar content + safe area bottom + user requested 10
  const height = 60 + insets.bottom + 10;

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
              <CustomTabButton {...props} tab={tab} height={height} bottomInset={insets.bottom} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const { width } = Dimensions.get('window');

const CustomTabButton = ({ tab, height, bottomInset, ...props }: any) => {
  const isFocused = props.accessibilityState?.selected;

  const activeColor = '#2563eb';
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
          paddingBottom: bottomInset,
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
