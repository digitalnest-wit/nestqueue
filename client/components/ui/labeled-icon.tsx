"use client";

import { MouseEventHandler, ReactNode } from "react";

interface IconProps {
  className?: string;
  icon: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export default function LabeledIcon({ className, icon, label, onClick }: IconProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </span>
  );
}