"use client";

import Ticket from "@/lib/types/ticket";
import TicketsTableRow from "./table-row";

interface TicketsTableProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

export default function TicketsTable({
  tickets,
  onTicketClick,
}: TicketsTableProps) {
  const styles = {
    common: "px-4 py-2 text-left text-sm text-gray-700",
    mobileHidden: "hidden md:block",
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className={styles.common}>Priority</th>
            <th className={`${styles.common} ${styles.mobileHidden}`}>
              Category
            </th>
            <th className={styles.common}>Title</th>
            <th className={`${styles.common} ${styles.mobileHidden}`}>
              Assigned To
            </th>
            <th className={styles.common}>Status</th>
            <th className={`${styles.common} ${styles.mobileHidden}`}>
              Last Modified
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {tickets.map((ticket) => (
            <TicketsTableRow
              key={ticket.id}
              ticket={ticket}
              onTicketClick={onTicketClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
