import Ticket from "../types/ticket";
import client from "./client";

export async function getTickets() {
  interface response {
    count: number;
    tickets: Ticket[];
  }
  const { data } = await client.get<response>("/tickets");
  return data.tickets;
}
