"use client";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import StatusChip from "@/app/components/Status";
import { priorityImageName } from "@/app/components/PriorityIcon";
import Ticket from "../types/ticket";

export default function TicketDetail({
  ticket,
  setSelectedTicket,
}: {
  ticket: Ticket;
  setSelectedTicket: Dispatch<SetStateAction<Ticket | null>>;
}) {
  const router = useRouter();

  return (
    <div className="p-4 bg-gray-50">
      <button
        className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 mb-5"
        onClick={() => setSelectedTicket(null)}
      >
        &lt;- Close
      </button>
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
              href={`mailto:${ticket.reporter}`}
            >
              {ticket.reporter}
            </a>
          </p>
        </div>
        <div className="my-3">
          <p className="text-gray-500 text-sm font-semibold uppercase">
            Reported Date
          </p>
          <p className="text-sm">{ticket.date.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
