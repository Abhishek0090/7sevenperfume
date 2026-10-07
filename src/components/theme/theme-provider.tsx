"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "7seven-theme";

/** Light is the default; dark is used only when the visitor has chosen it. */
const DEFAULT_THEME: Theme = "light";

/** Runs in <head> before first paint so a saved dark choice never flashes light. */
export const themeInitScript = `(function(){try{document.documentElement.classList.toggle("dark",localStorage.getItem("${STORAGE_KEY}")==="dark")}catch(e){}})();`;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Server render uses the default; a saved choice is read from <html> after mount.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the class set by themeInitScript
      setThemeState("dark");
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // Briefly disable transitions so every element switches colour at once.
    root.classList.add("[&_*]:!transition-none");
    root.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    requestAnimationFrame(() => root.classList.remove("[&_*]:!transition-none"));
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within <ThemeProvider>");
  return context;
}
