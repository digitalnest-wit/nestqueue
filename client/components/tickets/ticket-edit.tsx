"use client";

import Ticket, { allCategories, allPriorities, allSites, allStatuses, Priority } from "@/lib/types/ticket";
import Button from "../ui/button";
import { BuildingOfficeIcon, PersonIcon, TagIcon } from "../ui/icons";
import { FormEvent, useState } from "react";
import { useTicket, useUpdateTicket } from "@/lib/hooks/queries/use-tickets";

export interface TicketEditProps {
  ticketId: string;
  onCancel: () => void;
  onSave: (updates: Partial<Ticket>) => void;
}

export default function TicketEdit({ ticketId, onCancel, onSave }: TicketEditProps) {
  const { data: ticket } = useTicket(ticketId);
  const { mutate: updateTicket } = useUpdateTicket();

  const [formData, setFormData] = useState<Partial<Ticket>>(ticket || {});
  const [isSaving, setIsSaving] = useState(false);

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
      updateTicket({ id: ticketId, updates: formData });
      onSave(formData);
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const commonLabelStyle = "text-sm font-medium mb-1";
  const commonSelectStyle = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md";

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Ticket</h2>
        <Button
          className="px-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
          onClick={onCancel}
        >
          &lt;-
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-500">TK {ticket.id}</p>

        {/* Ticket status */}
        <div className="mb-4">
          <label className={`block ${commonLabelStyle}`}>Status</label>
          <select name="status" value={formData.status || ticket.status} onChange={handleChange} className={commonSelectStyle}>
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket priority */}
        <div className="mb-4">
          <label className={`block ${commonLabelStyle}`}>Priority</label>
          <select
            name="priority"
            value={formData.priority || ticket.priority}
            onChange={handleChange}
            className={commonSelectStyle}
            required
          >
            {allPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket title */}
        <div className="mb-4">
          <label className={`block ${commonLabelStyle}`}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ticket.title}
            onChange={handleChange}
            className={commonSelectStyle}
            required
          />
        </div>

        {/* Ticket description */}
        <div className="mb-4">
          <label className={`block ${commonLabelStyle}`}>Description</label>
          <textarea
            name="description"
            value={formData.description || ticket.description}
            onChange={handleChange}
            className={commonSelectStyle}
            rows={4}
          />
        </div>

        {/* Ticket assigned to */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`flex items-center ${commonLabelStyle}`}>
              <PersonIcon label="Assigned To" className="mr-1" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo || ticket.assignedTo}
              onChange={handleChange}
              className={commonSelectStyle}
            />
          </div>

          {/* Ticket site */}
          <div>
            <label className={`flex items-center ${commonLabelStyle}`}>
              <BuildingOfficeIcon label="Site" className="mr-1" />
            </label>
            <select name="site" value={formData.site || ticket.site} onChange={handleChange} className={commonSelectStyle}>
              {allSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          {/* Ticket category */}
          <div>
            <label className={`flex items-center ${commonLabelStyle}`}>
              <TagIcon label="Category" className="mr-1" />
            </label>
            <select name="category" value={formData.category || ticket.category} onChange={handleChange} className={commonSelectStyle}>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {/* Cancel button */}
          <Button
            type="button"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
            onClick={onCancel}
          >
            Cancel
          </Button>
          {/* Save button */}
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
