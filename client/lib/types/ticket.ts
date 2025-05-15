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
}

export type Site = "Salinas" | "Watsonville" | "HQ" | "Gilroy" | "Modesto" | "Stockton";
export const allSites: Site[] = ["Gilroy", "HQ", "Modesto", "Salinas", "Stockton", "Watsonville"];

export type Category = "Software" | "Hardware" | "Network";
export const allCategories: Category[] = ["Hardware", "Network", "Software"];

export type Priority = 5 | 4 | 3 | 2 | 1;
export const allPriorities: Priority[] = [5, 4, 3, 2, 1];

export type Status = "Open" | "Active" | "Closed" | "Rejected";
export const allStatuses: Status[] = ["Active", "Open", "Closed", "Rejected"];
