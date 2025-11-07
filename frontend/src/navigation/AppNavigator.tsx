// -----------------------------
// React & Navigation Core
// -----------------------------
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { AppTabParamList } from "./types"; // ✅ type-safe tab list

// -----------------------------
// Screens
// -----------------------------
import Dashboard from "../screens/Dashboard";
import Budget from "../screens/Budget";
import Investments from "../screens/Investments";
import ProfileSettings from "../screens/ProfileSettings";
import ThemePreview from "../screens/ThemePreview";

// -----------------------------
// Theme Hook
// -----------------------------
import useTheme from "../hooks/useTheme";

// -----------------------------
// Navigator
// -----------------------------
const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppNavigator() {
  const { mode, tokens } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === "dark" ? "#1D2E35" : "#F4EBE8",
          borderTopColor: mode === "dark" ? "#292F37" : "#ccc",
          height: 70,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: tokens.primary || "#39abae",
        tabBarInactiveTintColor: mode === "dark" ? "#7B7F84" : "#888",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

          switch (route.name) {
            case "Theme":
              iconName = "color-palette-outline";
              break;
            case "Dashboard":
              iconName = "home-outline";
              break;
            case "Budget":
              iconName = "wallet-outline";
              break;
            case "Investments":
              iconName = "trending-up-outline";
              break;
            case "Profile":
              iconName = "person-circle-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Theme" component={ThemePreview} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="Investments" component={Investments} />
      <Tab.Screen name="Profile" component={ProfileSettings} />
    </Tab.Navigator>
  );
}

