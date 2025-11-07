import React from "react";
import { View, Text, Switch, TextInput } from "react-native";
import Screen from "../../components/layout/Screen";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useTheme } from "../../hooks/useTheme";
import { useUiStore } from "../../store/uiStore";

export default function ThemePreview() {
  const { mode, tokens } = useTheme();
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          gap: 16,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: tokens.text,
            marginBottom: 10,
          }}
        >
          Theme Preview ({mode})
        </Text>

        {/* Switch between light/dark modes */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: tokens.text }}>Dark Mode</Text>
          <Switch
            value={mode === "dark"}
            onValueChange={toggleTheme}
            thumbColor={mode === "dark" ? tokens.primary : "#ccc"}
            trackColor={{ true: tokens.primary, false: "#888" }}
          />
        </View>

        {/* Color Tokens */}
        <Card>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: tokens.text,
              marginBottom: 8,
            }}
          >
            Color Tokens
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {Object.entries(tokens)
              .filter(([k]) =>
                ["primary", "secondary", "highlight"].includes(k)
              )
              .map(([key, value]) => (
                <View
                  key={key}
                  style={{
                    backgroundColor: value,
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {key}
                  </Text>
                </View>
              ))}
          </View>
        </Card>

        {/* Typography and Buttons */}
        <Card>
          <Text style={{ color: tokens.text, fontSize: 18, marginBottom: 10 }}>
            Typography + Inputs
          </Text>
          <TextInput
            placeholder="Sample input"
            placeholderTextColor={tokens.secondary}
            style={{
              borderColor: tokens.primary,
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              marginBottom: 12,
              color: tokens.text,
              width: 200,
            }}
          />
          <Button label="Primary Action" />
        </Card>
      </View>
    </Screen>
  );
}
