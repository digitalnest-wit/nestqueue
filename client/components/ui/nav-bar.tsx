"use client";

import { useState } from "react";
import Button from "./button";
import { ThreeHorizontalLinesIcon } from "./icons";

export default function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleClick() {
    setIsExpanded(!isExpanded);
  }

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div className="my-4">
        <a href="/" className="text-white">
          NESTQueue
        </a>
      </div>

      <Button onClick={handleClick}>
        <ThreeHorizontalLinesIcon />
      </Button>

      <div className={"w-full md:flex md:items-center md:w-auto " + (isExpanded ? "" : "hidden")}>
        <ul className="pt-4 text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li className="my-1">
            <a href="/tickets" className="">
              Tickets
            </a>
          </li>
          <li className="my-1">
            <a href="/#" className="">
              Analytics
            </a>
          </li>
          <li className="my-1">
            <a href="/#" className="">
              Settings
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
