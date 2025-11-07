import React, { useEffect, useState, useRef } from "react";
import { StatusBar, Animated, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { useAuthStore } from "./store/authStore";
import { usePinStore } from "./store/pinStore";
import api from "./services/api";
import Splash from "./screens/Splash";

export default function App() {
  const { token, restoreSession } = useAuthStore();
  const { hasPin, checkIfPinExists } = usePinStore();

  const [booting, setBooting] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // For navigator fade-in
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

  // When splash finishes fading out, cross-fade navigators in
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
