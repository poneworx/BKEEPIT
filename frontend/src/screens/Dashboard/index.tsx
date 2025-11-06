import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";
import LineChartMini from "../../components/charts/LineChart";

export default function Dashboard(){
  const { tokens, mode } = useTheme();
  return (
    <LinearGradient colors={tokens.gradient} style={{ flex:1, padding: 20 }}>
      <Text style={[tokens.Text.h1, { color:"#fff", marginBottom:12 }]}>Dashboard</Text>
      <View style={{ ...tokens.Glass(mode), marginBottom: 16 }}>
        <Text style={[tokens.Text.h2, { marginBottom: 8 }]}>Spending trend</Text>
        <LineChartMini />
      </View>
      <View style={{ flexDirection:"row", gap:12 }}>
        <View style={{ ...tokens.Glass(mode), flex:1 }}>
          <Text style={tokens.Text.h2}></Text>
          <Text>Expenses</Text>
        </View>
        <View style={{ ...tokens.Glass(mode), flex:1 }}>
          <Text style={tokens.Text.h2}></Text>
          <Text>Investment</Text>
        </View>
        <View style={{ ...tokens.Glass(mode), flex:1 }}>
          <Text style={tokens.Text.h2}></Text>
          <Text>Budget</Text>
        </View>
      </View>
    </LinearGradient>
  );
}