"use client";

import { useState, FormEvent } from "react";
import Ticket, { allCategories, allPriorities, allSites, allStatuses, Priority } from "@/lib/types/ticket";
import Button from "../ui/button";
import { BuildingOfficeIcon, PersonIcon, TagIcon } from "../ui/icons";
import { useCreateTicket } from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";

export interface TicketCreateProps {
  onCancel: () => void;
  onCreate: (created: Ticket) => void;
}

export default function TicketCreate({ onCancel, onCreate }: TicketCreateProps) {
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

  const [isSaving, setIsSaving] = useState(false);

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
      createTicket(formData, {
        onSuccess: (ticket) => {
          onCreate(ticket);
          addToast("New ticket created successfully!", "Success", 3500);
        },
        onError: (err) => {
          console.error("Error creating ticket:", err);
          addToast("An unexpected error occurred. Please try again.", "Error", 5000);
        },
        onSettled: () => setIsSaving(false),
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit}>
        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            required
          >
            {allPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="A descriptive ticket makes a good ticket."
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            rows={4}
          />
        </div>

        {/* Assigned To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <PersonIcon label="Assigned To" className="mr-1" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Unassigned"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>

          {/* Site */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <BuildingOfficeIcon label="Site" className="mr-1" />
            </label>
            <select
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              {allSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <TagIcon label="Category" className="mr-1" />
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cancel & Save Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300 rounded"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded"
            disabled={isSaving}
          >
            {isSaving ? "Creating..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
