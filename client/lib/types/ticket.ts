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
  createdOn: Date;
  updatedAt: Date;
  deadline: Date;
}

export const Sites = ["Salinas", "Watsonville", "HQ", "Gilroy", "Modesto", "Stockton"] as const;
export type Site = (typeof Sites)[number];

export const Categories = ["Software", "Hardware", "Network"] as const;
export type Category = (typeof Categories)[number];

export const Priorities = [5, 4, 3, 2, 1] as const;
export type Priority = (typeof Priorities)[number];

export const Statuses = ["Open", "Active", "Closed", "Rejected"] as const;
export type Status = (typeof Statuses)[number];
