"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Header from "./components/Header";
import TicketsTable from "./components/TicketsTable";
import { tickets } from "./mock/tickets";
import Ticket from "./types/ticket";

export default function Home() {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const router = useRouter();

  function handleTicketClick(ticket: Ticket) {
    setActiveTicket(ticket);
    router.push(`/tickets/${ticket.id}`);
  }

  return (
    <>
      <Header />
      <TicketsTable tickets={tickets} onClick={handleTicketClick} />
    </>
  );
}
