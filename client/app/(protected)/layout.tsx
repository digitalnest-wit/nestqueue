"use client";

import AppShell from "@/components/ui/app-shell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/lib/hooks/use-auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
