"use client";

import { useRouter } from "next/navigation";

import TicketCreate from "@/components/tickets/ticket-create";

export default function NewTicketPage() {
  const router = useRouter();

  return (
    <TicketCreate
      onDismiss={() => router.back()}
      onCreated={() => router.push("/tickets")}
      mode="page"
    />
  );
}
