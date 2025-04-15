"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import TicketsTable from "../components/TicketsTable";
import { tickets } from "../mock/tickets";
import Ticket from "../types/ticket";
import TicketDetail from "../components/TicketDetail";

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ticketId = searchParams.get("ticket");
    if (ticketId) {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (ticket) setSelectedTicket(ticket);
    }
  }, [searchParams]);

  function handleTicketClick(ticket: Ticket) {
    setSelectedTicket(ticket);
    router.push(`/?ticket=${ticket.id}`, { scroll: false });
  }

  return (
    <div className="relative h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Main tickets table area */}
      <div className="flex-1 overflow-auto">
        <TicketsTable tickets={tickets} onClick={handleTicketClick} />
      </div>

      {/* Desktop TicketDetail: Side panel */}
      {selectedTicket && (
        <div className="hidden md:block md:w-1/2 xl:w-1/3 border-l border-gray-200 overflow-auto bg-white z-40">
          <TicketDetail
            ticket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
          />
        </div>
      )}

      {/* Mobile TicketDetail: Overlay panel */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-white">
          <div className="w-full overflow-auto border-l border-gray-200">
            <TicketDetail
              ticket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
            />
          </div>
        </div>
      )}
    </div>
  );
}
