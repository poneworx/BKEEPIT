# scripts/Setup-UIPass.ps1
# BKEEPIT UI pass: themes, navigation, Login, Dashboard, Settings, charts
# Usage:
#   .\scripts\Setup-UIPass.ps1 -DryRun
#   .\scripts\Setup-UIPass.ps1

param([switch]$DryRun)
$ErrorActionPreference = "Stop"

function Log($m){ $ts = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"; Write-Host "$ts - $m" }
function EnsureDir($p){ if(!(Test-Path $p)){ if($DryRun){Log "Would create dir: $p"} else{ New-Item -ItemType Directory -Force -Path $p | Out-Null; Log "Created dir: $p"} } }
function WriteUtf8($path,$content){
  EnsureDir (Split-Path $path -Parent)
  if($DryRun){ Log "Would write: $path" } else {
    $enc = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $enc)
    Log "Wrote: $path"
  }
}

$root = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "..")).Path
$fe   = Join-Path $root "frontend"
$src  = Join-Path $fe   "src"
$styles = Join-Path $src "styles"
$branding = Join-Path $src "components\branding"
$charts = Join-Path $src "components\charts"
$screens = Join-Path $src "screens"
$loginDir = Join-Path $screens "Login"
$dashDir  = Join-Path $screens "Dashboard"
$settingsDir = Join-Path $screens "Settings"
$nav = Join-Path $src "navigation"
$hooks = Join-Path $src "hooks"
$assetsIcons = Join-Path $src "assets\icons"

EnsureDir $styles
EnsureDir $branding
EnsureDir $charts
EnsureDir $loginDir
EnsureDir $dashDir
EnsureDir $settingsDir
EnsureDir $nav
EnsureDir $hooks
EnsureDir $assetsIcons

# 1) Theme tokens with light and dark, gradients, glass helpers
$globalsTs = @"
const Colors = {
  teal: "#39ABAE",
  magenta: "#E6457C",
  purple: "#A20CDD",
  navy: "#1B2330",
  sand: "#F4EBE8",
  mint: "#A1ECE3",
  eblue: "#3C75FF",
  orange: "#FF884C",
};

export type ThemeMode = "light" | "dark";

export const Theme = {
  light: {
    mode: "light" as ThemeMode,
    bg: Colors.sand,
    text: "#17202A",
    primary: Colors.teal,
    accent: Colors.magenta,
    card: "rgba(255,255,255,0.9)",
    border: "rgba(0,0,0,0.08)",
    shadow: "0 4px 16px rgba(0,0,0,0.08)",
    gradient: ["#167A84","#8D2BB7"],
  },
  dark: {
    mode: "dark" as ThemeMode,
    bg: Colors.navy,
    text: "#F3F6F9",
    primary: Colors.teal,
    accent: Colors.magenta,
    card: "rgba(20,20,28,0.6)",
    border: "rgba(255,255,255,0.08)",
    shadow: "0 6px 24px rgba(0,0,0,0.45)",
    gradient: ["#1B2350","#9E2CCF"],
  },
  Colors,
  Spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  Radius: { sm: 6, md: 12, lg: 20 },
  Text: {
    h1: { fontSize: 32, fontWeight: "700" as const },
    h2: { fontSize: 24, fontWeight: "700" as const },
    p:  { fontSize: 16, fontWeight: "400" as const },
  },
  Glass: (mode: ThemeMode) => ({
    backgroundColor: mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(20,20,28,0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
  })
};

export default Theme;
"@
WriteUtf8 (Join-Path $styles "globals.ts") $globalsTs

# 2) Simple theme hook
$useTheme = @"
import { useColorScheme } from "react-native";
import Theme, { ThemeMode } from "../styles/globals";
import { useState, useMemo } from "react";

export default function useTheme() {
  const scheme = useColorScheme();
  const [override, setOverride] = useState<ThemeMode|null>(null);
  const mode = override ?? (scheme === "dark" ? "dark" : "light");
  const tokens = useMemo(() => (mode === "dark" ? Theme.dark : Theme.light), [mode]);
  return { mode, tokens, setOverride };
}
"@
WriteUtf8 (Join-Path $hooks "useTheme.ts") $useTheme

# 3) BrandKit header using text plus optional icons if present
$brandKit = @"
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
"@
WriteUtf8 (Join-Path $branding "BrandKit.tsx") $brandKit

# 4) Navigation
$appNav = @"
import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";
import Settings from "../screens/Settings";
import useTheme from "../hooks/useTheme";
import { View, Text } from "react-native";

function Receipts() { return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Receipts</Text></View>; }
function Reports()  { return <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}><Text>Reports</Text></View>; }

