"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import Ticket from "@/lib/types/ticket";
import TicketDetail from "@/components/tickets/ticket-detail";
import TicketsTable from "@/components/tickets/tickets-table";
import { SearchBar } from "@/components/ui/search-bar";
import Dropdown from "@/components/ui/dropdown";
import { ArrowsUpDownIcon, FilterIcon } from "@/components/ui/icons";
import useWindow, { isMobile } from "@/lib/hooks/use-window";
import { FilterKey, OrderKey, useTickets } from "@/lib/hooks/queries/use-tickets";
import Button from "@/components/ui/button";
import TicketCreateModal from "@/components/tickets/ticket-create-modal";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);

  const [filter, setFilter] = useState<FilterKey>("Last Modified");
  const [order, setOrder] = useState<OrderKey>("Descending");
  const { data: tickets, error: ticketsError, refetch: refetchTickets } = useTickets({ query: searchValue, filter, order });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const { width: windowWidth } = useWindow();

  const didSelectFilter = filter !== "Last Modified";
  const didSelectOrder = order !== "Descending";

  const FilterControls = () => {
    return (
      <>
        <Dropdown
          className="border border-gray-200 hover:bg-gray-100"
          opts={["Priority", "Category", "Title", "Assigned To", "Status", "Last Modified"]}
          onSelect={(_e, opt) => setFilter(opt as FilterKey)}
          value={filter}
        >
          <FilterIcon className={`p-1 ${didSelectFilter ? "py-1.5" : "py-2"} text-sm`} label={didSelectFilter ? filter : undefined} />
        </Dropdown>
        <Dropdown
          className="border border-gray-200 hover:bg-gray-100"
          opts={["Ascending", "Descending"]}
          onSelect={(_e, opt) => setOrder(opt as OrderKey)}
          value={order}
        >
          <ArrowsUpDownIcon
            className={`p-1 ${didSelectOrder ? "py-1.5" : "py-2"} text-sm`}
            label={didSelectOrder ? order : undefined}
          />
        </Dropdown>
      </>
    );
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
          {ticketsError && (
            <div className="px-4 py-2 bg-red-400 flex gap-3 items-center text-white shadow-md transition-all duration-300 ease-in-out">
              <p>{ticketsError.message}</p>
            </div>
          )}

          {/* Tickets Table */}
          {tickets && <TicketsTable tickets={tickets} onClick={(ticket) => setSelectedTicket(ticket)} />}
        </div>

        {/* Selected Ticket */}
        {selectedTicket && (
          <div className="block w-full h-full lg:w-1/3 md:w-1/2 border-l border-gray-200 overflow-y-auto bg-gray-50 shadow-md transition-all duration-300 ease-in-out">
            <TicketDetail ticketId={selectedTicket.id} onDismiss={() => setSelectedTicket(null)} onUpdate={refetchTickets} />
          </div>
        )}
      </div>
    </div>
  );
}
