import { getTickets } from "@/lib/api/tickets";
import { useQuery } from "@tanstack/react-query";

export const useTicketsQuery = () =>
  useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
  });
