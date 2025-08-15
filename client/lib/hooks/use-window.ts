"use client";

import { useState, useEffect } from "react";

import { WindowSize } from "@/lib/types/window";

export const isMobile = (width: number) => width < 768;
export const isTablet = (width: number) => width >= 768 && width < 1024;
export const isDesktop = (width: number) => width >= 1024;

export default function useWindow(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}