import type { Metadata } from "next";

import "./globals.css";
import NavBar from "@/components/ui/nav-bar";

export const metadata: Metadata = {
  title: "NESTQueue",
  description: "Digital NEST ticket management system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
