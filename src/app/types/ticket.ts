export default interface Ticket {
  id: string;
  title: string;
  description: string;
  site: SiteLocation;
  category: Category;
  reporter: string;
  reporterRole: ReporterOrganizationRole;
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

const ReporterOrganizationRoles = {
  external: "External",
  intern: "Intern",
  staff: "Staff",
  manager: "Manager",
} as const;
export type ReporterOrganizationRole = keyof typeof ReporterOrganizationRoles;

const SiteLocations = {
  salinas: "Salinas",
  watsonville: "Watsonville",
  hq: "HQ",
  gilroy: "Gilroy",
  modesto: "Modesto",
  stockton: "Stockton",
} as const;
export type SiteLocation = keyof typeof SiteLocations;

const CategoryTypes = {
  software: "Software",
  hardware: "Hardware",
  network: "Network",
} as const;
export type Category = keyof typeof CategoryTypes;
