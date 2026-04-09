import { createTicket, getTicket, getTickets, updateTicket, deleteTicket } from "@/lib/api/tickets";
import Ticket from "@/lib/types/ticket";
import { CreateTicketRequest } from "@/lib/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type FilterKey = "Priority" | "Category" | "Title" | "Assigned To" | "Status" | "Last Modified";
export type OrderKey = "Ascending" | "Descending";

interface UseTicketsProps {
  query?: string;
  filter?: FilterKey;
  order?: OrderKey;
}

interface UseTicketProps {
  enabled?: boolean;
}

export const useTickets = ({ query, filter = "Last Modified", order = "Descending" }: UseTicketsProps) =>
  useQuery({
    queryKey: ["tickets", query, filter, order],
    retry: 0,
    queryFn: () => getTickets(query),
    select: (data) => sortTickets(data, ticketKeys[filter], order),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useTicket = (id: string, { enabled = true }: UseTicketProps = {}) =>
  useQuery({
    queryKey: ["tickets", id],
    queryFn: () => getTicket(id),
    enabled,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useCreateTicket = () => {
  const client = useQueryClient();

  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (ticket) => createTicket(ticket),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicket = () => {
  const client = useQueryClient();

  return useMutation<Ticket, Error, { id: string; updates: Partial<Ticket> }>({
    mutationFn: ({ id, updates }) => updateTicket(id, updates),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useDeleteTicket = () => {
  const client = useQueryClient();
  type DeleteMutationContext = {
    previousEntries: [readonly unknown[], Ticket[] | undefined][];
  };

  return useMutation<void, Error, string, DeleteMutationContext>({
    mutationFn: (id) => deleteTicket(id),
    onMutate: async (id) => {
      await client.cancelQueries({
        predicate: (query) => query.queryKey[0] === "tickets",
      });

      const previousEntries = client.getQueriesData<Ticket[]>({
        predicate: (query) =>
          query.queryKey[0] === "tickets" &&
          Array.isArray(query.state.data),
      });

      previousEntries.forEach(([queryKey, data]) => {
        if (!data) {
          return;
        }

        client.setQueryData<Ticket[]>(
          queryKey,
          data.filter((ticket) => ticket.id !== id),
        );
      });

      client.removeQueries({ queryKey: ["tickets", id], exact: true });

      return { previousEntries };
    },
    onError: (_error, _id, context) => {
      context?.previousEntries?.forEach(([queryKey, data]) => {
        client.setQueryData(queryKey, data);
      });
    },
    onSuccess: (_data, id) => {
      client.removeQueries({ queryKey: ["tickets", id], exact: true });
      client.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "tickets" && query.queryKey.length > 2,
      });
    },
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
