"use client";

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
  return (
    <div className="p-4 bg-gray-50">
      <button
        className="hover:cursor-pointer relative overflow-hidden group rounded-4xl p-1 px-1.5 my-3 block bg-gray-900 text-white"
        onClick={() => setSelectedTicket(null)}
      >
        <span className="absolute inset-0 flex justify-center items-center">
          <span className="bg-gray-800 rounded-full w-0 h-0 scale-0 group-hover:w-[250%] group-hover:h-[250%] group-hover:scale-100 transition-all duration-500 ease-out"></span>
        </span>
        <span className="px-1 relative z-10">&lt;- Close</span>
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
