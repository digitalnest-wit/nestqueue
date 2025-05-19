import type { Metadata } from "next";

import "./globals.css";
import NavBar from "@/components/ui/nav-bar";
import LoginPage from "./login/page";

export const metadata: Metadata = {
  title: "NESTQueue",
  description: "Digital NEST ticket management system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LoginPage />
        {children}
      </body>
    </html>
  );
}
