"use client";

import { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import Ticket from "@/lib/types/ticket";
import server from "@/lib/server";
import { GetTicketsResponse } from "@/lib/types/responses/tickets";
import TicketDetail from "@/components/ticket-detail";
import TicketsTabel from "@/components/tickets-table";
import { SearchBar } from "@/components/search-bar";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = `/tickets?q=${query}`;
      const response: AxiosResponse<GetTicketsResponse> = await server.get(endpoint);
      setTickets(response.data.tickets);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Initial fetch on page load
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const StatusBanner = () => {
    const isLoading = loading && tickets.length === 0;

    return (
      <>
        {isLoading && <p>"Loading tickets..."</p>}
        {error && <p>Error: {error}</p>}
      </>
    );
  };

  return (
    <div>
      <StatusBanner />
      <SearchBar placeholder="Search tickets..." onChange={setQuery} />
      {selectedTicket && (
        <TicketDetail ticket={selectedTicket} onDismiss={() => setSelectedTicket(null)} />
      )}
      <TicketsTabel tickets={tickets} onClick={setSelectedTicket} />
    </div>
  );
}
