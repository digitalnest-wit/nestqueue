"use client";

import { Status } from "@/lib/types/ticket";
import Button from "../ui/button";
import { ArrowTopRightSquareIcon, BuildingOfficeIcon, CalendarIcon, PencilSquareIcon, PersonIcon, TagIcon } from "../ui/icons";
import TicketAssignedTo from "./ticket-assigned-to";
import Dropdown from "../ui/dropdown";
import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useTicket, useUpdateTicket } from "@/lib/hooks/queries/use-tickets";
import TicketEdit from "./ticket-edit";

export interface TicketDetailProps {
  ticketId: string;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function TicketDetail({ ticketId, onDismiss, onUpdate }: TicketDetailProps) {
  const { data: ticket } = useTicket(ticketId);
  const { mutate: updateTicket } = useUpdateTicket();
  const [status, setStatus] = useState<Status>("Active");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
    }
  }, [ticket]);

  if (!ticket) {
    let layout = <></>;

    // Show not found error after 1 sec
    setTimeout(() => {
      layout = (
        <div className="flex items-center justify-center gap-5 h-[100vh]">
          <span className="text-red-500 font-bold text-2xl">404</span>
          <div>
            <p className="font-bold text-xl">Not Found</p>
            <p>We couldn't find a ticket with that matching ID.</p>
          </div>
        </div>
      );
    }, 1 * 1000);

    return layout;
  }

  // If in editing mode, render the TicketEdit component
  if (isEditing) {
    return (
      <TicketEdit
        ticketId={ticketId}
        onCancel={() => setIsEditing(false)}
        onSave={(updates) => {
          setIsEditing(false);
          updateTicket({ id: ticketId, updates });
          setTimeout(onUpdate, 300);
        }}
      />
    );
  }

  const ticketCreatedAt = new Date(ticket.createdOn).toDateString();
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();

  const TicketCreatedBy = ({ createdBy }: { createdBy: string }) => {
    return (
      <Link className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${createdBy}`}>
        <ArrowTopRightSquareIcon label={createdBy} />
      </Link>
    );
  };

  const commonStyles = "py-2 text-sm font-bold";
  const statusOpts = ["Active", "Open", "Closed", "Rejected"];

  const statusColor: Record<Status, string> = {
    Open: "bg-green-500 dark:bg-green-400 hover:text-green-500 dark:hover:text-green-400",
    Active: "bg-blue-500 dark:bg-blue-400 hover:text-blue-500 dark:hover:text-blue-400",
    Closed: "bg-gray-500 dark:bg-gray-400 hover:text-gray-500 dark:hover:text-gray-400",
    Rejected: "bg-red-500 dark:bg-red-400 hover:text-red-500 dark:hover:text-red-400",
  };

  const handleStatusSelection = (_event: MouseEvent<HTMLElement>, selectedOpt: string) => {
    // Type cast should never fail
    const updatedStatus = selectedOpt as Status;

    setStatus(updatedStatus);
    updateTicket({ id: ticketId, updates: { status: updatedStatus } });
    setTimeout(onUpdate, 300);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between">
        {/* Dismiss button */}
        <Button
          className="px-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded"
          onClick={onDismiss}
        >
          &lt;-
        </Button>
        {/* Edit button */}
        <Button
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
          onClick={() => setIsEditing(true)}
        >
          <PencilSquareIcon label="Edit" />
        </Button>
      </div>

      {/* Ticket ID */}
      <p className="mt-3 mb-1 text-sm text-gray-600 dark:text-gray-500">TK {ticket.id}</p>

      <div className="flex gap-5 items-center">
        {/* Ticket status */}
        <Dropdown
          className={`${statusColor[ticket.status]} text-white dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700`}
          value={status}
          opts={statusOpts}
          onSelect={handleStatusSelection}
        >
          <p className={`font-bold`}>{ticket.status}</p>
        </Dropdown>
        {/* Titcket title */}
        <p className="text-xl font-bold">{ticket.title}</p>
      </div>

      {/* Ticket description */}
      <p className="my-4">{ticket.description}</p>

      <table className="table-auto min-w-full">
        <tbody>
          {/* Ticket assigned to */}
          <tr>
            <td className={commonStyles}>
              <PersonIcon label="Assigned To" />
            </td>
            <td>
              <TicketAssignedTo assignedTo={ticket.assignedTo} />
            </td>
          </tr>
          {/* Ticket site */}
          <tr>
            <td className={commonStyles}>
              <BuildingOfficeIcon label="Site" />
            </td>
            <td>{ticket.site}</td>
          </tr>
          {/* Ticket category */}
          <tr>
            <td className={commonStyles}>
              <TagIcon label="Category" />
            </td>
            <td>{ticket.category}</td>
          </tr>
          {/* Ticket created by */}
          <tr>
            <td className={commonStyles}>
              <PersonIcon label="Created By" />
            </td>
            <td>
              <TicketCreatedBy createdBy={ticket.createdBy} />
            </td>
          </tr>
          {/* Ticket created at */}
          <tr>
            <td className={commonStyles}>
              <CalendarIcon label="Created On" />
            </td>
            <td>{ticketCreatedAt}</td>
          </tr>
          {/* Ticket updated at */}
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
