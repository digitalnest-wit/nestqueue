"use client";

import { createContext } from "react";

export type ThemeType = "System" | "Light" | "Dark";
export type ResolvedThemeType = "Light" | "Dark";

interface ThemeContextType {
  theme: ThemeType;
  resolvedTheme: ResolvedThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
