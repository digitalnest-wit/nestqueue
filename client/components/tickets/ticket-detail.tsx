"use client";

import Link from "next/link";
import { Building, Calendar, PencilLine, SquareArrowUpRight, Tag, User } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

import TicketAssignedTo from "./ticket-assigned-to";
import TicketEdit from "./ticket-edit";
import { useTicket, useUpdateTicket } from "@/lib/hooks/queries/use-tickets";
import { Status, Statuses } from "@/lib/types/ticket";
import Button from "../ui/button";
import Dropdown from "../ui/dropdown";
import LabeledIcon from "../ui/labeled-icon";

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

  const ticketCreatedAt = new Date(ticket.createdOn).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const ticketUpdatedAt = new Date(ticket.updatedAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // helper: format datetime strings with both date and time (no seconds)
  const formatDateTime = (raw?: string | Date | null) => {
    if (!raw) return null;
    try {
      const date = new Date(raw);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return null;
    }
  };

  // screenshot: ensure absolute URL when server returns relative path
  const makeScreenshotUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    // build with or without trailing slash cleanly
    return `${base.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const TicketCreatedBy = ({ createdBy }: { createdBy: string }) => {
    return (
      <Link className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${createdBy}`}>
        <LabeledIcon icon={<SquareArrowUpRight className="w-4" />} label={createdBy} />
      </Link>
    );
  };

  const labelStyles = "py-2 text-sm font-bold text-gray-800 dark:text-gray-300";
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

  // compute deadline display and overdue
  // ticket may not have the `deadline` property on the inferred Ticket type,
  // so read it into a local variable with a narrow/known type to avoid TS errors.
  const deadline = (ticket as any).deadline as string | Date | null | undefined;
  const deadlineDisplay = formatDateTime(deadline);
  const isOverdue = (() => {
    if (!deadline) return false;
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      return deadlineDate.getTime() < now.getTime();
    } catch {
      return false;
    }
  })();
  
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between">
        <Button
          className="px-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded"
          onClick={onDismiss}
        >
          &lt;-
        </Button>
        <Button
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
          onClick={() => setIsEditing(true)}
        >
          <LabeledIcon icon={<PencilLine className="w-4" />} label="Edit" />
        </Button>
      </div>
      <p className="mt-3 mb-1 text-sm text-gray-600 dark:text-gray-500">TK {ticket.id}</p>
      <div className="flex gap-5 items-center">
        <Dropdown
          className={`${statusColor[ticket.status]} text-white dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700`}
          value={status}
          opts={statusOpts}
          onSelect={handleStatusSelection}
        >
          <p className={`font-bold`}>{ticket.status}</p>
        </Dropdown>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-300">{ticket.title}</p>
      </div>
      <p className="my-4 text-gray-800 dark:text-gray-300">{ticket.description}</p>
      <table className="table-auto min-w-full">
        <tbody>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<User className="w-4" />} label="Assigned To" />
            </td>
            <td>
              <TicketAssignedTo assignedTo={ticket.assignedTo} />
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Building className="w-4" />} label="Site" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">{ticket.site}</td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Tag className="w-4" />} label="Category" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">{ticket.category}</td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<User className="w-4" />} label="Created By" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              <TicketCreatedBy createdBy={ticket.createdBy} />
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Calendar className="w-4" />} label="Created On" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">{ticketCreatedAt}</td>
          </tr>

          {/* Deadline row */}
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Calendar className="w-4" />} label="Deadline" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              {deadlineDisplay ?? <span className="text-gray-500">None</span>}
              {isOverdue && <span className="ml-2 text-red-600 font-bold">Overdue</span>}
            </td>
          </tr>

          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Calendar className="w-4" />} label="Last Modified" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">{ticketUpdatedAt}</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
}
