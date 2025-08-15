import { ChangeEventHandler, ReactNode } from "react";

interface FormSelectInputProps {
  className?: string;
  label: string;
  name?: string;
  value?: string | number;
  options: Readonly<string[] | number[]>;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  icon?: ReactNode;
}

export default function FormSelectInput({
  className = "",
  label,
  name,
  value,
  options,
  onChange,
  icon,
}: FormSelectInputProps) {
  name = name || label;

  const labelTokens = label.toLowerCase().split(" ");
  const elementName = labelTokens
    .map((token, index) =>
      index === 0 ? token : token[0].toUpperCase() + token.substring(1)
    )
    .reduce((prev, curr) => prev + curr);

  return (
    <div className={className}>
      {icon ? (
        <label
          className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-1"
          htmlFor={elementName}
        >
          <div className="flex gap-2 items-center mr-1">
            {icon}
            <span>{label}</span>
          </div>
        </label>
      ) : (
        <label
          className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
          htmlFor={elementName}
        >
          {label}
        </label>
      )}

      <select
        id={elementName}
        name={elementName}
        value={value || ""}
        onChange={onChange}
        className="w-full p-1.5 border border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 focus:outline-1 focus:outline-green-500 rounded-md"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
