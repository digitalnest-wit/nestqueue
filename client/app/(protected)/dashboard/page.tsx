"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  GraduationCap,
  HardDrive,
  LaptopMinimal,
  Network,
  Printer,
  UserRound,
  CircleDot,
} from "lucide-react";

import { useTickets } from "@/lib/hooks/queries/use-tickets";
import Ticket from "@/lib/types/ticket";

type StatCard = {
  label: string;
  value: number;
  helper?: string;
  icon: React.ReactNode;
  iconClassName: string;
};

type QuickFilter = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

const categoryFilters: QuickFilter[] = [
  {
    label: "Hardware",
    icon: <LaptopMinimal className="h-4 w-4" />,
    href: "/tickets?category=Hardware",
  },
  {
    label: "Software",
    icon: <HardDrive className="h-4 w-4" />,
    href: "/tickets?category=Software",
  },
  {
    label: "Network",
    icon: <Network className="h-4 w-4" />,
    href: "/tickets?category=Network",
  },
  {
    label: "Account",
    icon: <UserRound className="h-4 w-4" />,
    href: "/tickets?category=Account",
  },
  {
    label: "Printer",
    icon: <Printer className="h-4 w-4" />,
    href: "/tickets?category=Printer",
  },
  {
    label: "Other",
    icon: <CircleDot className="h-4 w-4" />,
    href: "/tickets?category=Other",
  },
];

const priorityFilters = [
  {
    label: "High",
    className: "text-[#ef5d50]",
    href: "/tickets?priority=High",
  },
  {
    label: "Medium",
    className: "text-[#e59c33]",
    href: "/tickets?priority=Medium",
  },
  {
    label: "Low",
    className: "text-[#57aa74]",
    href: "/tickets?priority=Low",
  },
];

function ticketDateValue(value: Ticket["updatedAt"] | string) {
  return new Date(value).getTime();
}

