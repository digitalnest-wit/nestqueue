"use client";

import { useState } from "react";
import Button from "./button";
import { ThreeHorizontalLinesIcon } from "./icons";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/lib/hooks/use-auth";

export default function NavBar() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const commonLinkStyles = `${isExpanded ? "block" : ""}`;

  if (user === null) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div className="my-4">
        <Link className="text-white" href="/">
          <div className="flex items-center gap-3">
            <Image width={24} height={24} src="/digitalnest-logo.png" alt="" />
            NestQueue
          </div>
        </Link>
      </div>

      <Button className="block md:hidden" onClick={() => setIsExpanded(!isExpanded)}>
        <ThreeHorizontalLinesIcon />
      </Button>

      <div className={`w-full md:flex md:items-center md:w-auto ${isExpanded ? "" : "hidden"}`}>
        <ul className="text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li className="my-4">
            <Link className={commonLinkStyles} href="/tickets">
              Tickets
            </Link>
          </li>
          <li className="my-4">
            <Link className={commonLinkStyles} href="/analytics">
              Analytics
            </Link>
          </li>
          <li className="my-4">
            <Link className={commonLinkStyles} href="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
