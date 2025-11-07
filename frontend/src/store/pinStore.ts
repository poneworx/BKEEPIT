import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

interface PinState {
  hasPin: boolean;
  loading: boolean;
  error: string | null;

  setPin: (pin: string) => Promise<void>;
  verifyPin: (input: string) => Promise<boolean>;
  clearPin: () => Promise<void>;
  checkIfPinExists: () => Promise<void>;
}

export const usePinStore = create<PinState>((set) => ({
  hasPin: false,
  loading: false,
  error: null,

  // ✅ Set or reset a PIN
  setPin: async (pin) => {
    set({ loading: true, error: null });
    try {
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        pin
      );
      await SecureStore.setItemAsync("userPIN", hash);
      set({ hasPin: true, loading: false });
      console.log("[bkeepit] PIN set successfully");
    } catch (err: any) {
      console.error("[bkeepit] Failed to set PIN:", err.message);
      set({ error: err.message, loading: false });
    }
  },

  // 🔒 Verify entered PIN
  verifyPin: async (input) => {
    try {
      const stored = await SecureStore.getItemAsync("userPIN");
      if (!stored) {
        console.warn("[bkeepit] No PIN found in storage");
        return false;
      }
      const inputHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        input
      );
      const valid = stored === inputHash;
      console.log("[bkeepit] PIN validation:", valid ? "ok" : "fail");
      return valid;
    } catch (err) {
      console.error("[bkeepit] PIN verification error:", err);
      return false;
    }
  },

  // 🚪 Clear saved PIN
  clearPin: async () => {
    await SecureStore.deleteItemAsync("userPIN");
    set({ hasPin: false });
    console.log("[bkeepit] PIN cleared");
  },

  // 📍 Check if a PIN exists on app start
  checkIfPinExists: async () => {
    try {
      const stored = await SecureStore.getItemAsync("userPIN");
      set({ hasPin: !!stored });
      console.log("[bkeepit] PIN present:", !!stored);
    } catch (err) {
      console.warn("[bkeepit] Failed to read PIN:", err);
      set({ hasPin: false });
    }
  },
}));
