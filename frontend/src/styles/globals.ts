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