# Ticketing System API

This serverless API provides endpoints for managing tickets in a MongoDB Atlas database.

## Setup Instructions

### 1. MongoDB Atlas Configuration

1. Create a MongoDB Atlas account and cluster
2. Create a database named `nq_tickets`
3. Create a collection named `tickets`
4. Get your connection string from MongoDB Atlas
5. Update the `MONGODB_URI` in your `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nq_tickets?retryWrites=true&w=majority
MONGODB_DB=nq_tickets
```

### 2. API Endpoints

#### GET /api/tickets
Retrieves all tickets from the database.

**Query Parameters:**
- `q` (optional): Search query for filtering tickets by title or description

**Response:**
```json
{
  "success": true,
  "count": 10,
  "tickets": [
    {
      "id": "650a1b2c3d4e5f6789012345",
      "title": "Fix login issue",
      "description": "Users unable to login with Google OAuth",
      "status": "open",
      "site": "HQ",
      "category": "Software",
      "priority": 2,
      "createdOn": "2023-09-20T10:30:00.000Z",
      "updatedAt": "2023-09-20T10:30:00.000Z"
    }
  ]
}
```

#### POST /api/tickets
Creates a new ticket.

**Request Body:**
```json
{
  "title": "Ticket title (required)",
  "description": "Ticket description (required)", 
  "site": "HQ (required - must be one of: Salinas, Watsonville, HQ, Gilroy, Modesto, Stockton)",
  "category": "Software (required - must be one of: Software, Hardware, Network)",
  "assignedTo": "user@example.com (optional)",
  "createdBy": "creator@example.com (required)",
  "priority": 3 (required - must be one of: 1, 2, 3, 4, 5)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": {
    "id": "650a1b2c3d4e5f6789012345",
    "title": "Ticket title",
    "description": "Ticket description",
    "status": "Open",
    "site": "HQ",
    "category": "Software", 
    "createdBy": "creator@example.com",
    "priority": 3,
    "createdOn": "2023-09-20T10:30:00.000Z",
    "updatedAt": "2023-09-20T10:30:00.000Z"
  }
}
```

### 3. Error Handling

All endpoints return proper HTTP status codes and error messages:

- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (missing required fields)
- `500`: Internal Server Error

Error response format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### 4. Testing

Use the test helper functions in `lib/api/test-helpers.ts`:

```typescript
import { testGetTickets, testCreateTicket } from '@/lib/api/test-helpers';

// Test creating a ticket with proper types
await testCreateTicket({
  title: "Test Ticket",
  description: "This is a test ticket",
  site: "HQ", // Must be valid Site
  category: "Software", // Must be valid Category  
  createdBy: "test@example.com",
  priority: 2 // Must be valid Priority (1-5)
});

// Test getting all tickets
await testGetTickets();

// Test searching tickets
await testGetTickets("login");
```

### 5. Integration

The API is already integrated with your existing ticket utilities in `lib/api/tickets.ts`. The `getTickets()` and `createTicket()` functions now use the local serverless API routes.

### 6. Development

To run the development server:

```bash
cd client
npm run dev
```

The API will be available at `http://localhost:8080/api/tickets`

### 7. Deployment

This API works seamlessly with Vercel, Netlify, or any platform that supports Next.js API routes. No additional configuration needed for serverless deployment.