import { createTicket, getTicket, getTickets, updateTicket } from "@/lib/api/tickets";
import Ticket from "@/lib/types/ticket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type FilterKey = "Priority" | "Category" | "Title" | "Assigned To" | "Status" | "Last Modified";
export type OrderKey = "Ascending" | "Descending";

interface UseTicketsProps {
  query?: string;
  filter?: FilterKey;
  order?: OrderKey;
}

export const useTickets = ({ query, filter = "Last Modified", order = "Descending" }: UseTicketsProps) =>
  useQuery({
    queryKey: ["tickets", query, filter, order],
    queryFn: () => getTickets(query),
    select: (data) => sortTickets(data, ticketKeys[filter], order),
  });

export const useTicket = (id: string) =>
  useQuery({
    queryKey: ["tickets", id],
    queryFn: () => getTicket(id),
  });

export const useCreateTicket = () => {
  const client = useQueryClient();

  return useMutation<Ticket, Error, Partial<Ticket>>({
    mutationFn: (ticket) => createTicket(ticket),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  const client = useQueryClient();

  return useMutation<Ticket, Error, { id: string; updates: Partial<Ticket> }>({
    mutationFn: ({ id, updates }) => updateTicket(id, updates),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

const ticketKeys: Record<FilterKey, keyof Ticket> = {
  "Assigned To": "assignedTo",
  Category: "category",
  "Last Modified": "updatedAt",
  Priority: "priority",
  Status: "status",
  Title: "title",
};

const sortTickets = (tickets: Ticket[], field: keyof Ticket, order: OrderKey) => {
  return [...tickets].sort((a, b) => {
    let comparison = 0;

    if (typeof a[field] === "string" && typeof b[field] === "string") {
      comparison = (a[field] as string).localeCompare(b[field] as string);
    } else if (a[field] instanceof Date && b[field] instanceof Date) {
      comparison = (a[field] as Date).getTime() - (b[field] as Date).getTime();
    } else if (typeof a[field] === "boolean" && typeof b[field] === "boolean") {
      comparison = a[field] === b[field] ? 0 : a[field] ? 1 : -1;
    } else if (typeof a[field] === "number" && typeof b[field] === "number") {
      comparison = (a[field] as number) - (b[field] as number);
    } else {
      comparison = String(a[field]).localeCompare(String(b[field]));
    }

    return order === "Ascending" ? comparison : -comparison;
  });
};
