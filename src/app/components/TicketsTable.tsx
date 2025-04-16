"use client";

import Ticket from "../types/ticket";
import PriorityIconLabel from "./PriorityIcon";
import useWindowSize from "../hooks/useWindowSize";
import { isMobile } from "../types/window";
import Chip from "./Chip";
import { colorForStatus, formatStatusLabel } from "../common";

export default function TicketsTable({
  tickets,
  onClick,
}: {
  tickets: Array<Ticket>;
  onClick: (ticket: Ticket) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full divide-y divide-gray-200 rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm text-gray-700">ID</th>
            <th className="px-2 py-2 text-left text-sm text-gray-700 hidden sm:inline-block">
              Priority
            </th>
            <th className="px-2 py-2 text-left text-sm text-gray-700">Title</th>
            <th className="px-2 py-2 text-left text-sm text-gray-700 hidden md:inline-block">
              Reporter
            </th>
            <th className="px-2 py-2 text-left text-sm text-gray-700">
              Status
            </th>
            <th className="px-2 py-2 text-left text-sm text-gray-700 hidden lg:inline-block">
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
  const statusColor = colorForStatus(ticket.status);
  const status = formatStatusLabel(ticket.status);

  return (
    <tr
      className="hover:bg-gray-50"
      onClick={() => onClick(ticket)}
      key={ticket.id}
    >
      <td className="px-4 py-2">{ticket.id}</td>
      <td className="px-2 py-2 min-w-25 hidden sm:block">
        <PriorityIconLabel priority={ticket.priority} />
      </td>
      <td className="px-2 py-2 max-w-2xs truncate whitespace-nowrap overflow-hidden">
        {ticket.title}
      </td>
      <td className="px-2 py-2 truncate whitespace-nowrap overflow-hidden hidden md:block">
        {ticket.reporterEmail}
      </td>

      {isMobile(width!) ? (
        <td className="px-2 py-2 min-w-15">
          <div
            className={`ml-4 bg-${colorForStatus(
              ticket.status
            )} w-1 h-1 rounded-full p-1`}
          ></div>
        </td>
      ) : (
        <td className="px-2 py-2 min-w-24">
          <Chip bgColor={statusColor}>
            <span className="text-xs">{status}</span>
          </Chip>
        </td>
      )}

      <td className="px-2 py-2 hidden lg:block">
        {ticket.date.toLocaleDateString()}
      </td>
    </tr>
  );
}
