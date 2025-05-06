"use client";

import { Status } from "@/lib/types/ticket";
import Button from "../ui/button";
import { BuildingOfficeIcon, CalendarIcon, PersonIcon, TagIcon } from "../ui/icons";
import TicketAssignedTo from "./ticket-assigned-to";
import Dropdown from "../ui/dropdown";
import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useTicket } from "@/lib/hooks/use-tickets";

export interface TicketDetailProps {
  ticketId: string;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function TicketDetail({ ticketId, onDismiss, onUpdate }: TicketDetailProps) {
  const { ticket, updateTicket } = useTicket(ticketId);
  const [status, setStatus] = useState<Status>("Active");

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center gap-5 h-[100vh]">
        <span className="text-red-500 font-bold text-2xl">404</span>
        <div>
          <p className="font-bold text-xl">Not Found</p>
          <p>We couldn't find a ticket with that matching ID.</p>
        </div>
      </div>
    );
  }

  const ticketCreatedAt = new Date(ticket.createdOn).toDateString();
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();

  const TicketCreatedBy = ({ createdBy }: { createdBy: string }) => {
    return (
      <Link className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${createdBy}`}>
        {createdBy}
      </Link>
    );
  };

  const commonStyles = "py-2 text-sm font-bold";
  const statusOpts = ["Active", "Open", "Closed", "Rejected"];

  const statusColor: Record<Status, string> = {
    Open: "bg-green-500 hover:text-green-500",
    Active: "bg-blue-500 hover:text-blue-500",
    Closed: "bg-gray-500 hover:text-gray-500",
    Rejected: "bg-red-500 hover:text-red-500",
  };

  const handleOptSelect = (_event: MouseEvent<HTMLElement>, selectedOpt: string) => {
    // Type cast should never fail
    const updatedStatus = selectedOpt as Status;

    setStatus(updatedStatus);
    updateTicket({ status: updatedStatus });
    setTimeout(onUpdate, 300);
  };

  return (
    <div className="p-4 bg-gray-50">
      <Button className="bg-gray-900 hover:bg-gray-700 rounded" onClick={onDismiss}>
        &lt;- Back
      </Button>

      <p className="mt-3 mb-1 text-sm text-gray-600">TK {ticket.id}</p>

      <div className="flex gap-5 items-center">
        <Dropdown
          className={`${statusColor[ticket.status]} text-white hover:bg-gray-100`}
          value={status}
          opts={statusOpts}
          onSelect={handleOptSelect}
        >
          <p className={`font-bold`}>{ticket.status}</p>
        </Dropdown>
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
