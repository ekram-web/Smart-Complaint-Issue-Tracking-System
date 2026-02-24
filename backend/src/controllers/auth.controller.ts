// Authentication Controller - Register, Login, Profile
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { successResponse, errorResponse } from '../utils/response';

// ============================================
// FEATURE 1: REGISTER USER
// ============================================

// Validation schema - defines what data is required and format
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'STAFF', 'ADMIN']).optional(),
  identification: z.string().optional(), // Student ID or Staff ID
  department: z.string().optional(), // For staff members
});

export const register = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate incoming data
    const validatedData = registerSchema.parse(req.body);

    // Step 2: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }

    // Step 3: Hash the password (encrypt it)
    const hashedPassword = await hashPassword(validatedData.password);

    // Step 4: Create user in database
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: {
        // Don't return password in response
        id: true,
        name: true,
        email: true,
        role: true,
        identification: true,
        department: true,
        createdAt: true,
      },
    });

    // Step 5: Generate JWT token (login ticket)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Step 6: Send success response
    return successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Registration failed', 500);
  }
};

// ============================================
// FEATURE 2: LOGIN USER
// ============================================

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const login = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate incoming data
    const validatedData = loginSchema.parse(req.body);

    // Step 2: Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // If user doesn't exist, return error
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Step 3: Check if password is correct
    const isPasswordValid = await comparePassword(validatedData.password, user.password);

    // If password is wrong, return error
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Step 4: Generate JWT token (login ticket)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Step 5: Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Step 6: Send success response
    return successResponse(res, { user: userWithoutPassword, token }, 'Login successful');
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Login failed', 500);
  }
};

// ============================================
// FEATURE 3: GET USER PROFILE
// ============================================

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Step 1: Get user ID from token (req.user is set by authenticate middleware)
    const userId = req.user?.userId;

    // Step 2: Find user in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // Don't return password
        id: true,
        name: true,
        email: true,
        role: true,
        identification: true,
        department: true,
        createdAt: true,
      },
    });

    // If user not found, return error
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Step 3: Send user data
    return successResponse(res, user, 'Profile retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get profile', 500);
  }
};
