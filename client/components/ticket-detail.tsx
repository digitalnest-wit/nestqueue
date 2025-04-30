"use client";

import Ticket from "@/lib/types/ticket";

export interface TicketDetailProps {
  ticket: Ticket;
  onDismiss: () => void;
}

export default function TicketDetail({ ticket, onDismiss }: TicketDetailProps) {
  const ticketCreatedAt = new Date(ticket.createdOn).toDateString();
  const ticketUpdatedAt = new Date(ticket.updatedAt).toDateString();

  return (
    <div>
      <p>Ticket ID: {ticket.id}</p>
      <p>Title: {ticket.title}</p>
      <p>Description: {ticket.description}</p>
      <p>Site: {ticket.site}</p>
      <p>Category: {ticket.category}</p>
      <p>AssignedTo: {ticket.assignedTo}</p>
      <p>CreatedBy: {ticket.createdBy}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Status: {ticket.status}</p>
      <p>CreatedAt: {ticketCreatedAt}</p>
      <p>UpdatedAt: {ticketUpdatedAt}</p>
      <button onClick={onDismiss}>Close</button>
    </div>
  );
}
