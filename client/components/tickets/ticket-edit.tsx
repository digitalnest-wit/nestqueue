"use client";

import { Building, Tag, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { useTicket, useUpdateTicket } from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";
import Ticket, { Categories, Priority, Sites, Status, Priorities, Statuses } from "@/lib/types/ticket";
import Button from "../ui/button";
import LabeledIcon from "../ui/labeled-icon";

export interface TicketEditProps {
  ticketId: string;
  onCancel: () => void;
  onSave: (updates: Partial<Ticket>) => void;
}

export default function TicketEdit({ ticketId, onCancel, onSave }: TicketEditProps) {
  const { addToast } = useToast();
  const { data: ticket } = useTicket(ticketId);
  const { mutate: updateTicket } = useUpdateTicket();

  const [formData, setFormData] = useState<Omit<Partial<Ticket>, "deadline"> & { deadline?: string | Date }>(ticket || ({} as Omit<Partial<Ticket>, "deadline"> & { deadline?: string | Date }));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ticket) {
      const normalizedDeadline = ticket.deadline
        ? (String(ticket.deadline).includes("T") ? String(ticket.deadline).split("T")[0] : String(ticket.deadline))
        : "";

      setFormData((prev) =>
        ({
          ...(prev as Omit<Partial<Ticket>, "deadline"> & { deadline?: string | Date }),
          deadline: normalizedDeadline,
        } as Omit<Partial<Ticket>, "deadline"> & { deadline?: string | Date })
      );
    }
  }, [ticket]);

  if (!ticket) {
    let layout = <></>;

    // Show not found error after 1 sec
    setTimeout(() => {
      layout = (
        <div className="flex items-center justify-center gap-5 h-[100vh]">
          <span className="text-red-500 font-bold text-2xl">404</span>
          <div>
            <p className="font-bold text-xl">Not Found</p>
            <p>We couldn't find a ticket with that matching ID.</p>
          </div>
        </div>
      );
    }, 1 * 1000);

    return layout;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const normalizedDeadline = formData.deadline
        ? typeof formData.deadline === "string"
          ? new Date(formData.deadline)
          : (formData.deadline as Date)
        : undefined;

      const updates: Partial<Ticket> = {
        ...(formData as Omit<Partial<Ticket>, "deadline">),
        deadline: normalizedDeadline,
      };

      updateTicket({ id: ticketId, updates });
      onSave(updates);
      addToast("Ticket updated successfully.", "Info", 2500);
    } catch (error) {
      console.error("Error updating ticket:", error);
      addToast("An unexpected error occurred. Please try again.", "Error", 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const labelStyle = "text-sm font-medium text-gray-800 dark:text-gray-300 mb-1";
  const inputStyles = "w-full p-2 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300 rounded-md";

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Ticket</h2>
        <Button
          className="px-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
          onClick={onCancel}
        >
          &lt;-
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-500">TK {ticket.id}</p>
        <div className="mb-4">
          <label className={`block ${labelStyle}`}>Status</label>
          <select name="status" value={formData.status || ticket.status} onChange={handleChange} className={inputStyles}>
            {Statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyle}`}>Priority</label>
          <select
            name="priority"
            value={formData.priority || ticket.priority}
            onChange={handleChange}
            className={inputStyles}
            required
          >
            {Priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyle}`}>
            Title
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Enter a title"
            onChange={handleChange}
            className={inputStyles}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyle}`}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="A descriptive ticket makes a good ticket."
            onChange={handleChange}
            className={inputStyles}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`flex items-center ${labelStyle}`}>
              <LabeledIcon className="mr-1" icon={<User className="w-4" />} label="Assigned To" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              placeholder="Unassigned"
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={`flex items-center ${labelStyle}`}>
              <LabeledIcon className="mr-1" icon={<Building className="w-4" />} label="Site" />
            </label>
            <select name="site" value={formData.site || ticket.site} onChange={handleChange} className={inputStyles}>
              {Sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`flex items-center ${labelStyle}`}>
              <LabeledIcon className="mr-1" icon={<Tag className="w-4" />} label="Category" />
            </label>
            <select name="category" value={formData.category || ticket.category} onChange={handleChange} className={inputStyles}>
              {Categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Deadline input in the edit form */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={
              formData.deadline instanceof Date
                ? formData.deadline.toISOString().split("T")[0]
                : (formData.deadline ?? "")
            }
            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value as string }))}
            className={inputStyles}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded"
            disabled={isSaving}
          >
            {isSaving ? "Updating..." : "Update Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
