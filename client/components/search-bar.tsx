"use client";

import { ChangeEvent, useState } from "react";

export interface SearchBarProps {
  className?: string;
  placeholder: string;
  onSubmit: (text: string) => void;
}

export function SearchBar({ className, placeholder, onSubmit }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(value);
    }
  };

  return (
    <input
      className={`border border-gray-200 p-1 px-2 rounded ${className}`}
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
