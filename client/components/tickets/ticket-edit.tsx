"use client";

import Ticket, { Category, Site, Status } from "@/lib/types/ticket";
import Button from "../ui/button";
import { BuildingOfficeIcon, PersonIcon, TagIcon } from "../ui/icons";
import { FormEvent, useState } from "react";
import { useTicket } from "@/lib/hooks/use-tickets";

export interface TicketEditProps {
  ticketId: string;
  onCancel: () => void;
  onSave: (updates: Partial<Ticket>) => void;
}

export default function TicketEdit({ ticketId, onCancel, onSave }: TicketEditProps) {
  const { ticket, updateTicket } = useTicket(ticketId);
  const [formData, setFormData] = useState<Partial<Ticket>>(ticket || {});
  const [isSaving, setIsSaving] = useState(false);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center gap-5 h-full">
        <span className="text-red-500 font-bold text-2xl">404</span>
        <div>
          <p className="font-bold text-xl">Not Found</p>
          <p>We couldn't find a ticket with that matching ID.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateTicket(formData);
      onSave(formData);
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions: Status[] = ["Active", "Open", "Closed", "Rejected"];
  const siteOptions: Site[] = ["Gilroy", "HQ", "Modesto", "Salinas", "Stockton", "Watsonville"];
  const categoryOptions: Category[] = ["Hardware", "Network", "Software"];

  return (
    <div className="p-4 bg-gray-50">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Edit Ticket</h2>
        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <p className="mt-3 mb-1 text-sm text-gray-600">TK {ticket.id}</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status || ticket.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ticket.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ticket.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <PersonIcon label="Assigned To" className="mr-1" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo || ticket.assignedTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <BuildingOfficeIcon label="Site" className="mr-1" />
            </label>
            <select
              name="site"
              value={formData.site || ticket.site}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {siteOptions.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <TagIcon label="Category" className="mr-1" />
            </label>
            <select
              name="category"
              value={formData.category || ticket.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
