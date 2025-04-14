"use client";

import { useRouter } from "next/navigation";

import Header from "./components/Header";
import TicketsTable from "./components/TicketsTable";
import { tickets } from "./mock/tickets";
import Ticket from "./types/ticket";

export default function Home() {
  const router = useRouter();

  function handleTicketClick(ticket: Ticket) {
    router.push(`/tickets/${ticket.id}`);
  }

  return (
    <>
      <Header />
      <TicketsTable tickets={tickets} onClick={handleTicketClick} />
    </>
  );
}
