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