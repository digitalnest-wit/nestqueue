export default interface Ticket {
  id: string;
  title: string;
  description: string;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
  status: Status;
  workflowStatus?: WorkflowStatus;
  deviceId?: string;
  location?: string;
  documentation?: TicketDocumentation;
  troubleshootingSteps?: string[];
  escalation?: TicketEscalation;
  activityLog?: TicketActivityLogEntry[];
  instructor?: TicketInstructorReview;
  createdOn: Date;
  updatedAt: Date;
}

export interface TicketDocumentation {
  reportedProblem: string;
  initialObservations: string;
  questionsAsked: string;
  rootCause: string;
  solutionApplied: string;
  verification: string;
  finalNotes: string;
}

export interface TicketEscalation {
  enabled: boolean;
  reason: string;
}

export interface TicketActivityLogEntry {
  id: string;
  label: string;
  timestamp: string;
}

export interface TicketInstructorReview {
  reviewed: boolean;
  completedSuccessfully: boolean;
  notes: string;
}

export const Sites = ["Salinas", "Watsonville", "HQ", "Gilroy", "Modesto", "Stockton"] as const;
export type Site = (typeof Sites)[number];

export const TicketLocations = [
  "Modesto",
  "Stockton",
  "Salinas",
  "Watsonville",
  "Gilroy",
] as const;
export type TicketLocation = (typeof TicketLocations)[number];

export const Categories = ["Software", "Hardware", "Network"] as const;
export type Category = (typeof Categories)[number];

export const Priorities = [5, 4, 3, 2, 1] as const;
export type Priority = (typeof Priorities)[number];

export const Statuses = ["Open", "Active", "Closed", "Rejected"] as const;
export type Status = (typeof Statuses)[number];

export const WorkflowStatuses = [
  "New",
  "In Progress",
  "Waiting on User",
  "Resolved",
  "Escalated",
  "Closed",
] as const;
export type WorkflowStatus = (typeof WorkflowStatuses)[number];
