"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BookOpenText,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  History,
  Laptop,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  ShieldAlert,
  Tag,
  Trash2,
  User,
  UserRoundCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import {
  useDeleteTicket,
  useTicket,
  useUpdateTicket,
} from "@/lib/hooks/queries/use-tickets";
import { useToast } from "@/lib/hooks/use-toast";
import Ticket, {
  Priority,
  Status,
  TicketActivityLogEntry,
  TicketDocumentation,
} from "@/lib/types/ticket";

type EditorTab =
  | "Documentation"
  | "Troubleshooting"
  | "Escalation"
  | "Activity Log"
  | "Instructor";

type TicketWorkflowStatus =
  | "New"
  | "In Progress"
  | "Waiting on User"
  | "Resolved"
  | "Escalated"
  | "Closed";

type TicketPriorityLabel = "Low" | "Medium" | "High";

type EditorState = {
  status: TicketWorkflowStatus;
  priority: TicketPriorityLabel;
  deviceId: string;
  location: string;
  troubleshootingSteps: string[];
  escalationEnabled: boolean;
  escalationReason: string;
  instructorReviewed: boolean;
  completedSuccessfully: boolean;
  instructorNotes: string;
  documentation: TicketDocumentation;
  activityLog: TicketActivityLogEntry[];
};

export interface TicketEditProps {
  ticketId: string;
}

const tabs: EditorTab[] = [
  "Documentation",
  "Troubleshooting",
  "Escalation",
  "Activity Log",
  "Instructor",
];

const statusOptions: TicketWorkflowStatus[] = [
  "New",
  "In Progress",
  "Waiting on User",
  "Resolved",
  "Escalated",
  "Closed",
];

const priorityOptions: TicketPriorityLabel[] = ["Low", "Medium", "High"];

const cardClassName =
  "rounded-[22px] border border-[#dfe4ef] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-[#1e293b] dark:bg-[#111827]";

const inputClassName =
  "w-full rounded-xl border border-[#dbe2ee] bg-white px-4 py-3 text-[15px] text-[#1f2937] outline-none transition placeholder:text-[#94a3b8] focus:border-[#16a34a] focus:ring-4 focus:ring-[#dcfce7] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f8fafc] dark:placeholder:text-[#64748b]";

const emptyDocumentation: TicketDocumentation = {
  reportedProblem: "",
  initialObservations: "",
  questionsAsked: "",
  rootCause: "",
  solutionApplied: "",
  verification: "",
  finalNotes: "",
};

const emptyEditorState: EditorState = {
  status: "New",
  priority: "Low",
  deviceId: "",
  location: "",
  troubleshootingSteps: [],
  escalationEnabled: false,
  escalationReason: "",
  instructorReviewed: false,
  completedSuccessfully: false,
  instructorNotes: "",
  documentation: emptyDocumentation,
  activityLog: [],
};

