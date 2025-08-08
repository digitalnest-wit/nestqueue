"use client";

import { useEffect } from "react";

export function ThemeApplicator() {
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("theme");
      document.documentElement.classList.toggle(
        "dark",
        theme === "Dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    };

    applyTheme();
  }, []);

  return null;
}