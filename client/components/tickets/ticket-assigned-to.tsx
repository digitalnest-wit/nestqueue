"use client";

import Link from "next/link";

export interface TicketAssignedToProps {
  assignedTo?: string;
}

export default function TicketAssignedTo({ assignedTo }: TicketAssignedToProps) {
  if (assignedTo) {
    return (
      <Link className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${assignedTo}`}>
        {assignedTo}
      </Link>
    );
  }

  return <span>Unassigned</span>;
}
