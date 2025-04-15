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
        <a className="text-white" href="/">
          NestQueue
        </a>
      </div>

      <button type="button" onClick={handleOnCollapse}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="menu-button"
          className="h-6 w-6 cursor-pointer md:hidden block"
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
          "w-full md:flex md:items-center md:w-auto " +
          (didCollapseNavbar ? "" : "hidden")
        }
      >
        <ul className="pt-4 text-base text-white md:flex md:justify-between md:pt-0">
          <li>
            <a
              className="md:p-4 py-2 block hover:text-pink-400"
              href="/tickets"
            >
              Tickets
            </a>
          </li>
          <li>
            <a className="md:p-4 py-2 block hover:text-pink-400" href="#">
              Analytics
            </a>
          </li>
          <li>
            <a className="md:p-4 py-2 block hover:text-pink-400" href="#">
              Settings
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
