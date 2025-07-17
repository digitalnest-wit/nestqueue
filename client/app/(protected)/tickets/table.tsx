"use client";

import Ticket from "@/lib/types/ticket";
import Link from "next/link";

interface TableProps {
  tickets: Ticket[];
  onRowClick: (ticket: Ticket) => void;
}

export default function Table({ tickets, onRowClick }: TableProps) {
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
            <TableRow
              key={ticket.id}
              ticket={ticket}
              onClick={() => onRowClick(ticket)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TableRowProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

function TableRow({ ticket, onClick }: TableRowProps) {
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();
  const styles = {
    column: "p-4 text-left text-gray-700",
    status: "",
  };

  switch (ticket.status) {
    case "Open":
      styles.status = "text-green-500";
      break;
    case "Active":
      styles.status = "text-blue-500";
      break;
    case "Closed":
      styles.status = "text-gray-500";
      break;
    case "Rejected":
      styles.status = "text-red-500";
      break;
  }

  return (
    <tr className="hover:bg-gray-200" onClick={() => onClick(ticket)}>
      <td className={`${styles.column} min-w-[5rem]`}>P{ticket.priority}</td>
      <td className={`${styles.column} min-w-[5rem] hidden md:block`}>
        {ticket.category}
      </td>
      <td
        className={`${styles.column} min-w-[5rem] truncate whitespace-nowrap overflow-hidden`}
      >
        {ticket.title}
      </td>
      <td className={`${styles.column} hidden md:block`}>
        {ticket.assignedTo ? (
          <Link
            className="inline-block underline text-gray-800 hover:text-blue-500"
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${ticket.assignedTo}`}
          >
            {ticket.assignedTo}
          </Link>
        ) : (
          <span>Unassigned</span>
        )}
      </td>
      <td className={styles.column}>
        <span className={styles.status}>{ticket.status}</span>
      </td>
      <td className={`${styles.column} min-w-[10rem] hidden sm:block`}>
        {ticketUpdatedAt}
      </td>
    </tr>
  );
}
