import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute hover:cursor-pointer top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
