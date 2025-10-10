import server from "./client";
import Ticket from "@/lib/types/ticket";

export async function getTickets(query: string = "") {
  const { data } = await server.get<{ count: number; tickets: Ticket[] }>(`/tickets?q=${query}`);
  return data.tickets;
}

export async function getTicket(id: string) {
  const { data: ticket } = await server.get<Ticket>(`/tickets/${id}`);
  return ticket;
}

export async function createTicket(ticket: Partial<Ticket>) {
  const { data: newTicket } = await server.post<Ticket>(`/tickets`, ticket);
  return newTicket;
}

export async function updateTicket(id: string, updates: Partial<Ticket>) {
  const { data: updatedTicket } = await server.put<Ticket>(`/tickets/${id}`, updates);
  return updatedTicket;
}

export async function completeTicket(id: string) {
  const { data: completedTicket } = await server.post<Ticket>(`/tickets/${id}/complete`);
  return completedTicket;
}
