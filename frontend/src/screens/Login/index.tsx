import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BrandKitHeader from "../../components/branding/BrandKit";
import useTheme from "../../hooks/useTheme";

export default function Login(){
  const { tokens, mode } = useTheme();
  return (
    <LinearGradient colors={tokens.gradient} style={{ flex:1, padding: 20, justifyContent:"center" }}>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <BrandKitHeader />
      </View>
      <View style={ { ...tokens.Glass(mode), alignSelf:"center", width:"100%", maxWidth: 360 } }>
        <Text style={[{ marginBottom: 12 }, tokens.Text.h2]}>Welcome Back</Text>
        <TextInput placeholder="Email" placeholderTextColor="#8BA0A6" style={{ backgroundColor:"rgba(255,255,255,0.08)", borderRadius:12, padding:12, marginBottom:12 }} />
        <TextInput placeholder="Password" placeholderTextColor="#8BA0A6" secureTextEntry style={{ backgroundColor:"rgba(255,255,255,0.08)", borderRadius:12, padding:12, marginBottom:16 }} />
        <Pressable style={{ backgroundColor: tokens.primary, padding:14, borderRadius:12, alignItems:"center" }}>
          <Text style={{ color:"#fff", fontWeight:"700" }}>Sign In</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}