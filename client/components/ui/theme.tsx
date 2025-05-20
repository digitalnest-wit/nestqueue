import { ThemeContext, ThemeType } from "@/lib/context/theme";
import { ReactNode, useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: Readonly<ReactNode> }) {
  const [theme, setTheme] = useState<ThemeType>("System");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === null) {
      localStorage.setItem("theme", "System");
      return;
    }

    const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const willToggleDarkMode = (storedTheme as ThemeType) === "Dark" || prefersDarkTheme;
    document.documentElement.classList.toggle("dark", willToggleDarkMode);
  }, [theme, setTheme]);

  const _setTheme = (theme: ThemeType) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme: _setTheme }}>{children}</ThemeContext.Provider>;
}
