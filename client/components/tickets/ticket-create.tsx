"use client";

import { useState, FormEvent } from "react";
import Ticket, { Category, Priority, Site, Status } from "@/lib/types/ticket";
import Button from "../ui/button";
import { BuildingOfficeIcon, PersonIcon, TagIcon } from "../ui/icons";
import { useCreateTicket } from "@/lib/hooks/queries/use-tickets";

export interface TicketCreateProps {
  onCancel: () => void;
  onCreate: (created: Ticket) => void;
}

export default function TicketCreate({ onCancel, onCreate }: TicketCreateProps) {
  const { mutate: createTicket } = useCreateTicket();
  const [formData, setFormData] = useState<Partial<Ticket>>({
    status: "Open",
    title: "",
    description: "",
    assignedTo: "",
    site: "Watsonville",
    category: "Hardware",
  });

  const [isSaving, setIsSaving] = useState(false);

  const statusOptions: Status[] = ["Active", "Open", "Closed", "Rejected"];
  const siteOptions: Site[] = ["Gilroy", "HQ", "Modesto", "Salinas", "Stockton", "Watsonville"];
  const categoryOptions: Category[] = ["Hardware", "Network", "Software"];
  const priorityOptions: Priority[] = [5, 4, 3, 2, 1];

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      createTicket(formData as Ticket, {
        onSuccess: (created) => {
          onCreate(created);
        },
        onError: (err) => {
          console.error("Error creating ticket:", err);
        },
        onSettled: () => {
          setIsSaving(false);
        },
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit}>
        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        {/* Assigned To, Site, Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <PersonIcon label="Assigned To" className="mr-1" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <BuildingOfficeIcon label="Site" className="mr-1" />
            </label>
            <select name="site" value={formData.site} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
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
              value={formData.category}
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

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-600 rounded" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white rounded" disabled={isSaving}>
            {isSaving ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
