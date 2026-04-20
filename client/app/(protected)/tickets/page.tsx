"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useTickets } from "@/lib/hooks/queries/use-tickets";
import Ticket, { TicketLocations } from "@/lib/types/ticket";

type QueueTab = "active" | "resolved";
type ReviewFilter = "All Review Status" | "Reviewed" | "Not Reviewed";

const selectClassName =
  "rounded-xl border border-[#dbe2ee] bg-white px-5 py-3.5 text-[14px] font-medium text-[#1f2937] outline-none transition focus:border-[#16a34a] dark:border-[#334155] dark:bg-[#0f172a] dark:text-[#f8fafc]";

export default function TicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const initialCategory = searchParams?.get("category") || "All Categories";
  const initialPriority = searchParams?.get("priority") || "All Priority";
  const initialStatus = searchParams?.get("status") || "All Status";
  const initialReview =
    (searchParams?.get("review") as ReviewFilter | null) || "All Review Status";
  const initialLocation = searchParams?.get("location") || "All Locations";
  const initialTab = searchParams?.get("tab") === "resolved" ? "resolved" : "active";
  const [tab, setTab] = useState<QueueTab>(initialTab);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [technicianFilter, setTechnicianFilter] = useState("All Technicians");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>(initialReview);

  const { data: tickets, error } = useTickets({ query });
  const items = tickets || [];

  const activeTickets = useMemo(
    () =>
      items.filter((ticket) => {
        const workflowStatus = ticket.workflowStatus || mapStatusToWorkflow(ticket);
        return workflowStatus !== "Resolved" && workflowStatus !== "Closed";
      }),
    [items],
  );

  const resolvedTickets = useMemo(
    () =>
      items.filter((ticket) => {
        const workflowStatus = ticket.workflowStatus || mapStatusToWorkflow(ticket);
        return workflowStatus === "Resolved" || workflowStatus === "Closed";
      }),
    [items],
  );

  const technicianOptions = useMemo(
    () =>
      [
        "All Technicians",
        ...Array.from(
          new Set(
            items
              .map((ticket) => ticket.assignedTo?.trim())
              .filter((value): value is string => Boolean(value)),
          ),
        ).sort(),
      ] as string[],
    [items],
  );

  const visibleTickets = useMemo(() => {
    const source = tab === "active" ? activeTickets : resolvedTickets;

    return source.filter((ticket) => {
      const workflowStatus = ticket.workflowStatus || mapStatusToWorkflow(ticket);
      const priorityLabel = mapPriorityToLabel(ticket.priority);
      const reviewLabel = ticket.instructor?.reviewed ? "Reviewed" : "Not Reviewed";
      const ticketLocation = ticket.location || ticket.site;
      const categoryMatches =
        categoryFilter === "All Categories"
          ? true
          : ticket.category === categoryFilter ||
            ticket.title.toLowerCase().includes(categoryFilter.toLowerCase()) ||
            ticket.description.toLowerCase().includes(categoryFilter.toLowerCase()) ||
            (ticket.deviceId || "").toLowerCase().includes(categoryFilter.toLowerCase()) ||
            (ticket.location || "").toLowerCase().includes(categoryFilter.toLowerCase());
      const locationMatches =
        locationFilter === "All Locations"
          ? true
          : ticketLocation === locationFilter;

      if (statusFilter !== "All Status" && workflowStatus !== statusFilter) {
        return false;
      }

      if (priorityFilter !== "All Priority" && priorityLabel !== priorityFilter) {
        return false;
      }

      if (!categoryMatches) {
        return false;
      }

      if (!locationMatches) {
        return false;
      }

      if (
        technicianFilter !== "All Technicians" &&
        (ticket.assignedTo || "Unassigned") !== technicianFilter
      ) {
        return false;
      }

      if (reviewFilter !== "All Review Status" && reviewLabel !== reviewFilter) {
        return false;
      }

      return true;
    });
  }, [
    activeTickets,
    categoryFilter,
    locationFilter,
    priorityFilter,
    resolvedTickets,
    reviewFilter,
    statusFilter,
    tab,
    technicianFilter,
  ]);

  return (
    <section className="space-y-5">
      <div className="rounded-[24px] border border-[#dfe4ef] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.06)] dark:border-[#1e293b] dark:bg-[#111827]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf1f7] px-5 py-4 dark:border-[#1e293b]">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#202634] dark:text-[#f8fafc]">
              Ticket Queue
            </h1>
            <p className="mt-1 text-[14px] text-[#7c889d] dark:text-[#94a3b8]">
              Review and manage active support tickets.
            </p>
          </div>
          <Link
            href="/tickets/new"
            className="inline-flex items-center rounded-xl bg-[#16a34a] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#15803d]"
          >
            + New Ticket
          </Link>
        </div>

        <div className="border-b border-[#edf1f7] px-5 pt-5 dark:border-[#1e293b]">
          <div className="flex flex-wrap gap-3">
            <QueueTabButton
              active={tab === "active"}
              label="Active Queue"
              count={activeTickets.length}
              onClick={() => setTab("active")}
            />
            <QueueTabButton
              active={tab === "resolved"}
              label="Resolved / Closed"
              count={resolvedTickets.length}
              onClick={() => setTab("resolved")}
            />
          </div>
        </div>

        <div className="grid gap-4 border-b border-[#edf1f7] px-5 py-5 md:grid-cols-2 xl:grid-cols-6 dark:border-[#1e293b]">
          <select
            className={selectClassName}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All Status</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Waiting on User</option>
            <option>Resolved</option>
            <option>Escalated</option>
            <option>Closed</option>
          </select>

          <select
            className={selectClassName}
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            className={selectClassName}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option>All Categories</option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Network</option>
          </select>

          <select
            className={selectClassName}
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          >
            <option>All Locations</option>
            {TicketLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className={selectClassName}
            value={technicianFilter}
            onChange={(event) => setTechnicianFilter(event.target.value)}
          >
            {technicianOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className={selectClassName}
            value={reviewFilter}
            onChange={(event) =>
              setReviewFilter(event.target.value as ReviewFilter)
            }
          >
            <option>All Review Status</option>
            <option>Reviewed</option>
            <option>Not Reviewed</option>
          </select>
        </div>

        {error && (
          <div className="px-5 py-4 text-[#9a3412] dark:text-[#fca5a5]">{error.message}</div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#f8fafc] dark:bg-[#0f172a]">
              <tr className="border-b border-[#edf1f7] dark:border-[#1e293b]">
                <HeaderCell>Ticket #</HeaderCell>
                <HeaderCell>Date</HeaderCell>
                <HeaderCell>User</HeaderCell>
                <HeaderCell>Device</HeaderCell>
                <HeaderCell>Priority</HeaderCell>
                <HeaderCell>Category</HeaderCell>
                <HeaderCell>Technician</HeaderCell>
                <HeaderCell>Status</HeaderCell>
                <HeaderCell>Escalated</HeaderCell>
                <HeaderCell>Review</HeaderCell>
              </tr>
            </thead>
            <tbody>
              {visibleTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-16 text-center text-[15px] text-[#7c889d] dark:text-[#cbd5e1]"
                  >
                    No tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                visibleTickets.map((ticket) => {
                  const workflowStatus =
                    ticket.workflowStatus || mapStatusToWorkflow(ticket);
                  const priorityLabel = mapPriorityToLabel(ticket.priority);
                  const escalated = workflowStatus === "Escalated";
                  const reviewed = ticket.instructor?.reviewed;

                  return (
                    <tr
                      key={ticket.id}
                      className="cursor-pointer border-b border-[#edf1f7] transition hover:bg-[#f8fafc] dark:border-[#1e293b] dark:hover:bg-[#0f172a]"
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                    >
                      <BodyCell className="font-semibold">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="text-[#2563eb] hover:underline"
                        >
                          TCK-{ticket.id}
                        </Link>
                      </BodyCell>
                      <BodyCell className="min-w-[160px] py-5">{formatQueueDate(ticket.updatedAt)}</BodyCell>
                      <BodyCell>{ticket.createdBy}</BodyCell>
                      <BodyCell>
                        <div className="flex flex-col">
                          <span>{ticket.deviceId || "No device ID"}</span>
                          <span className="text-[13px] text-[#7c889d] dark:text-[#94a3b8]">
                            {ticket.location || ticket.site}
                          </span>
                        </div>
                      </BodyCell>
                      <BodyCell>
                        <InlineBadge tone={priorityTone(priorityLabel)}>
                          {priorityLabel}
                        </InlineBadge>
                      </BodyCell>
                      <BodyCell>{ticket.category}</BodyCell>
                      <BodyCell>{ticket.assignedTo || "Unassigned"}</BodyCell>
                      <BodyCell>
                        <InlineBadge tone={statusTone(workflowStatus)}>
                          {workflowStatus}
                        </InlineBadge>
                      </BodyCell>
                      <BodyCell>
                        <InlineBadge tone={escalated ? "danger" : "neutral"}>
                          {escalated ? "Yes" : "No"}
                        </InlineBadge>
                      </BodyCell>
                      <BodyCell>
                        <InlineBadge tone={reviewed ? "success" : "neutral"}>
                          {reviewed ? "Reviewed" : "Not Reviewed"}
                        </InlineBadge>
                      </BodyCell>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function QueueTabButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-t-xl border border-b-0 px-4 py-3 text-[15px] font-semibold transition ${
        active
          ? "border-[#dfe4ef] bg-white text-[#202634] dark:border-[#334155] dark:bg-[#111827] dark:text-[#f8fafc]"
          : "border-transparent bg-transparent text-[#7c889d] hover:text-[#202634] dark:text-[#94a3b8] dark:hover:text-[#f8fafc]"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[12px] ${
          active ? "bg-[#dcfce7] text-[#166534]" : "bg-[#eef2f7] text-[#64748b]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c889d] dark:text-[#94a3b8]">
      {children}
    </th>
  );
}

function BodyCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 text-[14px] text-[#202634] dark:text-[#f8fafc] ${className}`}>
      {children}
    </td>
  );
}

function InlineBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "danger" | "neutral" | "info";
}) {
  const className =
    tone === "success"
      ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
      : tone === "warning"
        ? "border-[#fde68a] bg-[#fff7e8] text-[#d97706]"
        : tone === "danger"
          ? "border-[#fecaca] bg-[#fff1f2] text-[#dc2626]"
          : tone === "info"
            ? "border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]"
            : "border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[13px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function mapStatusToWorkflow(ticket: Ticket) {
  switch (ticket.status) {
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

function mapPriorityToLabel(priority: number) {
  if (priority <= 1) {
    return "Low";
  }

  if (priority <= 3) {
    return "Medium";
  }

  return "High";
}

function priorityTone(priority: string) {
  switch (priority) {
    case "High":
      return "danger" as const;
    case "Medium":
      return "warning" as const;
    default:
      return "success" as const;
  }
}

function statusTone(status: string) {
  switch (status) {
    case "Resolved":
    case "Closed":
      return "success" as const;
    case "In Progress":
    case "Waiting on User":
      return "warning" as const;
    case "Escalated":
      return "danger" as const;
    case "New":
    default:
      return "info" as const;
  }
}

function formatQueueDate(value: Date) {
  return new Date(value).toLocaleDateString([], {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
