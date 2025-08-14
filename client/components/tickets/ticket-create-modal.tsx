"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import TicketCreate from "./ticket-create";
import Button from "../ui/button";
import LabeledIcon from "../ui/labeled-icon";
import Modal from "../ui/modal";

export default function TicketCreateModal() {
  const [active, setActive] = useState(false);

  const handleClose = () => setActive(false);
  const handleOpen = () => setActive(true);

  return (
    <>
      <Button
        onClick={handleOpen}
        className="border border-green-600 dark:border-green-700 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 dark:hover:border-green-800 text-white rounded"
      >
        <LabeledIcon
          className="text-sm"
          icon={<Plus className="w-4" />}
          label="New"
        />
      </Button>
      <Modal active={active}>
        <TicketCreate onCancel={handleClose} onCreate={handleClose} />
      </Modal>
    </>
  );
}
