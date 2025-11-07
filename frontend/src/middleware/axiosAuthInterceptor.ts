import { AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";

/**
 * Attach token-based authentication interceptors to an Axios instance.
 * This ensures every request carries the user's JWT from secure storage.
 */
export function attachAuthInterceptors(api: AxiosInstance) {
  // Request interceptor: add Authorization header
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("[bkeepit] Failed to attach token:", error);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle unauthorized or expired tokens
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("[bkeepit] Unauthorized – clearing session.");
        await SecureStore.deleteItemAsync("authToken");
        // TODO: optionally trigger a logout or token refresh flow
      }
      return Promise.reject(error);
    }
  );
}
