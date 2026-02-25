import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets, } from "@react-navigation/stack";
import { Routes } from "./utils/helpers/routes";
import BootScreen from "./screens/auth/boot-screen";
import StudentNavigation from "./screens/student/student-navigation";
import BusinessNavigation from "./screens/business/business-navigation";
import AuthSelectorScreen from "./screens/auth/auth-selector-screen";
import StudentLoginScreen from "./screens/auth/student-login-screen";
import StudentRegisterScreen from "./screens/auth/student-register-screen";
import BusinessLoginScreen from "./screens/auth/business-login-screen";
import BusinessRegistryNavigation from "./screens/auth/business-registry/business-registry-navigation";
import ProductScreen from "./screens/student/common/product/product-screen";
import BusinessScreen from "./screens/student/common/business/business-screen";
import FilterScreen from "./screens/student/common/filter-screen";
import LabProductsScreen from "./screens/student/common/business/lab-products-screen";
import CheckoutScreen from "./screens/student/common/checkout/checkout-screen";
import OrderDetailScreen from "./screens/student/common/order-detail-screen";
import ChatDetailScreen from "./screens/student/common/chat-detail-screen";
import StudentSavedProductsScreen from "./screens/student/m5/saved-followed/saved-products-screen";
import StudentSavedBusinessesScreen from "./screens/student/m5/saved-followed/saved-businesses-screen";
import StudentFollowedBusinessesScreen from "./screens/student/m5/saved-followed/followed-businesses-screen";
import EditProfileScreen from "./screens/student/m5/edit-profile/edit-profile-screen";
import NotificationsScreen from "./screens/student/m5/settings/notifications-screen";
import LanguageScreen from "./screens/student/m5/settings/language-screen";
import PrivacySecurityScreen from "./screens/student/m5/privacy-security/privacy-security-screen";
import HelpSupportScreen from "./screens/student/m5/help-support/help-support-screen";
import ChangePasswordScreen from "./screens/student/m5/privacy-security/change-password-screen";
import TwoFactorAuthScreen from "./screens/student/m5/privacy-security/two-factor-auth-screen";
import LoginActivityScreen from "./screens/student/m5/privacy-security/login-activity-screen";
import ProfileVisibilityScreen from "./screens/student/m5/privacy-security/profile-visibility-screen";
import DataUsageScreen from "./screens/student/m5/privacy-security/data-usage-screen";
import FAQScreen from "./screens/student/m5/help-support/faq-screen";
import ContactSupportScreen from "./screens/student/m5/help-support/contact-support-screen";
import TermsOfServiceScreen from "./screens/student/m5/help-support/terms-of-service-screen";
import BusinessProductDetailScreen from "./screens/business/m2/product-detail-screen";
import EditCreateProductScreen from "./screens/business/m2/edit-create-product-screen";
import BusinessOrderDetailScreen from "./screens/business/m3/business-order-detail-screen";
import BusinessInvoiceScreen from "./screens/business/m3/invoice-screen";
import BusinessStudentProfileScreen from "./screens/business/common/student-profile-screen";
import EditLabProfileScreen from "./screens/business/m5/edit-lab-profile-screen";
import InventoryAnalyticsScreen from "./screens/business/m5/inventory-analytics-screen";
import OperatingHoursScreen from "./screens/business/m5/operating-hours-screen";
import PayoutHistoryScreen from "./screens/business/m5/payout-history-screen";
import TaxDocumentsScreen from "./screens/business/m5/tax-documents-screen";
import ProPlanStatusScreen from "./screens/business/m5/pro-plan-status-screen";
import BusinessSupportScreen from "./screens/business/m5/business-support-screen";
import ServiceAgreementsScreen from "./screens/business/m5/service-agreements-screen";
import EditContactScreen from "./screens/business/m5/edit-contact-screen";
import { useEffect } from "react";

