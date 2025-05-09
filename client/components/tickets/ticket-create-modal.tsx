import { useState } from "react";

import Modal from "../ui/modal";
import TicketCreate from "./ticket-create";
import Button from "../ui/button";

export default function TicketCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <Button onClick={handleOpen} className="bg-gray-800 hover:bg-gray-700 text-white rounded">
        New Ticket
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <TicketCreate onCancel={handleClose} onCreate={handleClose} />
      </Modal>
    </>
  );
}
