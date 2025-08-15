"use client";
import LoginPage from "@/app/login/page";
import { useAuth } from "@/lib/context/auth";
import TicketsPage from "@/app/(protected)/tickets/page";

export default function Home() {
  const { user } = useAuth();


  if (typeof user === "undefined") {
    return <div>Loading...</div>;
  }

  return user ? <TicketsPage /> : <LoginPage />;
}