export default function App() {
  const navigationRef = useNavigationContainerRef();

  // TODO: remove this in production
  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      console.log("Navigation state changed:", navigationRef.getCurrentRoute());
    });
    return unsubscribe;
  }, [navigationRef]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={
        {
          lazy: true,
          headerShown: false,
        } as any
      }
      initialRouteName={Routes.BootScreen}
    >
      {[
        /**-- Navigation --*/
        { name: Routes.BootScreen, component: BootScreen },
        { name: Routes.StudentNavigation, component: StudentNavigation },
        { name: Routes.BusinessNavigation, component: BusinessNavigation },

        /**-- auth --*/
        { name: Routes.AuthSelectorScreen, component: AuthSelectorScreen },
        { name: Routes.StudentLoginScreen, component: StudentLoginScreen },
        { name: Routes.StudentRegisterScreen, component: StudentRegisterScreen },
        { name: Routes.BusinessLoginScreen, component: BusinessLoginScreen },
        { name: 'business-registry', component: BusinessRegistryNavigation },

        /**-- common --*/
        { name: Routes.ProductScreen, component: ProductScreen },
        { name: Routes.BusinessScreen, component: BusinessScreen },
        { name: Routes.FilterScreen, component: FilterScreen },
        { name: Routes.LabProductsScreen, component: LabProductsScreen },
        { name: Routes.CheckoutScreen, component: CheckoutScreen },
        { name: Routes.OrderDetailScreen, component: OrderDetailScreen },
        { name: Routes.ChatDetailScreen, component: ChatDetailScreen },
        { name: Routes.StudentSavedProductsScreen, component: StudentSavedProductsScreen },
        { name: Routes.StudentSavedBusinessesScreen, component: StudentSavedBusinessesScreen },
        { name: Routes.StudentFollowedBusinessesScreen, component: StudentFollowedBusinessesScreen },
        { name: Routes.EditProfileScreen, component: EditProfileScreen },
        { name: Routes.NotificationsScreen, component: NotificationsScreen },
        { name: Routes.LanguageScreen, component: LanguageScreen },
        { name: Routes.PrivacySecurityScreen, component: PrivacySecurityScreen },
        { name: Routes.HelpSupportScreen, component: HelpSupportScreen },
        { name: Routes.ChangePasswordScreen, component: ChangePasswordScreen },
        { name: Routes.TwoFactorAuthScreen, component: TwoFactorAuthScreen },
        { name: Routes.LoginActivityScreen, component: LoginActivityScreen },
        { name: Routes.ProfileVisibilityScreen, component: ProfileVisibilityScreen },
        { name: Routes.DataUsageScreen, component: DataUsageScreen },
        { name: Routes.FAQScreen, component: FAQScreen },
        { name: Routes.ContactSupportScreen, component: ContactSupportScreen },
        { name: Routes.TermsOfServiceScreen, component: TermsOfServiceScreen },
        { name: Routes.BusinessProductDetailScreen, component: BusinessProductDetailScreen },
        { name: Routes.EditCreateProductScreen, component: EditCreateProductScreen },
        { name: Routes.BusinessOrderDetailScreen, component: BusinessOrderDetailScreen },
        { name: Routes.BusinessInvoiceScreen, component: BusinessInvoiceScreen },
        { name: Routes.BusinessStudentProfileScreen, component: BusinessStudentProfileScreen },
        { name: Routes.EditLabProfileScreen, component: EditLabProfileScreen },
        { name: Routes.InventoryAnalyticsScreen, component: InventoryAnalyticsScreen },
        { name: Routes.OperatingHoursScreen, component: OperatingHoursScreen },
        { name: Routes.PayoutHistoryScreen, component: PayoutHistoryScreen },
        { name: Routes.TaxDocumentsScreen, component: TaxDocumentsScreen },
        { name: Routes.ProPlanStatusScreen, component: ProPlanStatusScreen },
        { name: Routes.BusinessSupportScreen, component: BusinessSupportScreen },
        { name: Routes.ServiceAgreementsScreen, component: ServiceAgreementsScreen },
        { name: Routes.EditContactScreen, component: EditContactScreen },

        /**-- m1 --*/

        /**-- m2 --*/

        /**-- m3 --*/

        /**-- m4 --*/

        /**-- m5 --*/


      ].map((item, index) => (
        <Stack.Screen
          key={index}
          name={item.name}
          component={item.component as any}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      ))}
    </Stack.Navigator>
  )
}