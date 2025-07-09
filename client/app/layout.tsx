"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./globals.css";

import { AuthProvider } from "@/components/auth/auth-provider";
import NavBar from "@/components/ui/nav-bar";
import ToastProvider from "@/components/ui/toast";
import ThemeProvider from "@/components/ui/theme";
import { ThemeApplicator } from "@/components/ui/theme-applicator";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ThemeApplicator />
          <ThemeProvider>
            <NavBar />
            <ToastProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
