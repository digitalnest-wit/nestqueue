import { ReactNode } from "react";

interface ModalProps {
  active: boolean;
  children: ReactNode;
}

export default function Modal({ active, children }: ModalProps) {
  if (!active) return null;

  return (
    <div className="fixed backdrop-blur-xs inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-50 dark:bg-gray-900 p-1 rounded-lg animate-grow shadow-lg w-full max-w-lg relative">
        {children}
      </div>
    </div>
  );
}
