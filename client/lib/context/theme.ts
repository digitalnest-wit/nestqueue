"use client";

import { createContext } from "react";

export type ThemeType = "System" | "Light" | "Dark";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
