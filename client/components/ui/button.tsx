"use client";

import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  children: Readonly<ReactNode>;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  className = "",
  children,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`py-2 px-4 font-semibold ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
