"use client";

import Link from "next/link";
import {
  Building,
  Calendar,
  CircleX,
  ClipboardList,
  ListChecks,
  PencilLine,
  SquareArrowUpRight,
  Tag,
  User,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";

import TicketAssignedTo from "./ticket-assigned-to";
import TicketEdit from "./ticket-edit";
import { useTicket, useUpdateTicket } from "@/lib/hooks/queries/use-tickets";
import {
  Status,
  TroubleshootingDetails,
  createEmptyTroubleshootingDetails,
} from "@/lib/types/ticket";
import Button from "../ui/button";
import Dropdown from "../ui/dropdown";
import LabeledIcon from "../ui/labeled-icon";
import Modal from "../ui/modal";

const troubleshootingFieldMeta: Array<{
  key: keyof TroubleshootingDetails;
  label: string;
  helper: string;
}> = [
  {
    key: "initialObservation",
    label: "Initial Observation",
    helper: "What was first reported or detected.",
  },
  {
    key: "stepsTaken",
    label: "Troubleshooting Steps Taken",
    helper: "Document each action and experiment.",
  },
  {
    key: "rootCause",
    label: "Root Cause",
    helper: "Why the incident occurred.",
  },
  {
    key: "solutionsApplied",
    label: "Solutions Applied",
    helper: "Fixes, patches, or workarounds implemented.",
  },
  {
    key: "verification",
    label: "Verification",
    helper: "How the resolution was validated.",
  },
  {
    key: "finalNotes",
    label: "Final Notes",
    helper: "Handoffs, lessons learned, or follow-up tasks.",
  },
];

export interface TicketDetailProps {
  ticketId: string;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function TicketDetail({
  ticketId,
  onDismiss,
  onUpdate,
}: TicketDetailProps) {
  const { data: ticket } = useTicket(ticketId);
  const { mutate: updateTicket } = useUpdateTicket();
  const [status, setStatus] = useState<Status>("Active");
  const [isEditing, setIsEditing] = useState(false);
  const [isTroubleshootingModalOpen, setTroubleshootingModalOpen] =
    useState(false);
  const [troubleshootingDraft, setTroubleshootingDraft] = useState<
    TroubleshootingDetails
  >(createEmptyTroubleshootingDetails());
  const [isTroubleshootingSaving, setTroubleshootingSaving] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setTroubleshootingDraft(
        ticket.troubleshooting ?? createEmptyTroubleshootingDetails()
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

  // If in editing mode, render the TicketEdit component
  if (isEditing) {
    return (
      <TicketEdit
        ticketId={ticketId}
        onCancel={() => setIsEditing(false)}
        onSave={(updates) => {
          setIsEditing(false);
          updateTicket({ id: ticketId, updates });
          setTimeout(onUpdate, 300);
        }}
      />
    );
  }

  const ticketCreatedAt = new Date(ticket.createdOn).toDateString();
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();

  const TicketCreatedBy = ({ createdBy }: { createdBy: string }) => {
    return (
      <Link
        className="underline hover:text-blue-500"
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${createdBy}`}
      >
        <LabeledIcon
          icon={<SquareArrowUpRight className="w-4" />}
          label={createdBy}
        />
      </Link>
    );
  };

  const labelStyles = "py-2 text-sm font-bold text-gray-800 dark:text-gray-300";
  const statusOpts = ["Active", "Open", "Closed", "Rejected"];

  const statusColor: Record<Status, string> = {
    Open: "bg-green-500 dark:bg-green-400 hover:text-green-500 dark:hover:text-green-400",
    Active:
      "bg-blue-500 dark:bg-blue-400 hover:text-blue-500 dark:hover:text-blue-400",
    Closed:
      "bg-gray-500 dark:bg-gray-400 hover:text-gray-500 dark:hover:text-gray-400",
    Rejected:
      "bg-red-500 dark:bg-red-400 hover:text-red-500 dark:hover:text-red-400",
  };

  const openTroubleshootingModal = () => {
    if (!ticket) return;
    setTroubleshootingDraft(
      ticket.troubleshooting ?? createEmptyTroubleshootingDetails()
    );
    setTroubleshootingModalOpen(true);
  };

  const closeTroubleshootingModal = () => {
    if (!ticket) return;
    setTroubleshootingDraft(
      ticket.troubleshooting ?? createEmptyTroubleshootingDetails()
    );
    setTroubleshootingModalOpen(false);
  };

  const handleTroubleshootingChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTroubleshootingDraft((prev) => ({
      ...prev,
      [name as keyof TroubleshootingDetails]: value,
    }));
  };

  const handleTroubleshootingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTroubleshootingSaving(true);

    updateTicket(
      { id: ticketId, updates: { troubleshooting: troubleshootingDraft } },
      {
        onSuccess: () => {
          setTroubleshootingSaving(false);
          setTroubleshootingModalOpen(false);
          setTimeout(onUpdate, 300);
        },
        onError: () => {
          setTroubleshootingSaving(false);
        },
      }
    );
  };

  const handleStatusSelection = (
    _event: MouseEvent<HTMLElement>,
    selectedOpt: string
  ) => {
    // Type cast should never fail
    const updatedStatus = selectedOpt as Status;

    setStatus(updatedStatus);
    updateTicket({ id: ticketId, updates: { status: updatedStatus } });
    setTimeout(onUpdate, 300);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between">
        <Button
          className="px-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded"
          onClick={onDismiss}
        >
          Close
        </Button>
        <Button
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
          onClick={() => setIsEditing(true)}
        >
          <LabeledIcon icon={<PencilLine className="w-4" />} label="Edit" />
        </Button>
      </div>
      <p className="mt-3 mb-1 text-sm text-gray-600 dark:text-gray-500">
        TK {ticket.id}
      </p>
      <div className="flex gap-5 items-center">
        <Dropdown
          className={`${
            statusColor[ticket.status]
          } text-white dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700`}
          value={status}
          opts={statusOpts}
          onSelect={handleStatusSelection}
        >
          <p className={`font-bold`}>{ticket.status}</p>
        </Dropdown>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-300">
          {ticket.title}
        </p>
      </div>
      <p className="my-4 text-gray-800 dark:text-gray-300">
        {ticket.description}
      </p>
      <table className="table-auto min-w-full">
        <tbody>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon
                icon={<User className="w-4" />}
                label="Assigned To"
              />
            </td>
            <td>
              <TicketAssignedTo assignedTo={ticket.assignedTo} />
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Building className="w-4" />} label="Site" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">{ticket.site}</td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<Tag className="w-4" />} label="Category" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              {ticket.category}
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon icon={<User className="w-4" />} label="Created By" />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              <TicketCreatedBy createdBy={ticket.createdBy} />
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon
                icon={<Calendar className="w-4" />}
                label="Created On"
              />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              {ticketCreatedAt}
            </td>
          </tr>
          <tr>
            <td className={labelStyles}>
              <LabeledIcon
                icon={<Calendar className="w-4" />}
                label="Last Modified"
              />
            </td>
            <td className="text-gray-800 dark:text-gray-300">
              {ticketUpdatedAt}
            </td>
          </tr>
        </tbody>
      </table>
      <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              <ClipboardList className="w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Troubleshooting Details
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track each milestone from discovery to closeout.
              </p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {troubleshootingFieldMeta.map((field, index) => {
            const value =
              ticket.troubleshooting?.[field.key] ||
              "No notes captured yet.";

            return (
              <div key={field.key} className="px-4 py-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      {index + 1}. {field.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {field.helper}
                    </p>
                  </div>
                  {field.key === "stepsTaken" && (
                    <Button
                      className="flex items-center gap-1 rounded border border-blue-500 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/40"
                      onClick={openTroubleshootingModal}
                    >
                      <LabeledIcon
                        icon={<ListChecks className="w-4" />}
                        label="Update Steps"
                      />
                    </Button>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line rounded-md bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-900/50 dark:text-gray-200">
                  {value.trim().length ? value : "No notes captured yet."}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <Modal active={isTroubleshootingModalOpen}>
        <div className="max-h-[70vh] w-full max-w-xl overflow-y-auto p-4 text-gray-800 dark:text-gray-200">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">Update Troubleshooting Log</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
              Capture the investigative journey so any teammate can pick up
              where you left off.
              </p>
            </div>
            <Button
              type="button"
              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={closeTroubleshootingModal}
              aria-label="Close troubleshooting editor"
            >
              <CircleX className="w-5" />
            </Button>
          </div>
          <form onSubmit={handleTroubleshootingSubmit} className="space-y-4">
            {troubleshootingFieldMeta.map((field, index) => (
              <div key={field.key}>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {index + 1}. {field.label}
                </label>
                <textarea
                  name={field.key}
                  value={troubleshootingDraft[field.key]}
                  onChange={handleTroubleshootingChange}
                  rows={field.key === "stepsTaken" ? 4 : 2}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={closeTroubleshootingModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-400"
                disabled={isTroubleshootingSaving}
              >
                {isTroubleshootingSaving ? "Saving..." : "Save Log"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
