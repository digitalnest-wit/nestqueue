import { ThemeContext, ThemeType } from "@/lib/context/theme";
import { ReactNode, useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: Readonly<ReactNode> }) {
  const [theme, setTheme] = useState<ThemeType>("System");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeType | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (theme === "System") {
        // For system preference
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      } else {
        // For explicit user choice
        document.documentElement.classList.toggle("dark", theme === "Dark");
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === "System") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const _setTheme = (newTheme: ThemeType) => {
    if (newTheme === "System") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newTheme);
    }
    setTheme(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme: _setTheme }}>{children}</ThemeContext.Provider>;
}
