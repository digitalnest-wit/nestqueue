import { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import QueryProvider from "@/QueryProvider";

import "./globals.css";

import Navigation from "@/components/ui/navigation";
import ToastProvider from "@/components/ui/toast";
import ThemeProvider from "@/components/ui/theme";
import { ThemeApplicator } from "@/components/ui/theme-applicator";

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
      <body className="antialiased">
        <AuthProvider>
          <ThemeApplicator />
          <ThemeProvider>
              <Navigation />
              <ToastProvider>
                <QueryProvider>
                  {children}
                </QueryProvider>
              </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html> 
  );
}