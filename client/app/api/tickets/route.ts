import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  Category,
  Priority,
  Site,
  Status,
  Sites,
  Categories,
  Priorities,
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

function normalizeTicketDocument(ticket: Partial<TicketDocument> & { createdOn: Date; updatedAt: Date }) {
  return {
    ...ticket,
    workflowStatus: ticket.workflowStatus || 'New',
    deviceId: ticket.deviceId || '',
    location: ticket.location || '',
    documentation: {
      ...buildDefaultDocumentation(ticket.description || ''),
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

// GET /api/tickets - Retrieve all tickets
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection<TicketDocument>('tickets');

    // Get search query parameter if provided
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    let filter = {};
    
    // If search query is provided, search in title and description
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Fetch tickets from MongoDB
    const tickets = await collection
      .find(filter)
      .sort({ createdOn: -1 }) // Sort by creation date, newest first
      .toArray();

    // Transform _id to id for frontend compatibility
    const transformedTickets = tickets.map(ticket => ({
      ...normalizeTicketDocument(ticket),
      id: ticket._id?.toString(),
      _id: undefined
    }));

    return NextResponse.json({
      success: true,
      count: transformedTickets.length,
      tickets: transformedTickets
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tickets',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection<TicketDocument>('tickets');

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      site,
      category,
      assignedTo,
      createdBy,
      priority,
      workflowStatus,
      deviceId,
      location,
      documentation,
      troubleshootingSteps,
      escalation,
      activityLog,
      instructor,
    } = body;

    // Validate required fields
    if (!title || !description || !site || !category || !createdBy || priority === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Title, description, site, category, createdBy, and priority are required'
      }, { status: 400 });
    }

    // Validate enum values
    if (!Sites.includes(site)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid site',
        message: `Site must be one of: ${Sites.join(', ')}`
      }, { status: 400 });
    }

    if (!Categories.includes(category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category',
        message: `Category must be one of: ${Categories.join(', ')}`
      }, { status: 400 });
    }

    if (!Priorities.includes(priority)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid priority',
        message: `Priority must be one of: ${Priorities.join(', ')}`
      }, { status: 400 });
    }

    // Create new ticket document
    const newTicket: TicketDocument = {
      title: title.trim(),
      description: description.trim(),
      status: 'Open', // Default status (using proper enum value)
      workflowStatus: workflowStatus || 'New',
      site: site as Site,
      category: category as Category,
      assignedTo: assignedTo || undefined,
      createdBy: createdBy.trim(),
      priority: priority as Priority,
      deviceId: deviceId?.trim() || '',
      location: location?.trim() || '',
      documentation: {
        ...buildDefaultDocumentation(description.trim()),
        ...(documentation || {}),
      },
      troubleshootingSteps: Array.isArray(troubleshootingSteps) ? troubleshootingSteps : [],
      escalation: {
        ...buildDefaultEscalation(),
        ...(escalation || {}),
      },
      activityLog: Array.isArray(activityLog) ? activityLog : [],
      instructor: {
        ...buildDefaultInstructor(),
        ...(instructor || {}),
      },
      createdOn: new Date(),
      updatedAt: new Date()
    };

    // Insert the ticket into MongoDB
    const result = await collection.insertOne(newTicket);

    if (!result.insertedId) {
      throw new Error('Failed to insert ticket');
    }

    // Fetch the created ticket to return it
    const createdTicket = await collection.findOne({ _id: result.insertedId });

    if (!createdTicket) {
      throw new Error('Failed to fetch created ticket');
    }

    // Transform for frontend compatibility
    const responseTicket = {
      ...normalizeTicketDocument(createdTicket),
      id: createdTicket._id?.toString(),
      _id: undefined
    };

    return NextResponse.json({
      success: true,
      message: 'Ticket created successfully',
      ticket: responseTicket
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create ticket',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// OPTIONS method for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
