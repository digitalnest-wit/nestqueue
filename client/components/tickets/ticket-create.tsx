"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, BadgeHelp } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

import { useCreateTicket, useTickets } from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";
import Ticket, {
  Categories,
  Priority,
  TicketLocations,
} from "@/lib/types/ticket";
import { CreateTicketRequest } from "@/lib/types/api";
import Button from "../ui/button";

export interface TicketCreateProps {
  onDismiss: (ticket?: Ticket) => void;
  onCreated?: (ticket: Ticket) => void;
  mode?: "page" | "modal";
}

type FormInputElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

const priorityOptions = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 3 },
  { label: "High", value: 5 },
] as const;

export default function TicketCreate({
  onDismiss,
  onCreated,
  mode = "modal",
}: TicketCreateProps) {
  const { addToast } = useToast();
  const { mutate: createTicket } = useCreateTicket();
  const { data: tickets } = useTickets({});
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateTicketRequest>({
    title: "",
    description: "",
    assignedTo: "",
    priority: 5,
    createdBy: user?.displayName || user?.email || "techsquad@digitalnest.org",
    site: "Watsonville",
    category: "Hardware",
  });
  const [userName, setUserName] = useState(user?.displayName || "");
  const [deviceId, setDeviceId] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("Watsonville");

  const [saving, setSaving] = useState(false);

  const technicianOptions = useMemo(() => {
    return Array.from(
      new Set(
        (tickets || [])
          .map((ticket) => ticket.assignedTo?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [tickets]);

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

    const normalizedUser = userName.trim();
    const normalizedDevice = deviceId.trim();
    const normalizedLocation = deviceLocation.trim();

    const titleBase = normalizedDevice || normalizedLocation || formData.category;
    const request: CreateTicketRequest = {
      ...formData,
      title: `${formData.category} Issue - ${titleBase}`,
      description: formData.description.trim(),
      createdBy:
        normalizedUser || user?.displayName || user?.email || formData.createdBy,
      site: (normalizedLocation || "Watsonville") as CreateTicketRequest["site"],
      workflowStatus: "New",
      deviceId: normalizedDevice,
      location: normalizedLocation || "Watsonville",
      documentation: {
        reportedProblem: formData.description.trim(),
        initialObservations: "",
        questionsAsked: "",
        rootCause: "",
        solutionApplied: "",
        verification: "",
        finalNotes: "",
      },
      troubleshootingSteps: [],
      escalation: {
        enabled: false,
        reason: "",
      },
      activityLog: [
        {
          id:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `${Date.now()}`,
          label: "Ticket created",
          timestamp: new Date().toLocaleString(),
        },
      ],
      instructor: {
        reviewed: false,
        completedSuccessfully: false,
        notes: "",
      },
    };

    try {
      createTicket(request, {
        onSuccess: (ticket) => {
          addToast("New ticket created successfully!", "Success", 3500);
          onCreated?.(ticket);
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
    <section
      className={
        mode === "page"
          ? "mx-auto max-w-[760px] px-3 pb-6 pt-1"
          : "w-full max-w-[760px] rounded-[28px] border border-[#dfe4ef] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-[#1e293b] dark:bg-[#111827]"
      }
    >
      <div className="mb-6 flex items-start gap-4">
        <button
          type="button"
          onClick={handleFormDismiss}
          className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#334155] transition hover:bg-[#f1f5f9]"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-[31px] font-bold tracking-[-0.03em] text-[#202634] dark:text-[#f8fafc]">
            Create New Ticket
          </h1>
          <p className="mt-1 text-[16px] text-[#7c889d] dark:text-[#94a3b8]">
            Fill in the details to create a support ticket
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#dfe4ef] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] dark:border-[#1e293b] dark:bg-[#111827]">
        <div className="flex items-center gap-3 border-b border-[#edf1f7] px-6 py-5 dark:border-[#1e293b]">
          <BadgeHelp className="h-5 w-5 text-[#334155] dark:text-[#cbd5e1]" />
          <h2 className="text-[17px] font-bold text-[#202634] dark:text-[#f8fafc]">
            Ticket Information
          </h2>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="User Name" required>
              <input
                className={inputClassName}
                name="userName"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="e.g. John Smith"
                required
              />
            </Field>

            <Field label="Device ID">
              <input
                className={inputClassName}
                name="deviceId"
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
                placeholder="e.g. PC-LAB1-05"
              />
            </Field>
          </div>

          <Field label="Device / Location">
            <select
              className={inputClassName}
              name="deviceLocation"
              value={deviceLocation}
              onChange={(event) => setDeviceLocation(event.target.value)}
            >
              {TicketLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Priority Level">
              <select
                className={inputClassName}
                name="priority"
                value={formData.priority}
                onChange={handleFormChanged}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category" required>
              <select
                className={inputClassName}
                name="category"
                value={formData.category}
                onChange={handleFormChanged}
                required
              >
                {Categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Assign Technician (optional)">
            <input
              className={inputClassName}
              name="assignedTo"
              list="assigned-technician-options"
              value={formData.assignedTo || ""}
              onChange={handleFormChanged}
              placeholder="e.g. Student name"
            />
            <datalist id="assigned-technician-options">
              {technicianOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </Field>

          <Field label="Reported Problem" required>
            <textarea
              className={`${inputClassName} min-h-[124px] resize-none py-4`}
              name="description"
              value={formData.description}
              onChange={handleFormChanged}
              placeholder="Describe the problem as reported by the user..."
              required
            />
          </Field>

          <div className="flex justify-end gap-3 border-t border-[#edf1f7] pt-6">
            <Button
              className="rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 text-[15px] font-semibold text-[#334155] transition hover:bg-[#f8fafc] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#e2e8f0] dark:hover:bg-[#1e293b]"
              onClick={handleFormDismiss}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#16a34a] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-[#15803d]"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold text-[#2f3747] dark:text-[#e2e8f0]">
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-[#dbe2ee] bg-white px-4 py-3 text-[15px] text-[#1f2937] outline-none transition placeholder:text-[#94a3b8] focus:border-[#16a34a] focus:ring-4 focus:ring-[#dcfce7] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f8fafc] dark:placeholder:text-[#64748b]";
