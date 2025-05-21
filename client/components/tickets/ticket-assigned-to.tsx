"use client";

import Link from "next/link";
import { SquareArrowUpRight } from "lucide-react";

import LabeledIcon from "../ui/labeled-icon";

export interface TicketAssignedToProps {
  assignedTo?: string;
}

export default function TicketAssignedTo({ assignedTo }: TicketAssignedToProps) {
  if (assignedTo) {
    return (
      <Link
        className="inline-block underline hover:text-blue-500"
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${assignedTo}`}
      >
        <LabeledIcon icon={<SquareArrowUpRight className="w-4" />} label={assignedTo} />
      </Link>
    );
  }

  return <span>Unassigned</span>;
}
