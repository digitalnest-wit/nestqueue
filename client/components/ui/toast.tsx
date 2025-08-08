"use client";
import { Toast, ToastContext, ToastType } from "@/lib/context/toast";
import { useToast } from "@/lib/hooks/use-toast";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export default function ToastProvider({ children }: { children: Readonly<ReactNode> }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, durationMs?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, type, durationMs };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  useEffect(() => {
    if (toast.durationMs) {
      const timer = setTimeout(() => onClose(toast.id), toast.durationMs);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const icons = {
    Success: <CheckCircle className="w-5 h-5" />,
    Error: <AlertCircle className="w-5 h-5" />,
    Info: <Info className="w-5 h-5" />,
    Warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    Success: "bg-green-100 border-green-400 text-green-800",
    Error: "bg-red-100 border-red-400 text-red-800",
    Info: "bg-blue-100 border-blue-400 text-blue-800",
    Warning: "bg-yellow-100 border-yellow-400 text-yellow-800",
  };

  return (
    <div
      className={`flex items-center justify-between w-full max-w-sm p-4 mb-3 border rounded-lg shadow-lg ${
        colors[toast.type]
      } animate-slideIn`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3 text-sm font-medium">{icons[toast.type]}</div>
        <div>{toast.message}</div>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-opacity-20 hover:bg-gray-700 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 flex flex-col z-50 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}