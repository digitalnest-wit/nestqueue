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

            {/* Deadline (separate column) */}
            <th className={`${commonStyles} hidden sm:table-cell`}>Deadline</th>

            {/* Last Modified */}
            <th className={`${commonStyles} hidden sm:table-cell`}>Last Modified</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-900 text-sm">
          {tickets.map((ticket) => {
            // Format deadline with both date and time (no seconds)
            const deadline = (ticket as any).deadline;
            const deadlineDisplay = deadline ? (() => {
              try {
                const date = new Date(deadline);
                return isNaN(date.getTime()) ? null : date.toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });
              } catch {
                return null;
              }
            })() : null;

            // Check if deadline is overdue
            const isOverdue = deadline ? (() => {
              try {
                const deadlineDate = new Date(deadline);
                const now = new Date();
                return deadlineDate.getTime() < now.getTime();
              } catch {
                return false;
              }
            })() : false;

            return (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => onClick(ticket)}>
                <td className={commonStyles}>P{ticket.priority ?? "—"}</td>
                <td className={`${commonStyles} hidden md:table-cell`}>{ticket.category ?? "—"}</td>
                <td className={commonStyles}>{ticket.title}</td>
                <td className={`${commonStyles} hidden md:table-cell`}>{ticket.assignedTo ?? "—"}</td>
                <td className={commonStyles}>{ticket.status ?? "—"}</td>

                {/* Deadline cell with date and time */}
                <td className={`${commonStyles} hidden sm:table-cell`}>
                  {deadlineDisplay ? (
                    <div className="flex items-center gap-2">
                      <span>{deadlineDisplay}</span>
                      {isOverdue && <span className="text-xs text-red-600 font-bold">Overdue</span>}
                    </div>
                  ) : <span className="text-gray-500">—</span>}
                </td>

                <td className={`${commonStyles} hidden sm:table-cell`}>
                  {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
