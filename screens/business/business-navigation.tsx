import { Dimensions, Platform, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from "@/utils/helpers/routes";
import TouchableOpacity from "@/components/touchable-opacity";
import { useNavigationState } from "@react-navigation/native";
import Text from "@/components/text";
import BusinessM1Navigation from "./m1/m1-navigation";
import BusinessM2Navigation from "./m2/m2-navigation";
import BusinessM3Navigation from "./m3/m3-navigation";
import BusinessM4Navigation from "./m4/m4-navigation";
import BusinessM5Navigation from "./m5/m5-navigation";
import M1BusinessIcon from "@/assets/icons/menu/business/m1-business-icon";
import M2BusinessIcon from "@/assets/icons/menu/business/m2-business-icon";
import M3BusinessIcon from "@/assets/icons/menu/business/m3-business-icon";
import M4BusinessIcon from "@/assets/icons/menu/business/m4-business-icon";
import M5BusinessIcon from "@/assets/icons/menu/business/m5-business-icon";

function useTabScreens() {
  return [
    { key: 'M1', label: 'Dashboard', routeName: Routes.M1, component: BusinessM1Navigation, icon: M1BusinessIcon },
    { key: 'M2', label: 'Inventory', routeName: Routes.M2, component: BusinessM2Navigation, icon: M2BusinessIcon },
    { key: 'M3', label: 'Orders', routeName: Routes.M3, component: BusinessM3Navigation, icon: M3BusinessIcon },
    { key: 'M4', label: 'Inbox', routeName: Routes.M4, component: BusinessM4Navigation, icon: M4BusinessIcon },
    { key: 'M5', label: 'Profile', routeName: Routes.M5, component: BusinessM5Navigation, icon: M5BusinessIcon },
  ];
}

const Tab = createBottomTabNavigator();

export default function BusinessNavigation() {
  const tabs = useTabScreens();
  const height = Platform.OS === 'ios' ? 77 : 58;

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName={Routes.M1}
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: {
            backgroundColor: '#F5F5F5',
            paddingBottom: 3,
            height,
            borderTopWidth: 0,
          },
          tabBarHideOnKeyboard: true,
        };
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.key}
          name={tab.routeName}
          component={tab.component}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarButton: (buttonProps: any) => {
              const { delayLongPress, ...rest } = buttonProps;
              const safeDelay = delayLongPress === null ? undefined : delayLongPress;
              return <CustomTabButton {...rest} delayLongPress={safeDelay} tab={tab} height={height} />;
            },
            tabBarIcon: () => null,
            tabBarStyle: {
              backgroundColor: '#F5F5F5',
              paddingBottom: 3,
              height,
              borderTopWidth: 0,
            },
            tabBarHideOnKeyboard: true,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

type TabDef = ReturnType<typeof useTabScreens>[number];
const { width } = Dimensions.get('window');

const CustomTabButton: React.FC<
  React.ComponentProps<typeof TouchableOpacity> & {
    tab: TabDef;
    height: number;
  }
> = ({ tab, height, ...props }) => {
  const state = useNavigationState((state) => state);

  // Handling for potentially nested navigators or multiple routes
  const currentRouteName = state?.routes[state.index]?.name;
  const isFocused = currentRouteName === tab.routeName;

  const activeColor = '#8B5CF6'; // Purple for Business
  const inactiveColor = '#707070';

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
      activeOpacity={0.9}
    >
      <View
        style={{
          paddingTop: 10,
          alignItems: 'center',
          height,
          width: width / 5,
        }}
      >
        <View style={{ width: 24, height: 24, marginBottom: 1 }}>
          <tab.icon isActive={isFocused} color={isFocused ? activeColor : inactiveColor} />
        </View>

        <Text
          style={{
            fontSize: 10,
            color: isFocused ? activeColor : inactiveColor,
            textAlign: 'center',
            fontWeight: 600 as any,
          }}
        >
          {tab.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};