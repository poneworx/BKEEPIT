import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // 🔐 Login and persist token
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Save token securely for interceptors
      await SecureStore.setItemAsync("authToken", token);
      set({ user, token, loading: false });
      console.log("[bkeepit] Logged in:", user.email);
    } catch (err: any) {
      console.error("[bkeepit] Login failed:", err.message);
      set({ error: err.message, loading: false });
    }
  },

  // 🚪 Logout and clear everything
  logout: async () => {
    await SecureStore.deleteItemAsync("authToken");
    set({ user: null, token: null });
    console.log("[bkeepit] Logged out");
  },

  // 🔄 Restore token/session on app launch
  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        set({ token });
        // Optionally fetch user profile here:
        const res = await api.get("/auth/me");
        set({ user: res.data });
        console.log("[bkeepit] Session restored for:", res.data.email);
      }
    } catch (err) {
      console.warn("[bkeepit] Session restore failed:", err);
      set({ token: null, user: null });
    }
  },
}));
