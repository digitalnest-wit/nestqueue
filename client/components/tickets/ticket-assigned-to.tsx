"use client";

import Link from "next/link";
import { ArrowTopRightSquareIcon } from "../ui/icons";

export interface TicketAssignedToProps {
  assignedTo?: string;
}

export default function TicketAssignedTo({ assignedTo }: TicketAssignedToProps) {
  if (assignedTo) {
    return (
      <Link className="underline hover:text-blue-500" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${assignedTo}`}>
        <ArrowTopRightSquareIcon label={assignedTo} />
      </Link>
    );
  }

  return <span>Unassigned</span>;
}
