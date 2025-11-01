import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string; 
  resetCode?: string | null; 
}

interface UserState {
  users: User[]; 
  currentUser: User | null; 

  register: (user: User) => "success" | "email-exists";
  login: (email: string, password: string) => "success" | "user-not-found" | "wrong-password";
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => "success" | "user-not-found";

  // Funciones de recuperación de contraseña
  setResetCode: (email: string, code: string) => "success" | "user-not-found";
  verifyResetCode: (email: string, code: string) => boolean;
  clearResetCode: (email: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      // Registrar usuario
      register: (user) => {
        const exists = get().users.find(u => u.email === user.email);
        if (exists) return "email-exists";
        set({ users: [...get().users, user] });
        return "success";
      },

      // Login
      login: (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (!user) return "user-not-found";
        if (user.password !== password) return "wrong-password";
        set({ currentUser: user });
        return "success";
      },

      // Logout
      logout: () => set({ currentUser: null }),

      // Reset password
      resetPassword: (email, newPassword) => {
        const users = get().users.map(u =>
          u.email === email ? { ...u, password: newPassword, resetCode: null } : u
        );
        const exists = users.find(u => u.email === email);
        if (!exists) return "user-not-found";
        set({ users });
        return "success";
      },

      // Guardar código temporal en el usuario
      setResetCode: (email, code) => {
        const users = get().users.map(u =>
          u.email === email ? { ...u, resetCode: code } : u
        );
        const exists = users.find(u => u.email === email);
        if (!exists) return "user-not-found";
        set({ users });
        return "success";
      },

      // Verificar código temporal
      verifyResetCode: (email, code) => {
        const user = get().users.find(u => u.email === email);
        if (!user || !user.resetCode) return false;
        return user.resetCode === code;
      },

      // Limpiar código temporal
      clearResetCode: (email) => {
        const users = get().users.map(u =>
          u.email === email ? { ...u, resetCode: null } : u
        );
        set({ users });
      },
    }),
    {
      name: "users-storage", // clave en LocalStorage
    }
  )
);
