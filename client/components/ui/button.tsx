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
      className={`py-1 px-2 cursor-pointer ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
