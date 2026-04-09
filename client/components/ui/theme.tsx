"use client";

import { ThemeContext, ThemeType, ResolvedThemeType } from "@/lib/context/theme";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function ThemeProvider({ children }: { children: Readonly<ReactNode> }) {
  const [theme, setTheme] = useState<ThemeType>("System");
  const [systemTheme, setSystemTheme] = useState<ResolvedThemeType>("Light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeType | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const readSystemTheme = (): ResolvedThemeType => (mediaQuery.matches ? "Dark" : "Light");
    setSystemTheme(readSystemTheme());

    const applyTheme = () => {
      const isDark = theme === "System" ? mediaQuery.matches : theme === "Dark";
      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();

    const handleChange = () => {
      setSystemTheme(readSystemTheme());
      applyTheme();
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const resolvedTheme = useMemo<ResolvedThemeType>(() => {
    if (theme === "System") {
      return systemTheme;
    }

    return theme;
  }, [systemTheme, theme]);

  const _setTheme = (newTheme: ThemeType) => {
    if (newTheme === "System") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: _setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
