// File Upload Controller - Handle file attachments
import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

// ============================================
// FEATURE 1: UPLOAD ATTACHMENT TO TICKET
// ============================================

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    // Step 1: Get ticket ID from URL
    const ticketId = Array.isArray(req.params.ticketId) 
      ? req.params.ticketId[0] 
      : req.params.ticketId;
    
    // Step 2: Get uploaded file from request
    const file = req.file;

    // Step 3: Check if file was uploaded
    if (!file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    // Step 4: Verify ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', 404);
    }

    // Step 5: Check permissions (students can only upload to their own tickets)
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    if (userRole === 'STUDENT' && ticket.authorId !== userId) {
      return errorResponse(res, 'Forbidden: You can only upload to your own tickets', 403);
    }

    // Step 6: Save attachment info to database
    const attachment = await prisma.attachment.create({
      data: {
        ticketId,
        filename: file.originalname,      // Original filename
        filepath: Array.isArray(file.path) ? file.path[0] : file.path, // Ensure string
        mimetype: file.mimetype,          // File type
        size: file.size,                  // File size in bytes
      },
    });

    // Step 7: Send success response
    return successResponse(res, attachment, 'File uploaded successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to upload file', 500);
  }
};


// ============================================
// FEATURE 2: GET/DOWNLOAD ATTACHMENT
// ============================================

export const getAttachment = async (req: Request, res: Response) => {
  try {
    // Step 1: Get attachment ID from URL
    const id = Array.isArray(req.params.id) 
      ? req.params.id[0] 
      : req.params.id;

    // Step 2: Find attachment in database
    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: {
        ticket: true, // Include ticket info to check permissions
      },
    });

    // Step 3: If not found, return error
    if (!attachment) {
      return errorResponse(res, 'Attachment not found', 404);
    }

    // Step 4: Check permissions
    const userRole = req.user!.role;
    const userId = req.user!.userId;

    // Students can only view attachments from their own tickets
    if (userRole === 'STUDENT' && attachment.ticket.authorId !== userId) {
      return errorResponse(res, 'Forbidden', 403);
    }

    // Staff can only view attachments from assigned tickets
    if (userRole === 'STAFF' && attachment.ticket.assignedToId !== userId) {
      return errorResponse(res, 'Forbidden', 403);
    }

    // Step 5: Send file to user
    res.sendFile(attachment.filepath);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get attachment', 500);
  }
};
