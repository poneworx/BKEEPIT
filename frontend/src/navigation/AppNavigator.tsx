import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";
import Settings from "../screens/Settings";
import useTheme from "../hooks/useTheme";
import { View, Text } from "react-native";

function Receipts() { return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Receipts</Text></View>; }
function Reports()  { return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Reports</Text></View>; }

const Tab = createBottomTabNavigator();

export default function AppNavigator(){
  const { mode, tokens } = useTheme();
  const navTheme = mode === "dark" ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: mode === "dark" ? "#0F1520" : "#0E3A44" },
          tabBarActiveTintColor: tokens.primary,
        }}>
        <Tab.Screen name="Home" component={Dashboard} />
        <Tab.Screen name="Receipts" component={Receipts} />
        <Tab.Screen name="Reports" component={Reports} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}