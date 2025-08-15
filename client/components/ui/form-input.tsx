import { ChangeEventHandler, ReactNode } from "react";

interface FormTextInputProps {
  className?: string;
  label: string;
  name?: string;
  rows?: number;
  value?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  icon?: ReactNode;
  placeholder: string;
  required?: boolean;
}

export default function FormTextInput({
  className = "",
  label,
  name,
  rows = 1,
  value = "",
  onChange,
  icon,
  placeholder,
  required = false,
}: FormTextInputProps) {
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
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          htmlFor={elementName}
        >
          <div className="flex gap-2 items-center mr-1">
            {icon}
            {label}
            {required && <span className="text-red-500">*</span>}
          </div>
        </label>
      ) : (
        <label
          className="text-sm font-medium text-gray-700 mb-1"
          htmlFor={elementName}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <textarea
        id={elementName}
        className="w-full p-1.5 border border-gray-300 text-gray-700 rounded-md"
        name={elementName}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
