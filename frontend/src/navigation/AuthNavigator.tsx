// -----------------------------
// React & Navigation Core
// -----------------------------
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "./types"; // ✅ type-safe route list

// -----------------------------
// Screens
// -----------------------------
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import VerifyEmailScreen from "../screens/VerifyEmail";
import SetPINScreen from "../screens/SetPIN";
import EnterPINScreen from "../screens/EnterPIN";

// -----------------------------
// Navigator
// -----------------------------
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="SetPIN" component={SetPINScreen} />
      <Stack.Screen name="EnterPIN" component={EnterPINScreen} />
    </Stack.Navigator>
  );
}
