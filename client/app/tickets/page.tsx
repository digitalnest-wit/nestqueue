"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import Ticket from "@/lib/types/ticket";
import TicketDetail from "@/components/tickets/ticket-detail";
import TicketsTable from "@/components/tickets/tickets-table";
import { SearchBar } from "@/components/ui/search-bar";
import Dropdown from "@/components/ui/dropdown";
import useWindow, { isMobile } from "@/lib/hooks/use-window";
import { FilterKey, OrderKey, useTickets } from "@/lib/hooks/queries/use-tickets";
import TicketCreateModal from "@/components/tickets/ticket-create-modal";
import { isAxiosError } from "axios";
import LabeledIcon from "@/components/ui/labeled-icon";
import { ArrowDownNarrowWide, ArrowDownWideNarrow, Funnel } from "lucide-react";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);

  const [filter, setFilter] = useState<FilterKey>("Last Modified");
  const [order, setOrder] = useState<OrderKey>("Descending");
  const { data: tickets, error: ticketsError, refetch: refetchTickets } = useTickets({ query: searchValue, filter, order });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { width: windowWidth } = useWindow();

  const didSelectFilter = filter !== "Last Modified";
  const didSelectOrder = order !== "Descending";

  const FilterControls = () => {
    return (
      <>
        <Dropdown
          className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          opts={["Priority", "Category", "Title", "Assigned To", "Status", "Last Modified"]}
          onSelect={(_, opt) => setFilter(opt as FilterKey)}
          value={filter}
        >
          {didSelectFilter ? (
            <LabeledIcon className="p-1 py-1 text-sm" icon={<Funnel fill="currentColor" className="w-4" />} label={filter} />
          ) : (
            <Funnel className="w-4 m-1 inline-block" />
          )}
        </Dropdown>
        <Dropdown
          className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          opts={["Ascending", "Descending"]}
          onSelect={(_, opt) => setOrder(opt as OrderKey)}
          value={order}
        >
          {didSelectOrder ? (
            <LabeledIcon className="p-1 py-1 text-sm" icon={<ArrowDownNarrowWide className="w-4" />} label={order} />
          ) : (
            <ArrowDownWideNarrow className="w-4 m-1 inline-block" />
          )}
        </Dropdown>
      </>
    );
  };

  const ErrorMessage = () => {
    if (ticketsError) {
      if (isAxiosError(ticketsError) && ticketsError.status === 404) {
        return (
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 flex gap-3 items-center text-black shadow-md transition-all duration-300 ease-in-out">
            <p>No tickets were found for query '{searchValue}'. Please try another.</p>
          </div>
        );
      }

      return (
        <div className="px-4 py-2 bg-red-500 flex gap-3 items-center text-white shadow-md transition-all duration-300 ease-in-out">
          <p>{ticketsError.message}</p>
        </div>
      );
    }

    return <></>;
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
          {/* Top Controls Row */}
          <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center p-4 w-full">
            {/* Search Bar */}
            <div className="flex-grow min-w-[200px]">
              <SearchBar className="w-full" placeholder="Search tickets..." onSubmit={setSearchValue} />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2 items-center">
              <FilterControls />
            </div>

            {/* Create Ticket Button */}
            <div className="ml-auto">
              <TicketCreateModal />
            </div>
          </div>

          {/* Error Banner */}
          <ErrorMessage />

          {/* Tickets Table */}
          {tickets && <TicketsTable tickets={tickets} onClick={(ticket) => setSelectedTicket(ticket)} />}
        </div>

        {/* Selected Ticket */}
        {selectedTicket && (
          <div className="block w-full h-full lg:w-1/3 md:w-1/2 border-l border-gray-200 dark:border-gray-900 overflow-y-auto bg-gray-50 dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out">
            <TicketDetail ticketId={selectedTicket.id} onDismiss={() => setSelectedTicket(null)} onUpdate={refetchTickets} />
          </div>
        )}
      </div>
    </div>
  );
}
