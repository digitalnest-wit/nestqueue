"use client";

import { useSearchParams } from "next/navigation";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import Ticket from "@/lib/types/ticket";
import server from "@/lib/server";
import { GetTicketsResponse } from "@/lib/types/responses/tickets";
import TicketDetail from "@/components/tickets/ticket-detail";
import TicketsTable from "@/components/tickets/tickets-table";
import { SearchBar } from "@/components/ui/search-bar";
import Dropdown from "@/components/ui/dropdown";
import { ArrowsUpDownIcon, FilterIcon, XIcon } from "@/components/ui/icons";
import useWindow, { isMobile } from "@/hooks/window";
import Button from "@/components/ui/button";

type TicketFilterKey = "Priority" | "Category" | "Title" | "Assigned To" | "Status" | "Last Modified";
type SortKey = "Ascending" | "Descending";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const { width: windowWidth } = useWindow();

  const [searchValue, setSearchValue] = useState(query);
  const [searchFilter, setSearchFilter] = useState<TicketFilterKey>("Last Modified");
  const [sortOrder, setSortOrder] = useState<SortKey>("Descending");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      const endpoint = `/tickets?q=${searchValue}`;
      const response: AxiosResponse<GetTicketsResponse> = await server.get(endpoint);

      const sortedTickets = sortTickets(response.data.tickets, mapTicketFilterToKey(searchFilter), sortOrder);
      setTickets(sortedTickets);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchValue, searchFilter, sortOrder]);

  // Initial fetch on page load
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Function to update a single ticket in the local state
  const updateTicketLocally = useCallback(
    (updatedTicket: Ticket) => {
      setTickets((prevTickets) => {
        const updated = prevTickets.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket));

        // Re-sort to maintain consistency
        return sortTickets(updated, mapTicketFilterToKey(searchFilter), sortOrder);
      });
    },
    [searchFilter, sortOrder]
  );

  const handleFilterSelect = (_event: MouseEvent<HTMLElement>, opt: string) => {
    // This handler should only be passed to the Dropdown component, so this
    // type cast should never fail.
    setSearchFilter(opt as TicketFilterKey);
  };

  // The available filter options
  const filterOpts: TicketFilterKey[] = ["Priority", "Category", "Title", "Assigned To", "Status", "Last Modified"];

  const handleOrderSelect = (_event: MouseEvent<HTMLElement>, opt: string) => {
    // This handler should only be passed to the Dropdown component, so this
    // type cast should never fail.
    setSortOrder(opt as SortKey);
  };

  // The available sort order options
  const sortOpts: SortKey[] = ["Ascending", "Descending"];

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseSelectedTicket = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="w-full">
      {/* Main Content Area */}
      <div className="flex w-full h-[100vh] overflow-hidden transition-all duration-300 ease-in-out">
        <div
          className={`transition-all duration-300 ease-in-out ${selectedTicket ? "md:w-1/2 lg:w-2/3" : "w-full"} overflow-auto ${
            selectedTicket && isMobile(windowWidth!) && "hidden"
          }`}
        >
          {/* Filters and Search */}
          <div className="flex gap-4 items-center p-4">
            <SearchBar
              className={`w-full ${selectedTicket ? "w-[100%]" : "sm:w-[35%]"}`}
              placeholder="Search tickets..."
              onSubmit={setSearchValue}
            />

            {/* Desktop Filter Controls */}
            <div className={`hidden ${selectedTicket ? "" : "md:flex"} gap-2 items-center`}>
              <Dropdown opts={filterOpts} onSelect={handleFilterSelect} value={searchFilter ? [searchFilter] : []}>
                <FilterIcon className="p-1" label={searchFilter} />
              </Dropdown>
              <Dropdown opts={sortOpts} onSelect={handleOrderSelect} value={sortOrder ? [sortOrder] : []}>
                <ArrowsUpDownIcon className="p-1" label={sortOrder} />
              </Dropdown>
            </div>
          </div>

          {/* Mobile Filter Controls */}
          <div className={`${selectedTicket ? "" : "sm:hidden"} flex gap-3 items-center px-4 pb-4`}>
            <Dropdown opts={filterOpts} onSelect={handleFilterSelect} value={searchFilter ? [searchFilter] : []}>
              <FilterIcon className="p-1" label={searchFilter} />
            </Dropdown>
            <Dropdown opts={sortOpts} onSelect={handleOrderSelect} value={sortOrder ? [sortOrder] : []}>
              <ArrowsUpDownIcon className="p-1" label={sortOrder} />
            </Dropdown>
          </div>

          {/* Status Banner */}
          <div className="w-full">
            {loading && tickets.length === 0 && (
              <div className="p-4 bg-blue-400 flex gap-3 items-center text-white shadow-md transition-all duration-300 ease-in-out">
                <p>Loading tickets...</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-400 flex gap-3 items-center text-white shadow-md transition-all duration-300 ease-in-out">
                <Button onClick={() => setError(null)}>
                  <XIcon />
                </Button>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Tickets Table */}
          <TicketsTable tickets={tickets} onClick={handleSelectTicket} />
        </div>

        {/* Selected Ticket */}
        {selectedTicket && (
          <div className="block w-full h-full lg:w-1/3 md:w-1/2 border-l border-gray-200 overflow-y-auto bg-gray-50 shadow-md transition-all duration-300 ease-in-out">
            <TicketDetail ticket={selectedTicket} onDismiss={handleCloseSelectedTicket} />
          </div>
        )}
      </div>
    </div>
  );
}

function mapTicketFilterToKey(key: TicketFilterKey) {
  switch (key) {
    case "Priority":
      return "priority";
    case "Category":
      return "category";
    case "Title":
      return "title";
    case "Assigned To":
      return "assignedTo";
    case "Status":
      return "status";
    case "Last Modified":
      return "updatedAt";
  }
}

function sortTickets(tickets: Ticket[], field: keyof Ticket, order: SortKey) {
  return [...tickets].sort((a, b) => {
    let comparison = 0;

    // Handle different field types
    if (typeof a[field] === "string" && typeof b[field] === "string") {
      comparison = (a[field] as string).localeCompare(b[field] as string);
    } else if (a[field] instanceof Date && b[field] instanceof Date) {
      comparison = (a[field] as Date).getTime() - (b[field] as Date).getTime();
    } else if (typeof a[field] === "boolean" && typeof b[field] === "boolean") {
      comparison = a[field] === b[field] ? 0 : a[field] ? 1 : -1;
    } else if (typeof a[field] === "number" && typeof b[field] === "number") {
      comparison = (a[field] as number) - (b[field] as number);
    } else {
      // Fallback for other types
      comparison = String(a[field]).localeCompare(String(b[field]));
    }

    return order === "Ascending" ? comparison : -comparison;
  });
}
