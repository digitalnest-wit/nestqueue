import { createContext } from "react";

export type ToastType = "Success" | "Error" | "Info" | "Warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  durationMs?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, durationMs?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);