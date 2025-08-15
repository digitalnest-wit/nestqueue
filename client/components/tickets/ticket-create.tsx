"use client";

import { useState, FormEvent } from "react";
import {
  Building,
  Check,
  ChevronsUp,
  LetterTextIcon,
  Tag,
  Text,
  User,
} from "lucide-react";

import { useCreateTicket } from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";
import Ticket, {
  Categories,
  Priority,
  Sites,
  Status,
  Priorities,
  Statuses,
} from "@/lib/types/ticket";
import Button from "../ui/button";
import FormTextInput from "../ui/form-input";
import FormSelectInput from "../ui/form-select";
import ticketAssignedTo from "./ticket-assigned-to";

export interface TicketCreateProps {
  onDismiss: (ticket?: Ticket) => void;
}

type FormInputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export default function TicketCreate({ onDismiss }: TicketCreateProps) {
  const { addToast } = useToast();
  const { mutate: createTicket } = useCreateTicket();
  const [formData, setFormData] = useState<Partial<Ticket>>({
    status: "Open",
    title: "",
    description: "",
    assignedTo: "",
    priority: 5,
    createdBy: "techsquad@digitalnest.org",
    site: "Watsonville",
    category: "Hardware",
  });

  const [saving, setSaving] = useState(false);

  const handleFormDismiss = () => onDismiss();

  const handleFormChanged = (e: React.ChangeEvent<FormInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const changes = { ...prev };

      if (name === "priority") {
        return {
          ...changes,
          priority: parseInt(value) as Priority,
        };
      }

      return {
        ...changes,
        [name]: value,
      };
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      createTicket(formData, {
        onSuccess: (ticket) => {
          addToast("New ticket created successfully!", "Success", 3500);
          onDismiss(ticket);
        },
        onError: (err) => {
          addToast(
            "An unexpected error occurred. Please try again.",
            "Error",
            5000
          );
          onDismiss();
          console.error("Error creating ticket:", err);
        },
        onSettled: () => setSaving(false),
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-3 text-sm">
      <h2 className="text-lg font-bold mb-2">Create Ticket</h2>
      <form onSubmit={handleFormSubmit}>
        <FormTextInput
          className="mb-2"
          icon={<LetterTextIcon width={16} />}
          label="Title"
          value={formData.title}
          onChange={handleFormChanged}
          placeholder="Enter a title"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <FormSelectInput
            className="mb-2"
            icon={<Check width={16} />}
            label="Status"
            value={formData.status}
            options={Statuses}
            onChange={handleFormChanged}
          />
          <FormSelectInput
            className="mb-2"
            icon={<ChevronsUp width={16} />}
            label="Priority"
            value={formData.priority}
            options={Priorities}
            onChange={handleFormChanged}
          />
        </div>
        <FormTextInput
          className="mb-2"
          icon={<Text width={16} />}
          label="Description"
          value={formData.description}
          rows={4}
          onChange={handleFormChanged}
          placeholder="A descriptive ticket makes a good ticket."
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <FormTextInput
            icon={<User width={16} />}
            label="Assigned To"
            value={formData.assignedTo}
            onChange={handleFormChanged}
            placeholder="Unassigned"
          />
          <FormSelectInput
            icon={<Building width={16} />}
            label="Site"
            value={formData.site}
            options={Sites}
            onChange={handleFormChanged}
          />
          <FormSelectInput
            icon={<Tag width={16} />}
            label="Category"
            value={formData.category}
            options={Categories}
            onChange={handleFormChanged}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-500 rounded"
            onClick={handleFormDismiss}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white rounded"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
