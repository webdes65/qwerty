import { create } from "zustand";
import { persist } from "zustand/middleware";

const UseDarkModeStore = create(
  persist(
    (set, get) => ({
      darkMode: false,
      useSystemTheme: true,

      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode, useSystemTheme: false });

        if (newDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      setDarkMode: (value, fromSystem = false) => {
        set({
          darkMode: value,
          useSystemTheme: fromSystem ? get().useSystemTheme : false,
        });

        if (value) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      enableSystemTheme: () => {
        set({ useSystemTheme: true });
      },

      disableSystemTheme: () => {
        set({ useSystemTheme: false });
      },

      initializeDarkMode: () => {
        const { darkMode } = get();
        if (darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }),
    {
      name: "dark-mode-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        useSystemTheme: state.useSystemTheme,
      }),
    },
  ),
);

export default UseDarkModeStore;
