import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  Category,
  Priority,
  Site,
  Status,
  TicketActivityLogEntry,
  TicketDocumentation,
  TicketEscalation,
  TicketInstructorReview,
  WorkflowStatus,
} from '@/lib/types/ticket';

// Define the ticket interface for type safety
interface TicketDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  status: Status;
  workflowStatus: WorkflowStatus;
  site: Site;
  category: Category;
  assignedTo?: string;
  createdBy: string;
  priority: Priority;
  deviceId?: string;
  location?: string;
  documentation: TicketDocumentation;
  troubleshootingSteps: string[];
  escalation: TicketEscalation;
  activityLog: TicketActivityLogEntry[];
  instructor: TicketInstructorReview;
  createdOn: Date;
  updatedAt: Date;
}

function buildDefaultDocumentation(description = ''): TicketDocumentation {
  return {
    reportedProblem: description,
    initialObservations: '',
    questionsAsked: '',
    rootCause: '',
    solutionApplied: '',
    verification: '',
    finalNotes: '',
  };
}

function buildDefaultEscalation(): TicketEscalation {
  return {
    enabled: false,
    reason: '',
  };
}

function buildDefaultInstructor(): TicketInstructorReview {
  return {
    reviewed: false,
    completedSuccessfully: false,
    notes: '',
  };
}

function normalizeTicketDocument(ticket: Partial<TicketDocument> & { description: string }) {
  return {
    ...ticket,
    workflowStatus: ticket.workflowStatus || 'New',
    deviceId: ticket.deviceId || '',
    location: ticket.location || '',
    documentation: {
      ...buildDefaultDocumentation(ticket.description),
      ...(ticket.documentation || {}),
    },
    troubleshootingSteps: ticket.troubleshootingSteps || [],
    escalation: {
      ...buildDefaultEscalation(),
      ...(ticket.escalation || {}),
    },
    activityLog: ticket.activityLog || [],
    instructor: {
      ...buildDefaultInstructor(),
      ...(ticket.instructor || {}),
    },
  };
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
      ...normalizeTicketDocument(ticket),
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

    // Strip immutable identifier fields from updates.
    const immutableFields = [
      'id',
      '_id',
      'createdOn',
    ];

    immutableFields.forEach((field) => {
      delete updates[field];
    });

    if (typeof updates.description === 'string' && !updates.documentation) {
      updates.documentation = {
        ...buildDefaultDocumentation(updates.description),
      };
    }

    if (updates.documentation) {
      updates.documentation = {
        ...buildDefaultDocumentation(),
        ...updates.documentation,
      };
    }

    if (updates.escalation) {
      updates.escalation = {
        ...buildDefaultEscalation(),
        ...updates.escalation,
      };
    }

    if (updates.instructor) {
      updates.instructor = {
        ...buildDefaultInstructor(),
        ...updates.instructor,
      };
    }

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
      ...normalizeTicketDocument(result),
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
