// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./useUserStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });

        localStorage.removeItem("auth-storage");
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
