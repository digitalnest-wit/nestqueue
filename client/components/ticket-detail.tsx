"use client";

import Ticket from "@/lib/types/ticket";
import Button from "./button";
import { BuildingOfficeIcon, CalendarIcon, PersonIcon, TagIcon } from "@/components/icons";
import TicketAssignedTo from "./ticket-assigned-to";

export interface TicketDetailProps {
  ticket: Ticket;
  onDismiss: () => void;
}

export default function TicketDetail({ ticket, onDismiss }: TicketDetailProps) {
  const ticketCreatedAt = new Date(ticket.createdOn).toDateString();
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();

  let ticketStatusColor: string;

  switch (ticket.status) {
    case "Open":
      ticketStatusColor = "text-green-500";
      break;
    case "Active":
      ticketStatusColor = "text-blue-500";
      break;
    case "Closed":
      ticketStatusColor = "text-gray-500";
      break;
    case "Rejected":
      ticketStatusColor = "text-red-500";
      break;
  }

  interface TicketCreatedByProps {
    createdBy: string;
  }

  const TicketCreatedBy = ({ createdBy }: TicketCreatedByProps) => {
    return (
      <a className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${createdBy}`}>
        {createdBy}
      </a>
    );
  };

  const commonStyles = "py-2 text-sm font-bold";

  return (
    <div className="p-4 bg-gray-50">
      <Button className="bg-gray-900 hover:bg-gray-700 rounded" onClick={onDismiss}>
        &lt;- Back
      </Button>

      <p className="mt-3 mb-1 text-sm text-gray-600">TK {ticket.id}</p>

      <div className="flex gap-5 items-center">
        <p className={`font-bold ${ticketStatusColor}`}>{ticket.status}</p>
        <p className="text-xl">{ticket.title}</p>
      </div>

      <p className="my-4">{ticket.description}</p>

      <table className="table-auto min-w-full">
        <tbody>
          <tr>
            <td className={commonStyles}>
              <PersonIcon label="Assigned To" />
            </td>
            <td>
              <TicketAssignedTo assignedTo={ticket.assignedTo} />
            </td>
          </tr>
          <tr>
            <td className={commonStyles}>
              <BuildingOfficeIcon label="Site" />
            </td>
            <td>{ticket.site}</td>
          </tr>
          <tr>
            <td className={commonStyles}>
              <TagIcon label="Category" />
            </td>
            <td>{ticket.category}</td>
          </tr>
          <tr>
            <td className={commonStyles}>
              <PersonIcon label="Created By" />
            </td>
            <td>
              <TicketCreatedBy createdBy={ticket.createdBy} />
            </td>
          </tr>
          <tr>
            <td className={commonStyles}>
              <CalendarIcon label="Created On" />
            </td>
            <td>{ticketCreatedAt}</td>
          </tr>
          <tr>
            <td className={commonStyles}>
              <CalendarIcon label="Last Modified" />
            </td>
            <td>{ticketUpdatedAt}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
