"use client";

import TicketsTable from "@/components/tickets/table";
import { useTicketsQuery } from "@/lib/hooks/queries/tickets";
import Ticket from "@/lib/types/ticket";

export default function Home() {
  const { data: tickets, error } = useTicketsQuery();

  if (error) {
    return <div>Failed to fetch tickets.</div>;
  }

  if (!tickets) {
    return <div>Loading tickets...</div>;
  }

  return (
    <>
      <TicketsTable tickets={tickets} />
    </>
  );
}
