"use client";

import { useState, FormEvent } from "react";
import { Building, Tag, User } from "lucide-react";

import { useCreateTicket } from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";
import Ticket, { Categories, Priority, Sites, Status, Priorities, Statuses } from "@/lib/types/ticket";
import Button from "../ui/button";
import LabeledIcon from "../ui/labeled-icon";

export interface TicketCreateProps {
  onCancel: () => void;
  onCreate: (created: Ticket) => void;
}

export default function TicketCreate({ onCancel, onCreate }: TicketCreateProps) {
  const { addToast } = useToast();
  const { mutate: createTicket } = useCreateTicket();
  const [formData, setFormData] = useState<Partial<Ticket> & { deadline?: string }>({
    status: "Open",
    title: "",
    description: "",
    assignedTo: "",
    priority: 5,
    createdBy: "techsquad@digitalnest.org",
    site: "Watsonville",
    category: "Hardware",
    deadline: "",
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

  const labelStyles = "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputStyles = "w-full p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md";

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={`block ${labelStyles}`}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
            {Statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyles}`}>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className={inputStyles} required>
            {Priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyles}`}>
            Title
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title"
            className={inputStyles}
            required
          />
        </div>
        <div className="mb-4">
          <label className={`block ${labelStyles}`}>Description</label>
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
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <LabeledIcon className="mr-1" icon={<User className="w-4" />} label="Assigned To" />
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Unassigned"
              className={inputStyles}
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <LabeledIcon className="mr-1" icon={<Building className="w-4" />} label="Site" />
            </label>
            <select
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
            >
              {Sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`flex items-center ${labelStyles}`}>
              <LabeledIcon className="mr-1" icon={<Tag className="w-4" />} label="Category" />
            </label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputStyles}>
              {Categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Deadline input */}
        <div className="mb-2">
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            className="w-full rounded border bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            type="date"
            name="deadline"
            value={formData.deadline || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
          />
        </div>
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
