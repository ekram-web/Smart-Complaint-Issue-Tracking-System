// Ticket Controller - Manage complaints/tickets
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';
import { generateTicketId } from '../utils/ticketId';

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Schema for creating a ticket
const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

// Schema for updating a ticket
const updateTicketSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assignedToId: z.string().optional(),
});

// ============================================
// FEATURE 1: CREATE TICKET (Students)
// ============================================

export const createTicket = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate incoming data
    const validatedData = createTicketSchema.parse(req.body);

    // Step 2: Generate unique ticket ID (ASTU-2024-001)
    const ticketId = await generateTicketId();

    // Step 3: Create ticket in database
    const ticket = await prisma.ticket.create({
      data: {
        ...validatedData,
        ticketId,
        authorId: req.user!.userId, // Get user ID from token
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
        category: true,
      },
    });

    // Step 4: Send success response
    return successResponse(res, ticket, 'Ticket created successfully', 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Failed to create ticket', 500);
  }
};


// ============================================
// FEATURE 2: GET ALL TICKETS (with filters)
// ============================================

export const getTickets = async (req: Request, res: Response) => {
  try {
    // Step 1: Get query parameters for filtering
    const { status, priority, categoryId } = req.query;
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    // Step 2: Build filter based on user role
    const where: any = {};

    // STUDENTS can only see their own tickets
    if (userRole === 'STUDENT') {
      where.authorId = userId;
    }

    // STAFF can see tickets assigned to them
    if (userRole === 'STAFF') {
      where.assignedToId = userId;
    }

    // ADMIN can see all tickets (no filter)

    // Step 3: Apply additional filters from query
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;

    // Step 4: Fetch tickets from database
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        category: true,
        _count: {
          select: { remarks: true, attachments: true },
        },
      },
      orderBy: { createdAt: 'desc' }, // Newest first
    });

    // Step 5: Send success response
    return successResponse(res, tickets, 'Tickets retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get tickets', 500);
  }
};


// ============================================
// FEATURE 3: GET SINGLE TICKET
// ============================================

export const getTicket = async (req: Request, res: Response) => {
  try {
    // Step 1: Get ticket ID from URL
    const { id } = req.params;
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    // Step 2: Find ticket in database
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, department: true },
        },
        category: true,
        attachments: true,
        remarks: {
          include: {
            author: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' }, // Oldest first (conversation order)
        },
      },
    });

    // Step 3: If not found, return error
    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    // Step 4: Check permissions
    if (userRole === 'STUDENT' && ticket.authorId !== userId) {
      return errorResponse(res, 'Forbidden: You can only view your own tickets', 403);
    }

    if (userRole === 'STAFF' && ticket.assignedToId !== userId) {
      return errorResponse(res, 'Forbidden: You can only view assigned tickets', 403);
    }

    // Step 5: Send success response
    return successResponse(res, ticket, 'Ticket retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get ticket', 500);
  }
};


// ============================================
// FEATURE 4: UPDATE TICKET (Staff/Admin)
// ============================================

export const updateTicket = async (req: Request, res: Response) => {
  try {
    // Step 1: Get ticket ID from URL
    const { id } = req.params;

    // Step 2: Validate incoming data
    const validatedData = updateTicketSchema.parse(req.body);

    // Step 3: If status changed to RESOLVED, set resolvedAt timestamp
    const updateData: any = { ...validatedData };
    if (validatedData.status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }

    // Step 4: Update ticket in database
    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        category: true,
      },
    });

    // Step 5: Send success response
    return successResponse(res, ticket, 'Ticket updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Failed to update ticket', 500);
  }
};


// ============================================
// FEATURE 5: ADD REMARK/COMMENT TO TICKET
// ============================================

export const addRemark = async (req: Request, res: Response) => {
  try {
    // Step 1: Get ticket ID from URL
    const { id } = req.params;
    const { content, isInternal } = req.body;

    // Step 2: Validate content
    if (!content || content.trim().length < 1) {
      return errorResponse(res, 'Remark content is required', 400);
    }

    // Step 3: Create remark in database
    const remark = await prisma.remark.create({
      data: {
        content,
        isInternal: isInternal || false, // Staff-only notes
        ticketId: id,
        authorId: req.user!.userId,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    // Step 4: Send success response
    return successResponse(res, remark, 'Remark added successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to add remark', 500);
  }
};