const Tab = createBottomTabNavigator();

export default function AppNavigator(){
  const { mode, tokens } = useTheme();
  const navTheme = mode === "dark" ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: mode === "dark" ? "#0F1520" : "#0E3A44" },
          tabBarActiveTintColor: tokens.primary,
        }}>
        <Tab.Screen name="Home" component={Dashboard} />
        <Tab.Screen name="Receipts" component={Receipts} />
        <Tab.Screen name="Reports" component={Reports} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
"@
WriteUtf8 (Join-Path $nav "AppNavigator.tsx") $appNav

$authNav = @"
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

export default function AuthNavigator(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
"@
WriteUtf8 (Join-Path $nav "AuthNavigator.tsx") $authNav

# 5) Charts using victory-native
$lineChart = @"
import React from "react";
import { View } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme, VictoryArea, VictoryAxis } from "victory-native";

type P = { dataA?: {x:number,y:number}[]; dataB?: {x:number,y:number}[]; colorA?: string; colorB?: string; };
export default function LineChartMini({ dataA, dataB, colorA = "#39ABAE", colorB = "#E6457C" }: P){
  const a = dataA ?? [{x:1,y:420},{x:2,y:460},{x:3,y:500},{x:4,y:560}];
  const b = dataB ?? [{x:1,y:380},{x:2,y:410},{x:3,y:470},{x:4,y:750}];
  return (
    <View style={{ height: 180 }}>
      <VictoryChart theme={VictoryTheme.material} height={180} padding={{ top:20,left:40,right:20,bottom:30 }}>
        <VictoryAxis tickFormat={() => ""} />
        <VictoryAxis dependentAxis style={{ tickLabels:{ fontSize: 10 } }} />
        <VictoryArea data={a} style={{ data:{ fill: colorA+"33", stroke: colorA, strokeWidth: 2 }}} />
        <VictoryLine data={b} style={{ data:{ stroke: colorB, strokeWidth: 2 }}} />
      </VictoryChart>
    </View>
  );
}
"@
WriteUtf8 (Join-Path $charts "LineChart.tsx") $lineChart

# 6) Screens
$login = @"
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
"@
WriteUtf8 (Join-Path $loginDir "index.tsx") $login

$dashboard = @"
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
          <Text style={tokens.Text.h2}>$420</Text>
          <Text>Expenses</Text>
        </View>
        <View style={{ ...tokens.Glass(mode), flex:1 }}>
          <Text style={tokens.Text.h2}>$560</Text>
          <Text>Investment</Text>
        </View>
        <View style={{ ...tokens.Glass(mode), flex:1 }}>
          <Text style={tokens.Text.h2}>$750</Text>
          <Text>Budget</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
"@
WriteUtf8 (Join-Path $dashDir "index.tsx") $dashboard

$settings = @"
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
"@
WriteUtf8 (Join-Path $settingsDir "index.tsx") $settings

# 7) Minimal screen re-exports for navigators
WriteUtf8 (Join-Path $screens 'Dashboard.tsx') 'export { default } from "./Dashboard";'
WriteUtf8 (Join-Path $screens 'Settings.tsx') 'export { default } from "./Settings";'
WriteUtf8 (Join-Path $screens 'Login.tsx') 'export { default } from "./Login";'

# 8) App.tsx to switch between Auth and App stacks (simple placeholder flag)
$appTsx = @"
import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
const isAuthed = true;

export default function App(){
  return (
    <>
      <StatusBar style="light" />
      {isAuthed ? <AppNavigator /> : <AuthNavigator />}
    </>
  );
}
"@
WriteUtf8 (Join-Path $src "App.tsx") $appTsx

Log "UI pass script finished."
