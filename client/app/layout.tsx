import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import NavBar from "@/components/ui/nav-bar";
import useAuth from "@/lib/hooks/use-auth";

export const metadata: Metadata = {
  title: "NESTQueue",
  description: "Digital NEST ticket management system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {user&&<NavBar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}