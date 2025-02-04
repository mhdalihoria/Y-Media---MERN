import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userId: string | null; // Optionally, define a proper type for your user
  setToken: (token: string | null) => void;
  setUser: (userId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      setToken: (token: string | null) => set({ token }),
      setUser: (userId: string | null) => set({ userId }),
      clearAuth: () => set({ token: null, userId: null }),
    }),
    {
      name: "auth", 
    }
  )
);
