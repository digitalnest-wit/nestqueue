"use client";

export interface TicketAssignedToProps {
  assignedTo?: string;
}

export default function TicketAssignedTo({ assignedTo }: TicketAssignedToProps) {
  if (assignedTo) {
    return (
      <a
        className="underline hover:text-blue-500"
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${assignedTo}`}
      >
        {assignedTo}
      </a>
    );
  }

  return <span>Unassigned</span>;
}
