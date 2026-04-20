"use client";

import { useParams } from "next/navigation";

import TicketEdit from "@/components/tickets/ticket-edit";

export default function TicketPage() {
  const params = useParams<{ id: string }>();

  return <TicketEdit ticketId={params.id} />;
}
