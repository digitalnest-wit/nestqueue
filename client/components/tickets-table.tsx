"use client";

import Ticket from "@/lib/types/ticket";
import TicketTableRow from "./tickets-table-row";

export interface TicketsTableProps {
  tickets: Ticket[];
  onClick: (ticket: Ticket) => void;
}

export default function TicketsTabel({ tickets, onClick }: TicketsTableProps) {
  const TicketRows = () => {
    return tickets.map((ticket) => (
      <TicketTableRow key={ticket.id} ticket={ticket} onClick={() => onClick(ticket)} />
    ));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Priority</th>
          <th>Category</th>
          <th>Title</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>ID</th>
          <th>Last Modified</th>
        </tr>
      </thead>
      <tbody>
        <TicketRows />
      </tbody>
    </table>
  );
}
