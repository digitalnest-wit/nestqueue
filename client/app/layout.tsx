"use client";

import "./globals.css";
import NavBar from "@/components/ui/nav-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToastProvider from "@/components/ui/toast";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={true} />
          </QueryClientProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
