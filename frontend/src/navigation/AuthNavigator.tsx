import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation.types";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { CreateAccountScreen } from "../screens/auth/CreateAccountScreen";
import { VerifyEmailScreen } from "../screens/auth/VerifyEmailScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import { COLORS } from "../constants/theme";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
