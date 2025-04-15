"use client";

import { useState, useEffect } from "react";

import { WindowSize } from "../types/window";

export default function useWindowSize(): WindowSize {
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
