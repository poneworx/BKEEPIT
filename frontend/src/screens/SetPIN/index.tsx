import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Screen from "../../components/layout/Screen";
import Card from "../../components/ui/Card";
import PinPad from "../../components/ui/PinPad";
import { useNavigation } from "@react-navigation/native";
import { usePinStore } from "../../store/pinStore";

export default function SetPINScreen() {
  const navigation = useNavigation();
  const { setPin, loading, error } = usePinStore();
  const [status, setStatus] = useState("");

  async function handleSubmit(pin: string) {
    setStatus("");
    await setPin(pin);

    if (!error) {
      setStatus("PIN saved successfully.");
      console.log("[bkeepit] PIN set — navigating to EnterPIN");

      // immediate navigation for dev
      navigation.navigate("EnterPIN" as never);

      // optional small delay before transition
      setTimeout(() => navigation.navigate("EnterPIN" as never), 1000);
    } else {
      setStatus("Failed to save PIN.");
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card>
          <Text
            style={{
              fontSize: 18,
              color: "#f6f7f8",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Set a 4-digit PIN
          </Text>

          <PinPad onSubmit={handleSubmit} />

          {loading && (
            <ActivityIndicator
              size="small"
              color="#39abae"
              style={{ marginTop: 10 }}
            />
          )}

          {status ? (
            <Text
              style={{
                color: error ? "red" : "#39abae",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {status}
            </Text>
          ) : null}
        </Card>
      </View>
    </Screen>
  );
}
