"use client";

import useAuth from "@/lib/types/hooks/use-auth";
import { Menu } from "lucide-react"; // Hamburger icon
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// import Button from "./button"; // OPTIONAL: Uncomment if you're using a custom Button component
// import useAuth from "@/lib/hooks/use-auth"; // OPTIONAL: Uncomment if using auth context
// import { auth } from "@/firebase/firebase"; // OPTIONAL: Uncomment if using Firebase auth

export default function NavBar() {
  const { user } = useAuth(); // Get user from auth context
  const [isExpanded, setIsExpanded] = useState(false);

  // Styling for responsive nav links
  const commonLinkStyles = `${isExpanded ? "block" : ""}`;

  // OPTIONAL: Hide navbar if no user is logged in
  // if (user === null) {
  //   return null;
  // }

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div className="my-4">
        <Link className="text-white" href="/">
          <div className="flex items-center gap-3">
            {/* TODO: Replace with your own logo or name */}
            <Image width={24} height={24} src="/your-logo.png" alt="Logo" />
            <span>YourApp</span>
          </div>
        </Link>
      </div>

      {/* Hint: Add a toggle button for mobile using setIsExpanded */}
      <button
        className="block md:hidden text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Menu />
      </button>

      <div className={`w-full md:flex md:items-center md:w-auto ${isExpanded ? "" : "hidden"}`}>
        <ul className="text-base text-white md:flex md:justify-between md:pt-0 md:gap-4">
          {/* TODO: Add your nav links here */}
          <li className="my-4">
            <Link className={commonLinkStyles} href="/page1">
              Page 1
            </Link>
          </li>
          <li className="my-4">
            <Link className={commonLinkStyles} href="/page2">
              Page 2
            </Link>
          </li>
          {/* HINT: Add more links if needed */}
        </ul>

      {user.photoURL ? (
        <Image
          className="rounded-full ml-4 cursor-pointer"
          src={user.photoURL}
          alt={"user avatar"}
          width={40}
          height={40}
          // onClick={() => auth.signOut()} // HINT: Add sign-out functionality if using Firebase
        />
      ) : (
        <span>No Image</span>
      )}
      </div>
    </nav>
  );
}