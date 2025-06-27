/**
 * Ticket represents a NestQueue IT ticket.
 */
export interface Ticket {
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

/**
 * sites is a read-only array containing each of the different Digtal NEST centers.
 */
export const sites = [
  "Salinas",
  "Watsonville",
  "HQ",
  "Gilroy",
  "Modesto",
  "Stockton",
] as const;

/**
 * Site is a type union constructed from `sites`.
 */
export type Site = (typeof sites)[number];

/**
 * categories is a read-only array containing different ticket categories.
 */
export const categories = ["Software", "Hardware", "Network"] as const;

/**
 * Category is a type union constructed from `categories`.
 */
export type Category = (typeof categories)[number];

/**
 * priorities is a read-only array containing different ticket priority levels.
 * A lower number indicates a higher priority, with `1` being the highest
 * priority and `5` being the lowest.
 */
export const priorities = [5, 4, 3, 2, 1] as const;

/**
 * Priority is a type union contructed from `priorities`.
 */
export type Priority = (typeof priorities)[number];

/**
 * statuses is a read-only array containing each of the different statuses a
 * ticket may be in.
 */
export const statuses = ["Open", "Active", "Closed", "Rejected"] as const;

/**
 * Status is a type union constructed from `statuses`.
 */
export type Status = (typeof statuses)[number];

export default Ticket;
