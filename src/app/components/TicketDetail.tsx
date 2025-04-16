"use client";

import { Dispatch, SetStateAction } from "react";

import StatusChip from "@/app/components/Status";
import { priorityImageName } from "@/app/components/PriorityIcon";
import Ticket from "../types/ticket";
import Button from "./Button";

export default function TicketDetail({
  ticket,
  setSelectedTicket,
}: {
  ticket: Ticket;
  setSelectedTicket: Dispatch<SetStateAction<Ticket | null>>;
}) {
  return (
    <div className="p-4 bg-gray-50">
      <Button onClick={() => setSelectedTicket(null)}>
        <span className="px-1 relative z-10">&lt;- Close</span>
      </Button>
      <div className="flex gap-4 p-3 border-b-2 border-gray-100">
        <img className="w-8" src={priorityImageName(ticket.priority)} />
        <div>
          <h1 className="text-xl text-gray-400">TK {ticket.id}</h1>
          <h1 className="text-xl">{ticket.title}</h1>
          <StatusChip status={ticket.status} />
        </div>
      </div>
      <div className="p-3 mb-auto">
        <div className="my-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            Description
          </p>
          <p className="text-sm">{ticket.description}</p>
        </div>
        <div className="my-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            Reported By
          </p>
          <p className="text-sm">
            <a
              className="underline hover:text-pink-400"
              href={`mailto:${ticket.reporterEmail}`}
            >
              {ticket.reporterEmail}
            </a>
          </p>
        </div>
        <div className="my-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            Reported Date
          </p>
          <p className="text-sm">{ticket.date.toDateString()}</p>
        </div>
      </div>
    </div>
  );
}
