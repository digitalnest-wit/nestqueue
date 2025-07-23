"use client";

import Ticket from "@/lib/types/ticket";
import TicketsTableRow from "./table-row";
import Modal from "../ui/modal";
import TicketView from "./view";
import { useState } from "react";

interface TicketsTableProps {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: TicketsTableProps) {
  const [selected, setSelected] = useState<Ticket>();
  const [active, setActive] = useState(false);

  const handleTicketClick = (ticket: Ticket) => {
    setSelected(ticket);
    setActive(true);
  };

  const handleModalDismiss = () => {
    setSelected(undefined);
    setActive(false);
  };

  const styles = {
    common: "px-4 py-2 text-left text-sm text-gray-700",
    mobileHidden: "hidden md:block",
  };

  return (
    <>
      <Modal active={active}>
        <TicketView ticket={selected} onDismiss={handleModalDismiss} />
      </Modal>
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
                onTicketClick={handleTicketClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
