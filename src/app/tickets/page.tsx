"use client";

import { useRouter } from "next/navigation";

import TicketsTable from "../components/TicketsTable";
import { tickets } from "../mock/tickets";
import Ticket from "../types/ticket";

export default function TicketsPage() {
  const router = useRouter();

  function handleTicketClick(ticket: Ticket) {
    router.push(`/tickets/${ticket.id}`);
  }

  return (
    <>
      <TicketsTable tickets={tickets} onClick={handleTicketClick} />
    </>
  );
}
