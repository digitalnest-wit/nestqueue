import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";

import "./globals.css";
import Navigation from "@/components/ui/navigation";

export const metadata: Metadata = {
  title: "NestQueue",
  description: "In-house solution to manage IT tickets for the WIT pathway.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
