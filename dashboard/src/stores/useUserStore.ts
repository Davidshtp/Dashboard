import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string; 
  avatar?: string | null;
  resetCode?: string | null; 
}

interface UserState {
  users: User[]; 
  currentUser: User | null; 

  register: (user: User) => "success" | "email-exists";
  login: (email: string, password: string) => "success" | "user-not-found" | "wrong-password";
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => "success" | "user-not-found";
  updateCurrentUser: (partial: Partial<User>) => "success" | "no-current-user";
  updateEmail: (newEmail: string) => "success" | "email-exists" | "no-current-user";
  changePassword: (currentPassword: string, newPassword: string) => "success" | "no-current-user" | "wrong-current";

  // Funciones de recuperación de contraseña
  setResetCode: (email: string, code: string) => "success" | "user-not-found";
  verifyResetCode: (email: string, code: string) => boolean;
  clearResetCode: (email: string) => void;
}

export const useUserStore = create<UserState>()(
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

    updateCurrentUser: (partial) => {
      const curr = get().currentUser;
      if (!curr) return "no-current-user";
      if (partial.email && partial.email !== curr.email) {
        const exists = get().users.find(u => u.email === partial.email);
        if (exists) return "email-exists" as any;
      }
      const updated = { ...curr, ...partial } as User;
      const users = get().users.map(u => (u.id === curr.id ? updated : u));
      set({ users, currentUser: updated });
      return "success";
    },

    updateEmail: (newEmail) => {
      const curr = get().currentUser;
      if (!curr) return "no-current-user";
      if (newEmail !== curr.email) {
        const exists = get().users.find(u => u.email === newEmail);
        if (exists) return "email-exists";
      }
      const updated = { ...curr, email: newEmail } as User;
      const users = get().users.map(u => (u.id === curr.id ? updated : u));
      set({ users, currentUser: updated });
      return "success";
    },

    changePassword: (currentPassword, newPassword) => {
      const curr = get().currentUser;
      if (!curr) return "no-current-user";
      if (curr.password !== currentPassword) return "wrong-current";
      const updated = { ...curr, password: newPassword } as User;
      const users = get().users.map(u => (u.id === curr.id ? updated : u));
      set({ users, currentUser: updated });
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
  })
);
