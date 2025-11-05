// Utility functions for testing the tickets API
import { CreateTicketRequest } from "@/lib/types/api";
import { Site, Category, Priority } from "@/lib/types/ticket";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function testGetTickets(query?: string) {
  try {
    const url = query 
      ? `${API_BASE_URL}/api/tickets?q=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/api/tickets`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('GET /api/tickets response:', data);
    return data;
  } catch (error) {
    console.error('Error testing GET tickets:', error);
    throw error;
  }
}

export async function testCreateTicket(ticketData: CreateTicketRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    
    const data = await response.json();
    
    console.log('POST /api/tickets response:', data);
    return data;
  } catch (error) {
    console.error('Error testing POST ticket:', error);
    throw error;
  }
}

// Example usage with proper types:
// testCreateTicket({
//   title: "Test Ticket",
//   description: "This is a test ticket created via API",
//   site: "HQ" as Site,
//   category: "Software" as Category,
//   createdBy: "test@example.com",
//   priority: 2 as Priority
// });
//
// testGetTickets();
// testGetTickets("test");
// testGetTicket("650a1b2c3d4e5f6789012345");
// testUpdateTicket("650a1b2c3d4e5f6789012345", { priority: 1 });
// testDeleteTicket("650a1b2c3d4e5f6789012345");

export async function testGetTicket(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`);
    const data = await response.json();
    
    console.log(`GET /api/tickets/${id} response:`, data);
    return data;
  } catch (error) {
    console.error('Error testing GET ticket:', error);
    throw error;
  }
}

export async function testUpdateTicket(id: string, updates: Partial<CreateTicketRequest>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    console.log(`PUT /api/tickets/${id} response:`, data);
    return data;
  } catch (error) {
    console.error('Error testing PUT ticket:', error);
    throw error;
  }
}

export async function testDeleteTicket(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    console.log(`DELETE /api/tickets/${id} response:`, data);
    return data;
  } catch (error) {
    console.error('Error testing DELETE ticket:', error);
    throw error;
  }
}