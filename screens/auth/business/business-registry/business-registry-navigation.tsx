import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import Step1Screen from "./step1-screen";
import Step2Screen from "./step2-screen";
import Step3Screen from "./step3-screen";

const Stack = createStackNavigator();

export default function BusinessRegistryNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="BusinessStep1" component={Step1Screen} />
      <Stack.Screen name="BusinessStep2" component={Step2Screen} />
      <Stack.Screen name="BusinessStep3" component={Step3Screen} />
    </Stack.Navigator>
  );
}