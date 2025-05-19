"use client";

import { MouseEvent, ReactNode, useState } from "react";
import { CheckIcon } from "./icons";

export interface DropdownProps {
  className?: string;
  value?: string[] | string;
  opts: string[];
  onSelect: (event: MouseEvent<HTMLElement>, opt: string) => void;
  children: ReactNode;
}

export default function Dropdown({ className, value, opts, onSelect, children }: DropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (event: MouseEvent<HTMLElement>, opt: string) => {
    event.stopPropagation();
    onSelect(event, opt);
  };

  const handleBlur = () => setTimeout(() => setIsExpanded(false), 300);

  const isSelected = (opt: string) => {
    if (!value) return false;

    switch (typeof value) {
      case "string":
        return (value as string) === opt;
      default:
        // The only other possible type 'value' can be is string[]
        return (value as string[]).includes(opt);
    }
  };

  return (
    <div>
      <button
        className={`px-1 cursor-pointer transition-colors duration-300 text-gray-600 dark:text-gray-300 rounded ${className}`}
        onClick={handleClick}
        onBlur={handleBlur}
      >
        {children}
      </button>

      {isExpanded && (
        <ul className="absolute z-20 mt-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-2xl">
          {opts.map((opt) => (
            <li
              key={opt}
              onClick={(event) => handleSelect(event, opt)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded`}
            >
              <span className="flex items-center gap-1">
                {isSelected(opt) && <CheckIcon className="absolute -translate-x-3" />}
                <span className="pl-2">{opt}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
