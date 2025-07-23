import Ticket from "@/lib/types/ticket";
import Button from "../ui/button";
import PriorityDot from "./priority-dot";

interface TicketViewProps {
  ticket?: Ticket;
  onDismiss: () => void;
}

export default function TicketView({ ticket, onDismiss }: TicketViewProps) {
  if (!ticket) {
    return <div>No ticket data provided.</div>;
  }

  const createdOn = new Date(ticket.createdOn).toDateString();
  const updatedAt = new Date(ticket.updatedAt).toDateString();

  return (
    <div className="p-4 text-sm">
      <div className="flex gap-3 items-center">
        <PriorityDot priority={ticket.priority} />
        <div>
          <p className="text-lg font-bold">{ticket.title}</p>
          <p className="text-gray-400 text-xs">{ticket.id}</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-sm p-2 my-2 text-gray-600">
        {ticket.description}
      </div>

      <div className="">{ticket.category}</div>
      <div className="">{ticket.site}</div>

      {ticket.assignedTo ? (
        <p>Assigned to {ticket.assignedTo}</p>
      ) : (
        <p>Unassigned</p>
      )}

      <div className="text-gray-600 my-3">
        <div>
          Created by <span className="underline">{ticket.createdBy}</span> on{" "}
          {createdOn}
        </div>
        <div>Last modified on {updatedAt}</div>
      </div>

      <Button
        className="bg-black hover:bg-gray-700 text-white rounded"
        onClick={onDismiss}
      >
        Close
      </Button>
    </div>
  );
}
