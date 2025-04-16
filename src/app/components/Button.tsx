import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block bg-gray-900 text-white"
      onClick={onClick}
    >
      <span className="absolute inset-0 flex justify-center items-center">
        <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
      </span>
      {children}
    </button>
  );
}
