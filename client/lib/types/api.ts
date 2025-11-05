// API Response types for the ticketing system
import { Site, Category, Priority, Status } from "@/lib/types/ticket";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface TicketsListResponse extends ApiResponse {
  count: number;
  tickets: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: Status;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
  createdOn: Date;
  updatedAt: Date;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
}

export interface CreateTicketResponse extends ApiResponse {
  ticket: TicketResponse;
}

export interface SingleTicketResponse extends ApiResponse {
  ticket: TicketResponse;
}

export interface UpdateTicketResponse extends ApiResponse {
  ticket: TicketResponse;
}