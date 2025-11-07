// -----------------------------
// React & Core
// -----------------------------
import React, { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

// -----------------------------
// Expo & Environment
// -----------------------------
import { StatusBar } from "expo-status-bar"; // ✅ Expo’s version supports style="light"
import { NavigationContainer } from "@react-navigation/native";

// -----------------------------
// Navigation
// -----------------------------
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";

// -----------------------------
// State Management
// -----------------------------
import { useAuthStore } from "./store/authStore";
import { usePinStore } from "./store/pinStore";

// -----------------------------
// Services & Config
// -----------------------------
import api from "./services/api";

// -----------------------------
// UI & Screens
// -----------------------------
import Splash from "./screens/Splash";

// -----------------------------
// App Component
// -----------------------------
export default function App() {
  const { token, restoreSession } = useAuthStore();
  const { hasPin, checkIfPinExists } = usePinStore();
  const [booting, setBooting] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const navOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function initialize() {
      await restoreSession();
      await checkIfPinExists();

      try {
        const res = await api.get("/health");
        console.log("[bkeepit] API Health:", res.data);
      } catch (err: any) {
        console.error("[bkeepit] API Health check failed:", err.message);
      }

      setBooting(false);
    }

    initialize();
  }, [restoreSession, checkIfPinExists]);

  const handleSplashFadeOut = () => {
    setShowSplash(false);
    Animated.timing(navOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const isAuthed = !!token;

  return (
    <>
      <StatusBar style="light" />
      <Animated.View style={[styles.container, { opacity: navOpacity }]}>
        <NavigationContainer>
          {!isAuthed ? (
            <AuthNavigator />
          ) : hasPin ? (
            <AppNavigator />
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </Animated.View>

      {showSplash && (
        <Splash
          visible={booting}
          onFadeOutComplete={handleSplashFadeOut}
        />
      )}
    </>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
