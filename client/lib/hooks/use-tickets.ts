import { useEffect, useState } from "react";
import Ticket from "../types/ticket";
import { createTicket, deleteTicket, getTicket, getTickets, NewTicket, TicketUpdates, updateTicket } from "../api/tickets";

export type FilterKey = "Priority" | "Category" | "Title" | "Assigned To" | "Status" | "Last Modified";
export type OrderKey = "Ascending" | "Descending";

export interface UseTicketsProps {
  query?: string;
  filter?: FilterKey;
  order?: OrderKey;
}

export function useTickets({ query, filter = "Last Modified", order = "Descending" }: UseTicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setIsLoading(true);
        const response = await getTickets(query);
        // Sort the tickets based on filter and order props
        const sortedTickets = sortTickets(response, filterToTicketKey(filter), order);
        setTickets(sortedTickets);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch tickets"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, [query, filter, order]);

  const addTicket = async (newTicket: NewTicket) => {
    try {
      setIsLoading(true);
      const createdTicket = await createTicket(newTicket);
      setTickets((prev) => [...prev, createdTicket]);
      return createdTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create ticket"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editTicket = async (id: string, updates: TicketUpdates) => {
    try {
      setIsLoading(true);
      const updatedTicket = await updateTicket(id, updates);
      setTickets((prev) => prev.map((ticket) => (ticket.id === id ? updatedTicket : ticket)));
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update ticket"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeTicket = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteTicket(id);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete ticket"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTickets = async () => {
    try {
      setIsLoading(true);
      const response = await getTickets(query);
      // Sort the tickets based on filter and order props
      const sortedTickets = sortTickets(response, filterToTicketKey(filter), order);
      setTickets(sortedTickets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh tickets"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tickets,
    isLoading,
    error,
    addTicket,
    editTicket,
    removeTicket,
    refreshTickets,
  };
}

export function useTicket(id: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        setIsLoading(true);
        setTicket(await getTicket(id));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch ticket"));
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchTicket();
  }, [id]);

  const updateCurrentTicket = async (updates: TicketUpdates) => {
    if (!id) return null;

    try {
      setIsLoading(true);
      const updatedTicket = await updateTicket(id, updates);
      setTicket(updatedTicket);
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update ticket"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ticket,
    isLoading,
    error,
    updateTicket: updateCurrentTicket,
  };
}

function filterToTicketKey(key: FilterKey) {
  switch (key) {
    case "Priority":
      return "priority";
    case "Category":
      return "category";
    case "Title":
      return "title";
    case "Assigned To":
      return "assignedTo";
    case "Status":
      return "status";
    case "Last Modified":
      return "updatedAt";
  }
}

function sortTickets(tickets: Ticket[], field: keyof Ticket, order: OrderKey) {
  return [...tickets].sort((a, b) => {
    let comparison = 0;

    // Handle different field types
    if (typeof a[field] === "string" && typeof b[field] === "string") {
      comparison = (a[field] as string).localeCompare(b[field] as string);
    } else if (a[field] instanceof Date && b[field] instanceof Date) {
      comparison = (a[field] as Date).getTime() - (b[field] as Date).getTime();
    } else if (typeof a[field] === "boolean" && typeof b[field] === "boolean") {
      comparison = a[field] === b[field] ? 0 : a[field] ? 1 : -1;
    } else if (typeof a[field] === "number" && typeof b[field] === "number") {
      comparison = (a[field] as number) - (b[field] as number);
    } else {
      // Fallback for other types
      comparison = String(a[field]).localeCompare(String(b[field]));
    }

    return order === "Ascending" ? comparison : -comparison;
  });
}
