// Global Error Handler - Catches all errors
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error in development only
  if (process.env.NODE_ENV === 'development') {
    // Error logged for debugging
  }

  // Prisma database errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry: Record already exists', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  // Validation errors (Zod)
  if (err.name === 'ZodError') {
    return errorResponse(res, 'Validation failed', 400, err.errors);
  }

  // Default error
  return errorResponse(res, err.message || 'Internal server error', err.statusCode || 500);
};
