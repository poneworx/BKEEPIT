import React, { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Screen from "../../components/layout/Screen";
import Card from "../../components/ui/Card";
import PinPad from "../../components/ui/PinPad";
import { useNavigation } from "@react-navigation/native";
import { usePinStore } from "../../store/pinStore";

export default function EnterPIN() {
  const navigation = useNavigation();
  const { verifyPin } = usePinStore();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(pin: string) {
    setLoading(true);
    setStatus("");

    const valid = await verifyPin(pin);

    if (valid) {
      setStatus("Unlocked");
      console.log("[bkeepit] PIN verified — navigating to Dashboard");

      // immediate navigation for dev
      navigation.navigate("Dashboard" as never);

      // optional 1-second UX delay for visual feedback
      setTimeout(() => navigation.navigate("Dashboard" as never), 1000);
    } else {
      setStatus("Incorrect PIN. Try again.");
    }

    setLoading(false);
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Card>
          <Text
            style={{
              fontSize: 18,
              color: "#f6f7f8",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Enter PIN
          </Text>

          <PinPad onSubmit={onSubmit} />

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
                color:
                  status.includes("Incorrect") || status.includes("Failed")
                    ? "red"
                    : "#39abae",
                marginTop: 8,
                textAlign: "center",
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
