import server from "./client";
import Ticket from "@/lib/types/ticket";
import { TicketsListResponse, CreateTicketRequest, CreateTicketResponse, SingleTicketResponse, UpdateTicketResponse } from "@/lib/types/api";

export async function getTickets(query: string = ""): Promise<Ticket[]> {
  try {
    const url = query ? `/api/tickets?q=${encodeURIComponent(query)}` : '/api/tickets';
    const response = await fetch(url);
    const data: TicketsListResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch tickets');
    }
    
    // Transform TicketResponse to Ticket (they should be compatible now)
    return data.tickets.map(ticket => ({
      ...ticket,
      // Ensure dates are Date objects
      createdOn: new Date(ticket.createdOn),
      updatedAt: new Date(ticket.updatedAt)
    }));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

export async function getTicket(id: string): Promise<Ticket> {
  try {
    const response = await fetch(`/api/tickets/${id}`);
    const data: SingleTicketResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch ticket');
    }
    
    // Transform to Ticket with proper date objects
    return {
      ...data.ticket,
      createdOn: new Date(data.ticket.createdOn),
      updatedAt: new Date(data.ticket.updatedAt)
    };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
}

export async function createTicket(ticketData: CreateTicketRequest): Promise<Ticket> {
  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    
    const data: CreateTicketResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create ticket');
    }
    
    // Transform to Ticket with proper date objects
    return {
      ...data.ticket,
      createdOn: new Date(data.ticket.createdOn),
      updatedAt: new Date(data.ticket.updatedAt)
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data: UpdateTicketResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update ticket');
    }
    
    // Transform to Ticket with proper date objects
    return {
      ...data.ticket,
      createdOn: new Date(data.ticket.createdOn),
      updatedAt: new Date(data.ticket.updatedAt)
    };
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete ticket');
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}