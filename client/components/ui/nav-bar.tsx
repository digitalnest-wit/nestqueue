"use client";

import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useState } from "react";

import Button from "./button";
import Dropdown from "./dropdown";
import { ThemeType } from "@/lib/context/theme";
import { useTheme } from "@/lib/hooks/use-theme";
import useAuth from "@/lib/hooks/use-auth";

export default function NavBar() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();

  const themes: ThemeType[] = ["System", "Light", "Dark"];
  const commonLinkStyles = `${isExpanded ? "block" : ""}`;

  const handleSelect = (_: MouseEvent<HTMLElement>, selection: string) => {
    const themeSelected = selection as ThemeType;
    setTheme(themeSelected);
  };

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
        <Menu />
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
          <li className="inline-block my-3">
            <Dropdown className="p-1 rounded-full bg-gray-900 hover:bg-gray-800" value={theme} opts={themes} onSelect={handleSelect}>
              <Moon />
            </Dropdown>
          </li>
        </ul>
      </div>
    </nav>
  );
}
