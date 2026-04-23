import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OrdersScreen } from "./orders-screen";
import { OrderDetailScreen } from "./order-details-screen";
import { Routes } from "@/utils/routes";

const Stack = createNativeStackNavigator();

export default function OrderNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.M2} component={OrdersScreen} />
      <Stack.Screen name={Routes.OrderDetailScreen} component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
