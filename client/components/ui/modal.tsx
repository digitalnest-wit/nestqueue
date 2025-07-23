import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  active: boolean;
}

export default function Modal({ children, active }: ModalProps) {
  if (!active) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-lg bg-gray-50 p-1 shadow-lg">
        <div>{children}</div>
      </div>
    </div>
  );
}
