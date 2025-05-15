import { useState } from "react";

import Modal from "../ui/modal";
import TicketCreate from "./ticket-create";
import Button from "../ui/button";
import { PlusIcon } from "../ui/icons";
import { useToast } from "@/lib/hooks/use-toast";

export default function TicketCreateModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <Button
        onClick={handleOpen}
        className="border border-green-600 dark:border-green-700 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 dark:hover:border-green-800 text-white rounded"
      >
        <PlusIcon label="New" />
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <TicketCreate onCancel={handleClose} onCreate={handleClose} />
      </Modal>
    </>
  );
}
