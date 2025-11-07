import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";
import useTheme from "../../hooks/useTheme";

type SplashProps = {
  visible: boolean;
  onFadeOutComplete?: () => void;
};

// Adjust this path if your logo is elsewhere
const logo = require("../../public/logos/bkeepit-primary.png");

export default function Splash({ visible, onFadeOutComplete }: SplashProps) {
  const { mode, tokens } = useTheme();

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Fade and scale in when visible
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out, then unmount via callback
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && onFadeOutComplete) onFadeOutComplete();
      });
    }
  }, [visible, opacity, scale, onFadeOutComplete]);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          backgroundColor: mode === "dark" ? "#1D2E35" : "#F4EBE8",
        },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: tokens.primary || "#39abae" }]}>
          bkeepit
        </Text>
        <Text
          style={[
            styles.tagline,
            { color: mode === "dark" ? "#A1ECE3" : "#292F37" },
          ]}
        >
          your goals, your growth
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
});
