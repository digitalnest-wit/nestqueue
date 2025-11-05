import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Site, Category, Priority, Status } from '@/lib/types/ticket';

// Define the ticket interface for type safety
interface TicketDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  status: Status;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
  createdOn: Date;
  updatedAt: Date;
}

// GET /api/tickets/[id] - Retrieve a specific ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ticket ID',
        message: 'The provided ticket ID is not valid'
      }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<TicketDocument>('tickets');

    // Find the ticket by ID
    const ticket = await collection.findOne({ _id: new ObjectId(id) });

    if (!ticket) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found',
        message: `No ticket found with ID: ${id}`
      }, { status: 404 });
    }

    // Transform _id to id for frontend compatibility
    const transformedTicket = {
      ...ticket,
      id: ticket._id?.toString(),
      _id: undefined
    };

    return NextResponse.json({
      success: true,
      ticket: transformedTicket
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch ticket',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/tickets/[id] - Update a specific ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ticket ID',
        message: 'The provided ticket ID is not valid'
      }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<TicketDocument>('tickets');

    // Parse request body
    const updates = await request.json();

    // Remove id and _id from updates if present
    delete updates.id;
    delete updates._id;

    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    // Update the ticket
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found',
        message: `No ticket found with ID: ${id}`
      }, { status: 404 });
    }

    // Transform for frontend compatibility
    const transformedTicket = {
      ...result,
      id: result._id?.toString(),
      _id: undefined
    };

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: transformedTicket
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update ticket',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/tickets/[id] - Delete a specific ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ticket ID',
        message: 'The provided ticket ID is not valid'
      }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<TicketDocument>('tickets');

    // Delete the ticket
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Ticket not found',
        message: `No ticket found with ID: ${id}`
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete ticket',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}