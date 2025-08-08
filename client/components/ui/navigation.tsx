"use client";

import useAuth from "@/lib/hooks/use-auth";
import { Menu } from "lucide-react"; // Hamburger icon
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Use for navigation if needed

 import Button from "./button"; // OPTIONAL: Uncomment if you're using a custom Button component
 import { auth } from "@/firebase"; // OPTIONAL: Uncomment if using Firebase auth
// import router from "next/dist/shared/lib/router/router";

export default function NavBar() {
  const { user } = useAuth(); // Get user from auth context
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();


  // Styling for responsive nav links
  const commonLinkStyles = `${isExpanded ? "block" : ""}`;

  // OPTIONAL: Hide navbar if no user is logged in
  if (user === null) {
     return null;
   }

   const handleSignOut = async () => {
     await auth.signOut();
    router.push("/"); // Redirect to home after sign out
   };

  return (
    <nav className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg bg-gray-900">
      <div className="my-4">
        <Link className="text-white" href="/tickets">
          <div className="flex items-center gap-3">
            {/* TODO: Replace with your own logo or name */}
            <Image width={24} height={24} src="/favicon.ico" alt="Logo" />
            <span>NestQueue</span>
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
            <Link className={commonLinkStyles} href="/tickets">
              Tickets
            </Link>
          </li>
          <li className="my-4">
            <Link className={commonLinkStyles} href="/user">
              Users
            </Link>
          </li>
        </ul>

      {user.photoURL ? (
        <Image
          className="rounded-full ml-4 cursor-pointer"
          src={user.photoURL || "/default-profile.jpg"}
          alt={"user avatar"}
          width={40}
          height={40}
          onClick={handleSignOut} 
        />
      ) : (
        <span>No Image</span>
      )}
      </div>
    </nav>
  );
}