function ticketWorkflowStatus(ticket: Ticket) {
  if (ticket.workflowStatus) {
    return ticket.workflowStatus;
  }

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

function priorityLabel(ticket: Ticket) {
  if (ticket.priority <= 1) {
    return "Low";
  }

  if (ticket.priority <= 3) {
    return "Medium";
  }

  return "High";
}

function summarizeActivityLabel(label: string) {
  const lower = label.toLowerCase();

  if (lower.includes("status changed")) {
    return "Status updated";
  }

  if (lower.includes("priority changed")) {
    return "Priority updated";
  }

  if (lower.includes("troubleshooting")) {
    return "Troubleshooting updated";
  }

  if (lower.includes("ticket created")) {
    return "Ticket created";
  }

  return label;
}

function formatTimestamp(timestamp: string | Date) {
  const parsed = new Date(timestamp);

  if (Number.isNaN(parsed.getTime())) {
    return String(timestamp);
  }

  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function DashboardPage() {
  const { data: tickets, error } = useTickets({});
  const items = tickets || [];

  const activeCount = items.filter((ticket) => ticket.status === "Active").length;
  const newCount = items.filter((ticket) => ticketWorkflowStatus(ticket) === "New").length;
  const inProgressCount = items.filter(
    (ticket) => ticketWorkflowStatus(ticket) === "In Progress",
  ).length;
  const resolvedCount = items.filter((ticket) => {
    const workflowStatus = ticketWorkflowStatus(ticket);
    return workflowStatus === "Resolved" || workflowStatus === "Closed";
  }).length;
  const escalatedCount = items.filter((ticket) => {
    const workflowStatus = ticketWorkflowStatus(ticket);
    return workflowStatus === "Escalated" || ticket.escalation?.enabled;
  }).length;
  const highPriorityCount = items.filter(
    (ticket) => priorityLabel(ticket) === "High",
  ).length;
  const reviewedCount = items.filter(
    (ticket) => Boolean(ticket.instructor?.reviewed),
  ).length;

  const statCards: StatCard[] = [
    {
      label: "Active",
      value: activeCount,
      helper: "open tickets",
      icon: <TicketIcon />,
      iconClassName: "bg-[#dcfce7] text-[#15803d]",
    },
    {
      label: "New",
      value: newCount,
      icon: <Clock3 className="h-5 w-5" />,
      iconClassName: "bg-[#dbeafe] text-[#2563eb]",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: <RefreshIcon />,
      iconClassName: "bg-[#fff4e8] text-[#d88a2c]",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconClassName: "bg-[#dcfce7] text-[#16a34a]",
    },
    {
      label: "Escalated",
      value: escalatedCount,
      icon: <AlertTriangle className="h-5 w-5" />,
      iconClassName: "bg-[#fff0ee] text-[#e56358]",
    },
    {
      label: "High Priority",
      value: highPriorityCount,
      icon: <ArrowUpRight className="h-5 w-5" />,
      iconClassName: "bg-[#fee2e2] text-[#dc2626]",
    },
    {
      label: "Reviewed",
      value: reviewedCount,
      helper: "instructor approved",
      icon: <GraduationCap className="h-5 w-5" />,
      iconClassName: "bg-[#ede9fe] text-[#7c3aed]",
    },
  ];

  const recentActivity = items
    .flatMap((ticket) =>
      (ticket.activityLog || []).map((entry) => ({
        ticketId: ticket.id,
        title: summarizeActivityLabel(entry.label),
        detail: entry.label,
        time: entry.timestamp,
        actor: ticket.assignedTo || ticket.createdBy,
      })),
    )
    .sort((left, right) => ticketDateValue(right.time) - ticketDateValue(left.time))
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[43px] font-bold tracking-[-0.03em] text-[#1f2937] dark:text-[#f8fafc]">
            Dashboard
          </h1>
          <p className="mt-1 text-[16px] text-[#7c889d] dark:text-[#94a3b8]">
            Overview of your IT support queue
          </p>
        </div>

        <Link
          href="/tickets/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(22,163,74,0.28)] transition hover:bg-[#15803d]"
        >
          <PlusIcon />
          New Ticket
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#f5c6be] bg-[#fff7f5] px-5 py-4 text-[#9f3f33] dark:bg-[#2a1414] dark:text-[#fecaca]">
          {error.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {statCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[20px] border border-[#dfe4ef] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-[#1e293b] dark:bg-[#111827]"
          >
            <div className="flex flex-col items-start gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconClassName}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.11em] text-[#77839b] dark:text-[#94a3b8]">
                  {card.label}
                </p>
                <p className="mt-2 text-[36px] font-bold leading-none text-[#202634] dark:text-[#f8fafc]">
                  {card.value}
                </p>
                {card.helper && (
                  <p className="mt-2 max-w-[80px] text-[13px] leading-5 text-[#8b95a8] dark:text-[#94a3b8]">
                    {card.helper}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_370px]">
        <section className="rounded-[24px] border border-[#dfe4ef] bg-white p-6 shadow-[0_20px_48px_rgba(15,23,42,0.05)] dark:border-[#1e293b] dark:bg-[#111827]">
          <h2 className="text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">Recent Activity</h2>

          {recentActivity.length === 0 ? (
            <p className="mt-6 text-[15px] text-[#7c889d] dark:text-[#94a3b8]">
              No ticket activity yet.
            </p>
          ) : (
            <div className="mt-5">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.ticketId}-${activity.time}-${index}`}
                  className={`flex gap-4 rounded-2xl px-4 py-5 ${
                    index === recentActivity.length - 1
                      ? ""
                      : "border-b border-[#dbe4f0] dark:border-[#334155]"
                  }`}
                >
                  <div className="pt-[9px]">
                    <span className="block h-[9px] w-[9px] rounded-full bg-[#16a34a]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#293142] dark:text-[#f8fafc]">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-[14px] text-[#7d8798] dark:text-[#94a3b8]">
                      {activity.detail}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#8a94a6] dark:text-[#94a3b8]">
                      <span>{formatTimestamp(activity.time)}</span>
                      <span>by {activity.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-[24px] border border-[#dfe4ef] bg-white p-6 shadow-[0_20px_48px_rgba(15,23,42,0.05)] dark:border-[#1e293b] dark:bg-[#111827]">
          <h2 className="text-[18px] font-bold text-[#202634] dark:text-[#f8fafc]">Quick Filters</h2>

          <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.11em] text-[#77839b] dark:text-[#cbd5e1]">
            By Category
          </p>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] font-semibold text-[#2b3442] dark:text-[#e2e8f0]">
            {categoryFilters.map((filter) => (
              <Link
                key={filter.label}
                href={filter.href}
                className="inline-flex items-center gap-3 transition hover:text-[#16a34a] dark:hover:text-[#4ade80]"
              >
                <span className="text-[#343d4b] dark:text-[#cbd5e1]">{filter.icon}</span>
                {filter.label}
              </Link>
            ))}
          </div>

          <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.11em] text-[#77839b] dark:text-[#cbd5e1]">
            By Priority
          </p>

          <div className="mt-5 flex items-center gap-10 text-[15px] font-semibold">
            {priorityFilters.map((filter) => (
              <Link
                key={filter.label}
                href={filter.href}
                className={`transition hover:opacity-80 ${filter.className}`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function TicketIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9V7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5V9" />
      <path d="M6 15v1.5A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M4 12h16" />
      <path d="M8.5 9v6" />
      <path d="M15.5 9v6" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
