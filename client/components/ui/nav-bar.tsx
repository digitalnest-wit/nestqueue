"use client";

import { useState } from "react";
import Button from "./button";
import { ThreeHorizontalLinesIcon } from "./icons";
import Link from "next/link";

export default function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div className="my-4">
        <Link className="text-white" href="/">
          -&gt; NestQueue
        </Link>
      </div>

      <Button onClick={() => setIsExpanded(!isExpanded)}>
        <ThreeHorizontalLinesIcon />
      </Button>

      <div className={`w-full md:flex md:items-center md:w-auto ${isExpanded ? "" : "hidden"}`}>
        <ul className="pt-4 text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li className="my-4">
            <Link className={``} href="/tickets">
              Tickets
            </Link>
          </li>
          <li className="my-4">
            <Link className={``} href="/analytics">
              Analytics
            </Link>
          </li>
          <li className="my-4">
            <Link className={``} href="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
