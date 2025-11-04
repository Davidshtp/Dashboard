import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeSettings {
  primary: string;
  secondary100: string;
  secondary900: string;
}

interface ThemeState extends ThemeSettings {
  setPrimary: (color: string) => void;
  setSecondary100: (color: string) => void;
  setSecondary900: (color: string) => void;
  reset: () => void;
}

const DEFAULT_THEME: ThemeSettings = {
  primary: "#BDEB00",
  secondary100: "#1E1F25",
  secondary900: "#131517",
};

export const applyThemeToDocument = (theme: ThemeSettings) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary-100", theme.secondary100);
  root.style.setProperty("--color-secondary-900", theme.secondary900);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_THEME,
      setPrimary: (color) => {
        set({ primary: color });
        applyThemeToDocument({
          primary: color,
          secondary100: get().secondary100,
          secondary900: get().secondary900,
        });
      },
      setSecondary100: (color) => {
        set({ secondary100: color });
        applyThemeToDocument({
          primary: get().primary,
          secondary100: color,
          secondary900: get().secondary900,
        });
      },
      setSecondary900: (color) => {
        set({ secondary900: color });
        applyThemeToDocument({
          primary: get().primary,
          secondary100: get().secondary100,
          secondary900: color,
        });
      },
      reset: () => {
        set({ ...DEFAULT_THEME });
        applyThemeToDocument(DEFAULT_THEME);
      },
    }),
    {
      name: "theme-settings",
      onRehydrateStorage: () => (state) => {
        // Aplica el tema guardado al rehidratar
        if (!state) return;
        const theme: ThemeSettings = {
          primary: state.primary,
          secondary100: state.secondary100,
          secondary900: state.secondary900,
        };
        applyThemeToDocument(theme);
      },
    }
  )
);

// Llamar al inicio de la app para asegurar variables aplicadas aun sin rehidratación
export const initTheme = () => {
  if (typeof document === "undefined") return;
  const { primary, secondary100, secondary900 } = useThemeStore.getState();
  applyThemeToDocument({ primary, secondary100, secondary900 });
};
