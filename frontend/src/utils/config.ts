import Constants from "expo-constants";

type AppExtra = {
  apiBaseUrl?: string;
};

export function getConfig() {
  const extra = (Constants.expoConfig?.extra || {}) as AppExtra;

  const envApiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    undefined;

  const apiBaseUrl =
    envApiBaseUrl ||
    extra.apiBaseUrl ||
    "http://localhost:3000";

  return {
    apiBaseUrl
  };
}
