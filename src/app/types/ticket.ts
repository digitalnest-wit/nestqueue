export default interface Ticket {
  id: string;
  title: string;
  description: string;
  reporter: string;
  date: Date;
  priority: Priority;
  status: Status;
}

const StatusTypes = {
  open: "Open",
  inProgress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
} as const;
export type Status = keyof typeof StatusTypes;

const PriorityLevels = {
  low: "Low",
  lowest: "Lowest",
  medium: "Medium",
  high: "High",
  highest: "Highest",
} as const;
export type Priority = keyof typeof PriorityLevels;
