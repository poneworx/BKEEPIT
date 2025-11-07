import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth flow screens
import Login from "../screens/Login";
import Register from "../screens/Register";
import VerifyEmail from "../screens/VerifyEmail";
import SetPIN from "../screens/SetPIN";
import EnterPIN from "../screens/EnterPIN";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen name="SetPIN" component={SetPIN} />
      <Stack.Screen name="EnterPIN" component={EnterPIN} />
    </Stack.Navigator>
  );
}
