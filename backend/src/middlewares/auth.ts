// Authentication Middleware - Check if user is logged in
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';

// ============================================
// MIDDLEWARE: Check if user is logged in
// ============================================

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Step 1: Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    // Step 2: Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Step 3: Verify token and get user info
    const decoded = verifyToken(token);

    // Step 4: Attach user info to request
    req.user = decoded;

    // Step 5: Allow request to continue
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

// ============================================
// MIDDLEWARE: Check if user has required role
// ============================================

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists (should be set by authenticate middleware)
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: Insufficient permissions', 403);
    }

    // Allow request to continue
    next();
  };
};
