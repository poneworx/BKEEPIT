import React from "react";
import { View, Text } from "react-native";
import useTheme from "../../hooks/useTheme";

export default function BrandKitHeader() {
  const { tokens } = useTheme();
  return (
    <View style={{ alignItems: "center", marginBottom: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: tokens.primary }}>poneworx.</Text>
      <Text style={{ fontSize: 20, fontWeight: "700", color: tokens.accent }}>+ bkeepit</Text>
    </View>
  );
}