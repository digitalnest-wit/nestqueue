import axios, { AxiosResponse } from "axios";
import Ticket, { Category, Priority, Site, Status } from "../types/ticket";

const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTickets(query: string = ""): Promise<Ticket[]> {
  const response: AxiosResponse<{
    count: number;
    tickets: Ticket[];
  }> = await server.get(`/tickets?q=${query}`);
  return response.data.tickets;
}

export async function getTicket(id: string): Promise<Ticket> {
  const response: AxiosResponse<Ticket> = await server.get(`/tickets/${id}`);
  return response.data;
}

export interface NewTicket {
  title: string;
  description: string;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
  status: Status;
}

export async function createTicket(ticket: NewTicket): Promise<Ticket> {
  const response: AxiosResponse<Ticket> = await server.post(`/tickets`, ticket);
  return response.data;
}

export interface TicketUpdates {
  title?: string;
  description?: string;
  site?: Site;
  category?: Category;
  assignedTo?: string;
  priority?: Priority;
  status?: Status;
}

export async function updateTicket(id: string, updates: TicketUpdates): Promise<Ticket> {
  const response: AxiosResponse<Ticket> = await server.put(`/tickets/${id}`, updates);
  return response.data;
}

export async function deleteTicket(id: string): Promise<void> {
  const response: AxiosResponse<void> = await server.delete(`/tickets/${id}`);
  return response.data;
}

export default server;
