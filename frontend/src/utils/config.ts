import Constants from "expo-constants";

type AppExtra = {
  apiBaseUrl?: string;
};

export function getConfig() {
  const extra = (Constants?.expoConfig?.extra || {}) as AppExtra;
  if (!extra.apiBaseUrl) {
    throw new Error("Missing extra.apiBaseUrl in app.json");
  }
  return {
    apiBaseUrl: extra.apiBaseUrl
  };
}