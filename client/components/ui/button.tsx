import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ className, children, onClick }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer p-1 px-1.5 block ${className} transition-all duration-300 ease-out text-white`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
