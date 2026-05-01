import './global.css';
import { BootScreen } from '@/screens/boot-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from 'utils/routes';

import './utils/notifications/push-notifications';

import { SheetProvider } from 'react-native-actions-sheet';
import './action-sheets';
import { UserTypeSelectionScreen } from './screens/auth/user-type-selection-screen';
import { LabRegistrationScreen } from './screens/auth/lab-registration-screen';
import { StudentRegistrationScreen } from './screens/auth/student-registration-screen';
import { ServiceDetailsScreen } from './screens/commons/products/service-details-screen';
import { LabDetailsScreen } from './screens/commons/as-student/lab-details-screen';
import { ContractSigningScreen } from './screens/commons/orders/contract-signing-screen';
import { MyProductsScreen } from './screens/lab/m1/my-products-screen';
import { AddEquipmentScreen } from './screens/lab/m1/add-equipment-screen';

import { CartProvider } from './context/CartContext';
import { LoginScreen } from './screens/auth/login-screen';
import { CartScreen } from './screens/commons/as-student/cart-screen';
import { StudentNavigation } from './screens/student/student-navigation';
import { LabNavigation } from './screens/lab/lab-navigation';
import { LabM2Navigation } from './screens/lab/m2/lab-m2-navigation';
import { LabOrdersScreen } from './screens/lab/m1/lab-orders-screen';
import { LabOrderDetailScreen } from './screens/lab/m1/lab-order-details-screen';
import ProductDetailsScreen from './screens/commons/products/product-details-screen';
import ProductStatsScreen from './screens/lab/m1/product-stats-screen';
import { enableScreens } from 'react-native-screens';

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  enableScreens();
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CartProvider>
          <NavigationContainer
            onStateChange={(state) => {
              const currentRoute = state?.routes[state.index];
              console.log('Current Route:', currentRoute?.name);
            }}
          >
            <SheetProvider>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right', // iOS default push
                  // animationDuration: 350,
                  gestureEnabled: true, // swipe back
                  // fullScreenGestureEnabled: true, // smoother swipe
                  gestureDirection: 'horizontal',
                  // animationMatchesGesture: true, // 👈 important for smooth sync
                }}
                initialRouteName={Routes.BootScreen}>

                {/**-- Auth & Boot --**/}
                <Stack.Screen name={Routes.BootScreen} component={BootScreen} />
                <Stack.Screen name={Routes.LoginScreen} component={LoginScreen} />
                <Stack.Screen name={Routes.UserTypeSelection} component={UserTypeSelectionScreen} />
                <Stack.Screen name={Routes.StudentRegistrationScreen} component={StudentRegistrationScreen} />
                <Stack.Screen name={Routes.LabRegistrationScreen} component={LabRegistrationScreen} />

                {/**-- Main Navigations (Tabs) --**/}
                <Stack.Screen name={Routes.StudentNavigation} component={StudentNavigation} />
                <Stack.Screen name={Routes.LabNavigation} component={LabNavigation} />

                {/**-- Common Screens (Stacked on top of Tabs) --**/}
                <Stack.Screen name={Routes.ServiceDetailsScreen} component={ServiceDetailsScreen} />
                <Stack.Screen name={Routes.LabDetailsScreen} component={LabDetailsScreen} />
                <Stack.Screen name={Routes.ContractSigningScreen} component={ContractSigningScreen} />
                <Stack.Screen name={Routes.CartScreen} component={CartScreen} />
                <Stack.Screen name={Routes.ProductDetailsScreen} component={ProductDetailsScreen} />

                {/**-- Lab Specific Screens --**/}
                <Stack.Screen name={Routes.AddEquipmentScreen} component={AddEquipmentScreen} />
                <Stack.Screen name={Routes.LabM2Navigation} component={LabM2Navigation} />
                <Stack.Screen name={Routes.MyProductsScreen} component={MyProductsScreen} />
                <Stack.Screen name={Routes.LabOrdersScreen} component={LabOrdersScreen} />
                <Stack.Screen name={Routes.LabOrderDetailScreen} component={LabOrderDetailScreen} />
                <Stack.Screen name={Routes.ProductStatsScreen} component={ProductStatsScreen} />

              </Stack.Navigator>
            </SheetProvider>
          </NavigationContainer>
        </CartProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
