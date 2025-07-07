"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "./button";

export default function Navigation() {
  const [expanded, setExpanded] = useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
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

      <Button className="block md:hidden" onClick={handleExpandClick}>
        <Menu className="text-white" />
      </Button>

      <div
        className={`w-full md:flex md:items-center md:w-auto ${
          expanded ? "" : "hidden"
        }`}
      >
        <ul className="text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          <li className="my-4">
            <Link className={expanded ? "block" : ""} href="/">
              Tickets
            </Link>
          </li>
          <li className="my-4">
            <Link
              className={expanded ? "block" : ""}
              href="https://digitalnest.org/"
              target="_blank"
            >
              Digital NEST
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
