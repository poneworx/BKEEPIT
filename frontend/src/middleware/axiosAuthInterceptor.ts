import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export function attachAuthInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}