"use client";

import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: Readonly<ReactNode>;
  role?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={`py-2 px-4 font-semibold ${className}`} {...props}>
      {children}
    </button>
  );
}
