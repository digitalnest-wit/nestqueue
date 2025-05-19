import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ className, children, type, disabled, onClick }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer p-1 px-1.5 block ${className} transition-all duration-300 ease-out`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
