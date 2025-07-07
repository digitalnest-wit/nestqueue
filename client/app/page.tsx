"use client";

import TicketsTable from "@/components/tickets/table";
import { mockTickets } from "@/lib/tickets.mock";
import Ticket from "@/lib/types/ticket";

export default function Home() {
  const handleTicketClick = (ticket: Ticket) => alert(ticket.id);

  return (
    <TicketsTable tickets={mockTickets} onTicketClick={handleTicketClick} />
  );
}
