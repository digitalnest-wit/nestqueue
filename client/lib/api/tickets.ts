import axios, { AxiosResponse } from "axios";
import Ticket, { Category, Priority, Site, Status } from "../types/ticket";

const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTickets(query: string = ""): Promise<
  AxiosResponse<{
    count: number;
    tickets: Ticket[];
  }>
> {
  return await server.get(`/tickets?q=${query}`);
}

export async function getTicket(id: string): Promise<AxiosResponse<Ticket>> {
  return await server.get(`/tickets/${id}`);
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

export async function createTicket(ticket: NewTicket): Promise<AxiosResponse<Ticket>> {
  return await server.post(`/tickets`, ticket);
}

export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<AxiosResponse<Ticket>> {
  return await server.put(`/tickets/${id}`, updates);
}

export async function deleteTicket(id: string): Promise<AxiosResponse<void>> {
  return await server.delete(`/tickets/${id}`);
}

export default server;
