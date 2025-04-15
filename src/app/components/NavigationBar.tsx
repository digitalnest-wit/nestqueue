"use client";

import { useState } from "react";

export default function NavigationBar() {
  const [didCollapseNavbar, setDidCollapseNavbar] = useState(false);

  function handleOnCollapse() {
    setDidCollapseNavbar(!didCollapseNavbar);
  }

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div>
        <button className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block text-white">
          <span className="absolute inset-0 flex justify-center items-center">
            <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
          </span>
          <a href="/" className="relative z-10">
            NestQueue
          </a>
        </button>
      </div>

      <button type="button" onClick={handleOnCollapse}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="menu-button"
          className="h-6 w-6 hover:cursor-pointer md:hidden block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div
        className={
          "w-full md:flex md:items-center md:w-auto" +
          (didCollapseNavbar ? "" : " hidden")
        }
      >
        <ul className="pt-4 text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li>
            <button className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block text-white">
              <span className="absolute inset-0 flex justify-center items-center">
                <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
              </span>
              <a href="/tickets" className="relative z-10">
                Tickets
              </a>
            </button>
          </li>
          <li>
            <button className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block text-white">
              <span className="absolute inset-0 flex justify-center items-center">
                <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
              </span>
              <a href="/#" className="relative z-10">
                Analytics
              </a>
            </button>
          </li>
          <li>
            <button className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block text-white">
              <span className="absolute inset-0 flex justify-center items-center">
                <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
              </span>
              <a href="/#" className="relative z-10">
                Settings
              </a>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
