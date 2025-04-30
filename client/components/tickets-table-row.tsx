import Ticket from "@/lib/types/ticket";

export interface TicketsTableRowProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export default function TicketTableRow({ ticket, onClick }: TicketsTableRowProps) {
  const ticketDate = new Date(ticket.updatedAt).toDateString();

  return (
    <tr key={ticket.id} onClick={() => onClick(ticket)}>
      <th>{ticket.priority}</th>
      <th>{ticket.category}</th>
      <th>{ticket.title}</th>
      <th>{ticket.assignedTo || "Unassigned"}</th>
      <th>{ticket.status}</th>
      <th>{ticket.id}</th>
      <th>{ticketDate}</th>
    </tr>
  );
}
