"use client";

import Ticket from "../types/ticket";
import StatusChip, { StatusDot } from "./Status";
import PriorityIconLabel from "./PriorityIcon";
import useWindowSize from "../hooks/useWindowSize";
import { isMobile } from "../types/window";

export default function TicketsTable({
  tickets,
  onClick,
}: {
  tickets: Array<Ticket>;
  onClick: (ticket: Ticket) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm text-gray-700">ID</th>
            <th className="px-4 py-2 text-left text-sm text-gray-700 hidden sm:block">
              Priority
            </th>
            <th className="px-4 py-2 text-left text-sm text-gray-700">
              Description
            </th>
            <th className="px-4 py-2 text-left text-sm text-gray-700 hidden md:block">
              Reporter
            </th>
            <th className="px-4 py-2 text-left text-sm text-gray-700">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm text-gray-700 hidden lg:block">
              Date Reported
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {...tickets.map((ticket) => (
            <TableRow ticket={ticket} onClick={onClick} key={ticket.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  ticket,
  onClick,
}: {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}) {
  const { width } = useWindowSize();

  return (
    <tr
      className="hover:bg-gray-50"
      onClick={() => onClick(ticket)}
      key={ticket.id}
    >
      <td className="px-4 py-2">{ticket.id}</td>
      <td className="px-4 py-2 hidden sm:block">
        <PriorityIconLabel priority={ticket.priority} />
      </td>
      <td className="px-4 py-2 max-w-2xs truncate whitespace-nowrap overflow-hidden">
        {ticket.description}
      </td>
      <td className="px-4 py-2 hidden md:block">{ticket.reporter}</td>
      <td className="px-4 py-2">
        {isMobile(width!) ? (
          <div className="flex justify-center">
            <StatusDot status={ticket.status} />
          </div>
        ) : (
          <StatusChip status={ticket.status} />
        )}
      </td>
      <td className="px-4 py-2 hidden lg:block">
        {ticket.date.toLocaleDateString()}
      </td>
    </tr>
  );
}
