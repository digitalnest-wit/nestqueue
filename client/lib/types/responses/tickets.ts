import Ticket from "../ticket";

export interface GetTicketsResponse {
  count: number;
  tickets: Ticket[];
}