export default function TicketEdit({ ticketId }: TicketEditProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: ticket } = useTicket(ticketId, { enabled: !isDeleting });
  const { mutate: updateTicket } = useUpdateTicket();
  const { mutate: deleteTicket } = useDeleteTicket();
  const [activeTab, setActiveTab] = useState<EditorTab>("Documentation");
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const currentState = editorState ?? emptyEditorState;

  useEffect(() => {
    if (!ticket) {
      return;
    }

    setEditorState(buildEditorState(ticket));
  }, [ticket]);

  const summaryText = useMemo(() => {
    if (!currentState.documentation.reportedProblem) {
      return "";
    }

    return currentState.documentation.reportedProblem;
  }, [currentState]);

  if (isDeleting) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#64748b] dark:text-[#cbd5e1]">
        Deleting ticket...
      </div>
    );
  }

  if (!ticket || !editorState) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#64748b] dark:text-[#cbd5e1]">
        Loading ticket...
      </div>
    );
  }

  const currentTicket = ticket!;

  const persistUpdates = (updates: Partial<Ticket>, successMessage?: string) => {
    updateTicket(
      { id: ticketId, updates },
      {
        onSuccess: () => {
          if (successMessage) {
            addToast(successMessage, "Info", 2200);
          }
        },
        onError: () => {
          addToast("Failed to save ticket changes.", "Error", 3000);
        },
      },
    );
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as TicketWorkflowStatus;
    const nextActivityLog = appendActivity(
      currentState.activityLog,
      `Status changed to ${nextStatus}`,
    );

    setEditorState((current) =>
      current
        ? {
            ...current,
            status: nextStatus,
            activityLog: nextActivityLog,
          }
        : current,
    );

    persistUpdates(
      {
        status: mapUiStatusToTicketStatus(nextStatus),
        workflowStatus: nextStatus,
        activityLog: nextActivityLog,
      },
      "Ticket status updated.",
    );
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextPriority = event.target.value as TicketPriorityLabel;
    const nextActivityLog = appendActivity(
      currentState.activityLog,
      `Priority changed to ${nextPriority}`,
    );

    setEditorState((current) =>
      current
        ? {
            ...current,
            priority: nextPriority,
            activityLog: nextActivityLog,
          }
        : current,
    );

    persistUpdates(
      {
        priority: mapPriorityLabelToValue(nextPriority) as Priority,
        activityLog: nextActivityLog,
      },
      "Ticket priority updated.",
    );
  };

  const updateDocumentationField = (
    field: keyof TicketDocumentation,
    value: string,
  ) => {
    setEditorState((current) =>
      current
        ? {
            ...current,
            documentation: {
              ...current.documentation,
              [field]: value,
            },
          }
        : current,
    );
  };

  const saveDocumentationField = (
    field: keyof TicketDocumentation,
    value: string,
  ) => {
    const documentation = {
      ...currentState.documentation,
      [field]: value,
    };

    persistUpdates({
      documentation,
      ...(field === "reportedProblem" ? { description: value } : {}),
    });
  };

  const updateState = <K extends keyof EditorState>(
    key: K,
    value: EditorState[K],
  ) => {
    setEditorState((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current,
    );
  };

  const saveScalarField = <K extends keyof EditorState>(
    key: K,
    value: EditorState[K],
  ) => {
    switch (key) {
      case "deviceId":
      case "location":
      case "troubleshootingSteps":
      case "activityLog":
        persistUpdates({ [key]: value } as Partial<Ticket>);
        break;
      case "escalationEnabled":
      case "escalationReason":
        persistUpdates({
          escalation: {
            enabled:
              key === "escalationEnabled"
                ? (value as boolean)
                : currentState.escalationEnabled,
            reason:
              key === "escalationReason"
                ? (value as string)
                : currentState.escalationReason,
          },
        });
        break;
      case "instructorReviewed":
      case "completedSuccessfully":
      case "instructorNotes":
        persistUpdates({
          instructor: {
            reviewed:
              key === "instructorReviewed"
                ? (value as boolean)
                : currentState.instructorReviewed,
            completedSuccessfully:
              key === "completedSuccessfully"
                ? (value as boolean)
                : currentState.completedSuccessfully,
            notes:
              key === "instructorNotes"
                ? (value as string)
                : currentState.instructorNotes,
          },
        });
        break;
      default:
        break;
    }
  };

  const addTroubleshootingStep = () => {
    setEditorState((current) =>
      current
        ? {
            ...current,
            troubleshootingSteps: [
              ...current.troubleshootingSteps,
              `Step ${current.troubleshootingSteps.length + 1}`,
            ],
          }
        : current,
    );
  };

  const updateTroubleshootingStep = (index: number, value: string) => {
    setEditorState((current) => {
      if (!current) {
        return current;
      }

      const nextSteps = [...current.troubleshootingSteps];
      nextSteps[index] = value;

      return {
        ...current,
        troubleshootingSteps: nextSteps,
      };
    });
  };

  const removeTroubleshootingStep = (index: number) => {
    setEditorState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        troubleshootingSteps: current.troubleshootingSteps.filter(
          (_, stepIndex) => stepIndex !== index,
        ),
      };
    });
  };

  const saveTroubleshootingSteps = () => {
    const nextActivityLog = appendActivity(
      currentState.activityLog,
      "Saved troubleshooting steps",
    );

    setEditorState((current) =>
      current
        ? {
            ...current,
            activityLog: nextActivityLog,
          }
        : current,
    );

    persistUpdates(
      {
        troubleshootingSteps: currentState.troubleshootingSteps,
        activityLog: nextActivityLog,
      },
      "Troubleshooting steps saved.",
    );
  };

  return (
    <section className="mx-auto max-w-[1120px] space-y-6 px-3 pb-8 pt-1">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 items-start gap-5">
          <button
            type="button"
            onClick={() => router.push("/tickets")}
            className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#334155] transition hover:bg-[#f1f5f9] dark:text-[#e2e8f0] dark:hover:bg-[#1e293b]"
            aria-label="Back to tickets"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[39px] font-bold tracking-[-0.03em] text-[#202634] dark:text-[#f8fafc]">
                TCK-{currentTicket.id}
              </h1>
              <Pill
                label={currentState.status}
                className="border-[#f7d48a] bg-[#fff8e8] text-[#d8922d]"
              />
              <Pill
                label={currentState.priority}
                className="border-[#f7d48a] bg-[#fff8e8] text-[#d8922d]"
              />
              <Pill
                label={currentState.instructorReviewed ? "Reviewed" : "Not Reviewed"}
                className="border-[#dfe6f1] bg-[#f8fafc] text-[#7b879c]"
              />
            </div>

            <p className="mt-1 truncate text-[16px] text-[#7c889d] dark:text-[#cbd5e1]">
              {summaryText || "No documentation entered yet."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const shouldDelete = window.confirm(
                "Delete this ticket? This action cannot be undone.",
              );

              if (!shouldDelete) {
                return;
              }

              setIsDeleting(true);
              deleteTicket(currentTicket.id, {
                onSuccess: () => {
                  addToast("Ticket deleted.", "Info", 2200);
                  router.push("/tickets");
                },
                onError: () => {
                  setIsDeleting(false);
                  addToast("Failed to delete ticket.", "Error", 3000);
                },
              });
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#fecaca] text-[#f87171]"
            title="Delete ticket"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <select
            className="min-w-[182px] rounded-xl border border-[#dbe2ee] bg-white px-4 py-3 text-[15px] font-medium text-[#1f2937] outline-none focus:border-[#16a34a] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f8fafc]"
            value={currentState.status}
            onChange={handleStatusChange}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className={`${cardClassName} grid gap-5 md:grid-cols-2 xl:grid-cols-4`}>
        <InfoItem icon={<User className="h-4 w-4" />} label="Reported By">
          {currentTicket.createdBy}
        </InfoItem>
        <div>
          <p className="flex items-center gap-2 text-[14px] text-[#7c889d] dark:text-[#cbd5e1]">
            <Laptop className="h-4 w-4" />
            Device ID
          </p>
          <input
            className={`${inputClassName} mt-2`}
            value={currentState.deviceId}
            onChange={(event) => updateState("deviceId", event.target.value)}
            onBlur={(event) => saveScalarField("deviceId", event.target.value)}
            placeholder="PC-LAB1-15"
          />
        </div>
        <div>
          <p className="flex items-center gap-2 text-[14px] text-[#7c889d] dark:text-[#cbd5e1]">
            <MapPin className="h-4 w-4" />
            Location
          </p>
          <input
            className={`${inputClassName} mt-2`}
            value={currentState.location}
            onChange={(event) => updateState("location", event.target.value)}
            onBlur={(event) => saveScalarField("location", event.target.value)}
            placeholder="Computer Lab 1, Station 15"
          />
        </div>
        <InfoItem icon={<Tag className="h-4 w-4" />} label="Category">
          {currentTicket.category}
        </InfoItem>
        <InfoItem icon={<Clock3 className="h-4 w-4" />} label="Created">
          {formatDate(currentTicket.createdOn)}
        </InfoItem>
        <InfoItem icon={<UserRoundCheck className="h-4 w-4" />} label="Assigned To">
          {currentTicket.assignedTo || "Unassigned"}
        </InfoItem>
        <InfoItem icon={<Clock3 className="h-4 w-4" />} label="Updated">
          {formatDate(currentTicket.updatedAt)}
        </InfoItem>
        <div>
          <p className="flex items-center gap-2 text-[14px] text-[#7c889d] dark:text-[#cbd5e1]">
            <ShieldAlert className="h-4 w-4" />
            Priority
          </p>
          <select
            className="mt-2 w-full rounded-xl border border-[#dbe2ee] bg-white px-4 py-3 text-[15px] font-medium text-[#1f2937] outline-none focus:border-[#16a34a] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f8fafc]"
            value={currentState.priority}
            onChange={handlePriorityChange}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex flex-wrap gap-1 rounded-2xl bg-[#f3f6fb] p-1 dark:bg-[#0f172a]">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-[14px] px-4 py-2 text-[15px] font-semibold transition ${
                isActive
                  ? "bg-white text-[#202634] shadow-[0_0_0_2px_#3b82f6_inset] dark:bg-[#111827] dark:text-[#f8fafc]"
                  : "text-[#718096] hover:text-[#202634] dark:text-[#cbd5e1] dark:hover:text-[#f8fafc]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "Documentation" && (
        <div className="space-y-5">
          <DocCard
            icon={<FileText className="h-5 w-5" />}
            title="Reported Problem"
            value={currentState.documentation.reportedProblem}
            placeholder="Describe the problem reported by the user..."
            onChange={(value) => updateDocumentationField("reportedProblem", value)}
            onBlur={(value) => saveDocumentationField("reportedProblem", value)}
          />
          <DocCard
            icon={<Eye className="h-5 w-5" />}
            title="Initial Observations"
            value={currentState.documentation.initialObservations}
            placeholder="What did you observe initially?"
            onChange={(value) => updateDocumentationField("initialObservations", value)}
            onBlur={(value) => saveDocumentationField("initialObservations", value)}
          />
          <DocCard
            icon={<MessageSquare className="h-5 w-5" />}
            title="Questions Asked"
            value={currentState.documentation.questionsAsked}
            placeholder="What questions did you ask the user?"
            onChange={(value) => updateDocumentationField("questionsAsked", value)}
            onBlur={(value) => saveDocumentationField("questionsAsked", value)}
          />
          <DocCard
            icon={<Search className="h-5 w-5" />}
            title="Root Cause"
            value={currentState.documentation.rootCause}
            placeholder="What was the identified root cause?"
            onChange={(value) => updateDocumentationField("rootCause", value)}
            onBlur={(value) => saveDocumentationField("rootCause", value)}
          />
          <DocCard
            icon={<BadgeCheck className="h-5 w-5" />}
            title="Solution Applied"
            value={currentState.documentation.solutionApplied}
            placeholder="What solution was applied?"
            onChange={(value) => updateDocumentationField("solutionApplied", value)}
            onBlur={(value) => saveDocumentationField("solutionApplied", value)}
          />
          <DocCard
            icon={<BadgeCheck className="h-5 w-5" />}
            title="Verification"
            value={currentState.documentation.verification}
            placeholder="How did you confirm the issue was fixed?"
            onChange={(value) => updateDocumentationField("verification", value)}
            onBlur={(value) => saveDocumentationField("verification", value)}
          />
          <DocCard
            icon={<BookOpenText className="h-5 w-5" />}
            title="Final Notes"
            value={currentState.documentation.finalNotes}
            placeholder="Any notes for future reference..."
            onChange={(value) => updateDocumentationField("finalNotes", value)}
            onBlur={(value) => saveDocumentationField("finalNotes", value)}
          />
        </div>
      )}

      {activeTab === "Troubleshooting" && (
        <section className={cardClassName}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
              <Search className="h-5 w-5" />
              Troubleshooting Steps
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addTroubleshootingStep}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dbe2ee] bg-white px-4 py-3 text-[15px] font-semibold text-[#334155] transition hover:bg-[#f8fafc] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#e2e8f0] dark:hover:bg-[#1e293b]"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </button>
              <button
                type="button"
                onClick={saveTroubleshootingSteps}
                className="inline-flex items-center rounded-xl bg-[#16a34a] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#15803d]"
              >
                Save Steps
              </button>
            </div>
          </div>

          {currentState.troubleshootingSteps.length === 0 ? (
            <p className="py-10 text-center text-[15px] text-[#7c889d] dark:text-[#cbd5e1]">
              No troubleshooting steps recorded yet. Add your first step to begin
              documenting.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {currentState.troubleshootingSteps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#e5ebf3] bg-[#fbfcfe] p-4 dark:border-[#334155] dark:bg-[#0f172a]"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-[14px] font-semibold text-[#64748b] dark:text-[#cbd5e1]">
                      Step {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeTroubleshootingStep(index)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#fecaca] bg-white px-3 py-2 text-[13px] font-semibold text-[#dc2626] transition hover:bg-[#fff5f5] dark:bg-[#111827] dark:hover:bg-[#1f2937]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                  <textarea
                    className={`${inputClassName} min-h-[96px] resize-none`}
                    value={step}
                    onChange={(event) =>
                      updateTroubleshootingStep(index, event.target.value)
                    }
                    placeholder="Describe the troubleshooting step..."
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "Escalation" && (
        <section className={cardClassName}>
          <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
            <ShieldAlert className="h-5 w-5" />
            Escalation
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <p className="text-[16px] font-semibold text-[#2f3747] dark:text-[#e2e8f0]">Escalated</p>
            <Toggle
              checked={currentState.escalationEnabled}
              onChange={(checked) => {
                const nextActivityLog = appendActivity(
                  currentState.activityLog,
                  checked ? "Escalation enabled" : "Escalation removed",
                );

                setEditorState((current) =>
                  current
                    ? {
                        ...current,
                        escalationEnabled: checked,
                        activityLog: nextActivityLog,
                      }
                    : current,
                );

                persistUpdates({
                  escalation: {
                    enabled: checked,
                    reason: currentState.escalationReason,
                  },
                  activityLog: nextActivityLog,
                });
              }}
            />
          </div>

          <div className="mt-5 rounded-[20px] border border-[#dfe4ef] p-5 dark:border-[#334155]">
            <h3 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
              <ShieldAlert className="h-5 w-5" />
              Escalation Reason
            </h3>
            <textarea
              className={`${inputClassName} mt-4 min-h-[120px] resize-none`}
              value={currentState.escalationReason}
              onChange={(event) =>
                updateState("escalationReason", event.target.value)
              }
              onBlur={(event) =>
                saveScalarField("escalationReason", event.target.value)
              }
              placeholder="Why was this ticket escalated?"
            />
          </div>
        </section>
      )}

      {activeTab === "Activity Log" && (
        <section className={cardClassName}>
          <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
            <History className="h-5 w-5" />
            Activity History
          </h2>

          {currentState.activityLog.length === 0 ? (
            <p className="py-10 text-center text-[15px] text-[#7c889d] dark:text-[#cbd5e1]">
              No activity recorded
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {currentState.activityLog.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[#e5ebf3] bg-[#fbfcfe] p-4 dark:border-[#334155] dark:bg-[#0f172a]"
                >
                  <p className="font-medium text-[#202634] dark:text-[#f8fafc]">{item.label}</p>
                  <span className="text-[13px] text-[#7c889d] dark:text-[#cbd5e1]">
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "Instructor" && (
        <div className="space-y-5">
          <section className={cardClassName}>
            <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
              <GraduationCap className="h-5 w-5" />
              Instructor Review
            </h2>

            <div className="mt-5 flex items-center gap-4">
              <p className="text-[16px] font-semibold text-[#2f3747] dark:text-[#e2e8f0]">
                Reviewed
              </p>
              <Toggle
                checked={currentState.instructorReviewed}
                onChange={(checked) => {
                  updateState("instructorReviewed", checked);
                  saveScalarField("instructorReviewed", checked);
                }}
              />
            </div>

            <div className="mt-5 flex items-center gap-4">
              <p className="text-[16px] font-semibold text-[#2f3747] dark:text-[#e2e8f0]">
                Completed Successfully
              </p>
              <Toggle
                checked={currentState.completedSuccessfully}
                onChange={(checked) => {
                  updateState("completedSuccessfully", checked);
                  saveScalarField("completedSuccessfully", checked);
                }}
              />
            </div>
          </section>

          <section className={cardClassName}>
            <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
              <GraduationCap className="h-5 w-5" />
              Instructor Notes
            </h2>

            <textarea
              className={`${inputClassName} mt-4 min-h-[140px] resize-none`}
              value={currentState.instructorNotes}
              onChange={(event) => updateState("instructorNotes", event.target.value)}
              onBlur={(event) =>
                saveScalarField("instructorNotes", event.target.value)
              }
              placeholder="Private instructor review notes..."
            />
          </section>
        </div>
      )}
    </section>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[14px] text-[#7c889d] dark:text-[#cbd5e1]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-[17px] font-semibold text-[#202634] dark:text-[#f8fafc]">{children}</p>
    </div>
  );
}

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`rounded-xl border px-4 py-[6px] text-[14px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function DocCard({
  icon,
  title,
  value,
  placeholder,
  onChange,
  onBlur,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}) {
  return (
    <section className={cardClassName}>
      <h2 className="flex items-center gap-3 text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">
        {icon}
        {title}
      </h2>
      <textarea
        className={`${inputClassName} mt-4 min-h-[120px] resize-none`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => onBlur(event.target.value)}
        placeholder={placeholder}
      />
    </section>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition ${
        checked ? "bg-[#16a34a]" : "bg-[#e2e8f0] dark:bg-[#334155]"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

function mapUiStatusToTicketStatus(status: TicketWorkflowStatus): Status {
  switch (status) {
    case "New":
      return "Open";
    case "Escalated":
      return "Rejected";
    case "Resolved":
    case "Closed":
      return "Closed";
    case "In Progress":
    case "Waiting on User":
    default:
      return "Active";
  }
}

function mapPriorityLabelToValue(priority: TicketPriorityLabel) {
  switch (priority) {
    case "Low":
      return 1;
    case "Medium":
      return 3;
    case "High":
    default:
      return 5;
  }
}

function mapTicketPriorityToLabel(priority: number): TicketPriorityLabel {
  if (priority <= 1) {
    return "Low";
  }

  if (priority <= 3) {
    return "Medium";
  }

  return "High";
}

function mapTicketStatusToUi(status: Status): TicketWorkflowStatus {
  switch (status) {
    case "Open":
      return "New";
    case "Closed":
      return "Closed";
    case "Rejected":
      return "Escalated";
    case "Active":
    default:
      return "In Progress";
  }
}

function appendActivity(
  items: TicketActivityLogEntry[],
  label: string,
): TicketActivityLogEntry[] {
  return [
    {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      label,
      timestamp: new Date().toLocaleString(),
    },
    ...items,
  ];
}

function buildEditorState(ticket: Ticket): EditorState {
  return {
    status: ticket.workflowStatus || mapTicketStatusToUi(ticket.status),
    priority: mapTicketPriorityToLabel(ticket.priority),
    deviceId: ticket.deviceId || "",
    location: ticket.location || "",
    troubleshootingSteps: ticket.troubleshootingSteps || [],
    escalationEnabled: ticket.escalation?.enabled || false,
    escalationReason: ticket.escalation?.reason || "",
    instructorReviewed: ticket.instructor?.reviewed || false,
    completedSuccessfully: ticket.instructor?.completedSuccessfully || false,
    instructorNotes: ticket.instructor?.notes || "",
    documentation: {
      reportedProblem: ticket.documentation?.reportedProblem || ticket.description,
      initialObservations: ticket.documentation?.initialObservations || "",
      questionsAsked: ticket.documentation?.questionsAsked || "",
      rootCause: ticket.documentation?.rootCause || "",
      solutionApplied: ticket.documentation?.solutionApplied || "",
      verification: ticket.documentation?.verification || "",
      finalNotes: ticket.documentation?.finalNotes || "",
    },
    activityLog: ticket.activityLog || [],
  };
}

function formatDate(value: Date) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
