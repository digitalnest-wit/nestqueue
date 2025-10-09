"use client";

import Ticket from "@/lib/types/ticket";
import TicketAssignedTo from "./ticket-assigned-to";

export interface TicketsTableRowProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

export default function TicketTableRow({ ticket, onClick }: TicketsTableRowProps) {
  const ticketUpdatedAt = new Date(ticket.updatedAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const columnStyles = "px-4 py-4 text-left text-gray-700 dark:text-gray-300";

  let statusStyle: string;

  switch (ticket.status) {
    case "Open":
      statusStyle = "text-green-500 dark:text-green-400";
      break;
    case "Active":
      statusStyle = "text-blue-500 dark:text-blue-400";
      break;
    case "Closed":
      statusStyle = "text-gray-500 dark:text-gray-400";
      break;
    case "Rejected":
      statusStyle = "text-red-500 dark:text-red-400";
      break;
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700" key={ticket.id} onClick={() => onClick(ticket)}>
      <td className={`${columnStyles} font-bold min-w-[5rem]`}>P{ticket.priority}</td>
      <td className={`${columnStyles} font-normal min-w-[5rem] hidden md:block`}>{ticket.category}</td>
      <td className={`${columnStyles} font-normal min-w-[5rem] truncate whitespace-nowrap overflow-hidden`}>{ticket.title}</td>
      <td className={`${columnStyles} font-normal hidden md:block`}>
        <TicketAssignedTo assignedTo={ticket.assignedTo} />
      </td>
      <td className={`${columnStyles} font-bold`}>
        <span className={statusStyle}>{ticket.status}</span>
      </td>
      <td className={`${columnStyles} font-normal min-w-[10rem] hidden sm:block`}>{ticketUpdatedAt}</td>
    </tr>
  );
}
