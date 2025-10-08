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
            const dateRaw = (ticket as any).deadline;
            const datePart = dateRaw ? (String(dateRaw).includes("T") ? String(dateRaw).split("T")[0] : String(dateRaw)) : "";
            const deadlineText = datePart ? (() => {
              const [y, m, d] = datePart.split("-").map(Number);
              return new Date(y, m - 1, d).toLocaleDateString();
            })() : "";
            return (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => onClick(ticket)}>
                <td className={commonStyles}>P{ticket.priority ?? "—"}</td>
                <td className={`${commonStyles} hidden md:table-cell`}>{ticket.category ?? "—"}</td>
                <td className={commonStyles}>{ticket.title}</td>
                <td className={`${commonStyles} hidden md:table-cell`}>{ticket.assignedTo ?? "—"}</td>
                <td className={commonStyles}>{ticket.status ?? "—"}</td>

                {/* Deadline cell */}
                <td className={`${commonStyles} hidden sm:table-cell`}>
                  {deadlineText ? (
                    <div className="flex items-center gap-2">
                      <span>{deadlineText}</span>
                      {(() => {
                        if (!datePart) return null;
                        const [y, m, d] = datePart.split("-").map(Number);
                        const dt = new Date(y, m - 1, d);
                        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
                        return dt.getTime() < todayStart.getTime() ? <span className="text-xs text-red-600 font-bold">Overdue</span> : null;
                      })()}
                    </div>
                  ) : <span className="text-gray-500">—</span>}
                </td>

                <td className={`${commonStyles} hidden sm:table-cell`}>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
