import { ReactNode } from "react";

export interface ChipProps {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
}

export default function Chip({ children, bgColor, textColor }: ChipProps) {
  if (!bgColor) {
    bgColor = "gray-900";
  }
  if (!textColor) {
    textColor = "white";
  }

  bgColor = `bg-${bgColor}`;
  textColor = `text-${textColor}`;

  return (
    <span className={`rounded-full p-1 px-1.5 ${textColor} ${bgColor}`}>
      {children}
    </span>
  );
}
