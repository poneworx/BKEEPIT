import React from "react";
import { View, Text, Switch, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";

export default function Settings(){
  const { tokens, mode, setOverride } = useTheme();
  const dark = mode === "dark";
  return (
    <LinearGradient colors={tokens.gradient} style={{ flex:1, padding: 20 }}>
      <Text style={[tokens.Text.h1, { color:"#fff", marginBottom: 12 }]}>Settings</Text>
      <View style={{ ...tokens.Glass(mode), marginBottom: 16, flexDirection:"row", alignItems:"center", gap:12 }}>
        <Image source={{ uri:"https://placehold.co/96x96" }} style={{ width:56, height:56, borderRadius:28 }} />
        <View>
          <Text style={tokens.Text.h2}>Your Name</Text>
          <Text>you@example.com</Text>
        </View>
      </View>
      <View style={{ ...tokens.Glass(mode), marginBottom: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
        <Text>Dark mode</Text>
        <Switch value={dark} onValueChange={(v)=> setOverride(v ? "dark" : "light")} />
      </View>
      <View style={{ ...tokens.Glass(mode), paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12 }}>
        <Text>Notifications</Text>
      </View>
      <View style={{ ...tokens.Glass(mode), paddingVertical: 12, paddingHorizontal: 16 }}>
        <Text>Privacy and sharing</Text>
      </View>
    </LinearGradient>
  );
}