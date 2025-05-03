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
import { FilterKey, OrderKey, useTickets } from "@/lib/hooks/use-tickets";

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [searchValue, setSearchValue] = useState(query);
  const [filter, setFilter] = useState<FilterKey>("Last Modified");
  const [order, setOrder] = useState<OrderKey>("Descending");
  const { tickets, error } = useTickets({ query: searchValue, filter, order });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { width: windowWidth } = useWindow();

  const didSelectFilter = filter !== "Last Modified";
  const didSelectOrder = order !== "Descending";

  const FilterControls = () => {
    return (
      <>
        <Dropdown
          opts={["Priority", "Category", "Title", "Assigned To", "Status", "Last Modified"]}
          onSelect={(_e, opt) => setFilter(opt as FilterKey)}
          value={filter ? [filter] : []}
        >
          <FilterIcon className={`p-1 ${didSelectFilter ? "py-1.5" : "py-2"} text-sm`} label={didSelectFilter ? filter : undefined} />
        </Dropdown>
        <Dropdown opts={["Ascending", "Descending"]} onSelect={(_e, opt) => setOrder(opt as OrderKey)} value={order ? [order] : []}>
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
          {/* Search and Filters */}
          <div className="flex w-full gap-2 items-center p-4">
            <SearchBar className="w-[100%] lg:w-[50%]" placeholder="Search tickets..." onSubmit={setSearchValue} />

            {/* Filter Controls for Desktop (controls hidden when ticket selected and screen size is small) */}
            <div className={`${selectedTicket && isMobile(windowWidth!) ? "" : "hidden"} lg:flex gap-2 items-center`}>
              <FilterControls />
            </div>
          </div>

          {/* Filter Controls for Mobile (controls hidden on larger screen sizes) */}
          <div className={`px-4 pb-4 flex lg:hidden gap-2 items-center`}>
            <FilterControls />
          </div>

          {/* Error Banner */}
          <div className="w-full">
            {error && (
              <div className="px-4 py-2 bg-red-400 flex gap-3 items-center text-white shadow-md transition-all duration-300 ease-in-out">
                <p>{error.message}</p>
              </div>
            )}
          </div>

          {/* Tickets Table */}
          <TicketsTable tickets={tickets} onClick={(ticket) => setSelectedTicket(ticket)} />
        </div>

        {/* Selected Ticket */}
        {selectedTicket && (
          <div className="block w-full h-full lg:w-1/3 md:w-1/2 border-l border-gray-200 overflow-y-auto bg-gray-50 shadow-md transition-all duration-300 ease-in-out">
            <TicketDetail ticket={selectedTicket} onDismiss={() => setSelectedTicket(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
