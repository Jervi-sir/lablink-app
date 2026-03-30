import { Dimensions, Platform, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from "@/utils/helpers/routes";
import TouchableOpacity from "@/components/touchable-opacity";
import { useNavigationState } from "@react-navigation/native";
import Text from "@/components/text";
import StudentM1Navigation from "./m1/m1-navigation";
import StudentM2Navigation from "./m2/m2-navigation";
import StudentM3Navigation from "./m3/m3-navigation";
import StudentM4Navigation from "./m4/m4-navigation";
import StudentM5Navigation from "./m5/m5-navigation";
import M1StudentIcon from "@/assets/icons/menu/student/m1-student-icon";
import M2StudentIcon from "@/assets/icons/menu/student/m2-student-icon";
import M3StudentIcon from "@/assets/icons/menu/student/m3-student-icon";
import M4StudentIcon from "@/assets/icons/menu/student/m4-student-icon";
import M5StudentIcon from "@/assets/icons/menu/student/m5-student-icon";
import { useLanguageStore } from "@/zustand/language-store";

const translations = {
  suppliers: { en: 'Suppliers', fr: 'Fournisseurs', ar: 'الموردين' },
  laboratories: { en: 'Laboratories', fr: 'Laboratoires', ar: 'المختبرات' },
  orders: { en: 'Orders', fr: 'Commandes', ar: 'الطلبات' },
  inbox: { en: 'Inbox', fr: 'Messagerie', ar: 'الرسائل' },
  profile: { en: 'Profile', fr: 'Profil', ar: 'الملف الشخصي' },
};

function useTabScreens() {
  const language = useLanguageStore((state) => state.language);
  const t = (key: keyof typeof translations) => translations[key][language];

  return [
    { key: 'M1', label: t('suppliers'), routeName: Routes.M1, component: StudentM1Navigation, icon: M1StudentIcon },
    { key: 'M2', label: t('laboratories'), routeName: Routes.M2, component: StudentM2Navigation, icon: M2StudentIcon },
    { key: 'M3', label: t('orders'), routeName: Routes.M3, component: StudentM3Navigation, icon: M3StudentIcon },
    { key: 'M4', label: t('inbox'), routeName: Routes.M4, component: StudentM4Navigation, icon: M4StudentIcon },
    { key: 'M5', label: t('profile'), routeName: Routes.M5, component: StudentM5Navigation, icon: M5StudentIcon },
  ];
}

const Tab = createBottomTabNavigator();

export default function StudentNavigation() {
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
          tabBarActiveTintColor: 'black',
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
  // read nav state and figure out if this tab is active
  const state = useNavigationState((state) => state);
  const currentRouteName = state.routes[state.index]?.name;
  const isFocused = currentRouteName === tab.routeName;

  const activeColor = '#111';
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
          width: width / 5, // Hardcoded 5 since TabScreen length is 5
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


