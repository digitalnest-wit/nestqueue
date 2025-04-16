"use client";

import { useState } from "react";
import Button from "./Button";

export default function NavigationBar() {
  const [didCollapseNavbar, setDidCollapseNavbar] = useState(false);

  function handleOnCollapse() {
    setDidCollapseNavbar(!didCollapseNavbar);
  }

  const expandButtonIcon = (
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
  );

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div>
        <Button>
          <a href="/" className="relative z-10">
            NestQueue
          </a>
        </Button>
      </div>

      <button type="button" onClick={handleOnCollapse}>
        {expandButtonIcon}
      </button>

      <div
        className={
          "w-full md:flex md:items-center md:w-auto" +
          (didCollapseNavbar ? "" : " hidden")
        }
      >
        <ul className="pt-4 text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li>
            <Button>
              <a href="/tickets" className="relative z-10">
                Tickets
              </a>
            </Button>
          </li>
          <li>
            <Button>
              <a href="/#" className="relative z-10">
                Analytics
              </a>
            </Button>
          </li>
          <li>
            <Button>
              <a href="/#" className="relative z-10">
                Settings
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
