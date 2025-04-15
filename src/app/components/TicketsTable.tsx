"use client";

import Ticket from "../types/ticket";
import StatusChip from "./Status";
import PriorityIcon from "./PriorityIcon";

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
  return (
    <tr
      className="hover:bg-gray-50"
      onClick={() => onClick(ticket)}
      key={ticket.id}
    >
      <td className="px-4 py-2">{ticket.id}</td>
      <td className="px-4 py-2 hidden sm:block">
        <PriorityIcon priority={ticket.priority} />
      </td>
      <td className="px-4 py-2 max-w-2xs truncate whitespace-nowrap overflow-hidden">
        {ticket.description}
      </td>
      <td className="px-4 py-2 hidden md:block">{ticket.reporter}</td>
      <td className="px-4 py-2">
        <StatusChip status={ticket.status} />
      </td>
      <td className="px-4 py-2 hidden lg:block">
        {ticket.date.toLocaleDateString()}
      </td>
    </tr>
  );
}
