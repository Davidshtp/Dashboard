// stores/authStore.ts
import { create } from "zustand";
import { User } from "./useUserStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    isAuthenticated: false,

    login: (user: User) => {
      set({ user, isAuthenticated: true });
    },

    logout: () => {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem("auth-token");
    },

    setUser: (user: User) => set({ user, isAuthenticated: true }),
  })
);
