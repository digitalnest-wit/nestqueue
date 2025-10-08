"use client";

import Ticket from "@/lib/types/ticket";
import TicketTableRow from "./tickets-table-row";

export interface TicketsTableProps {
  tickets: Ticket[];
  onClick: (ticket: Ticket) => void;
}

export default function TicketsTable({ tickets, onClick }: TicketsTableProps) {
  const TicketRows = () => {
    return tickets.map((ticket) => <TicketTableRow key={ticket.id} ticket={ticket} onClick={() => onClick(ticket)} />);
  };

  const commonStyles = "px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300";

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-gray-900">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className={`${commonStyles}`}>Priority</th>
            <th className={`${commonStyles} hidden md:block`}>Category</th>
            <th className={`${commonStyles}`}>Title</th>
            <th className={`${commonStyles} hidden md:block`}>Assigned To</th>
            <th className={`${commonStyles}`}>Status</th>
            <th className={`${commonStyles} hidden sm:block`}>Last Modified</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-900 text-sm">
          <TicketRows />
        </tbody>
      </table>
    </div>
  );
}
