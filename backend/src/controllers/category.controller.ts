// Category Controller - Manage complaint categories
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

// ============================================
// VALIDATION SCHEMA
// ============================================

// Define what data is required for creating/updating category
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  department: z.string().min(2, 'Department is required'),
});

// ============================================
// FEATURE 1: CREATE CATEGORY (Admin only)
// ============================================

export const createCategory = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate incoming data
    const validatedData = categorySchema.parse(req.body);

    // Step 2: Create category in database
    const category = await prisma.category.create({
      data: validatedData,
    });

    // Step 3: Send success response
    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error: any) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Failed to create category', 500);
  }
};


// ============================================
// FEATURE 2: GET ALL CATEGORIES
// ============================================

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Step 1: Fetch all categories from database
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }, // Sort alphabetically by name
    });

    // Step 2: Send success response
    return successResponse(res, categories, 'Categories retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get categories', 500);
  }
};


// ============================================
// FEATURE 3: GET SINGLE CATEGORY
// ============================================

export const getCategory = async (req: Request, res: Response) => {
  try {
    // Step 1: Get category ID from URL parameter
    const id = req.params.id as string;

    // Step 2: Find category in database
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tickets: true }, // Count how many tickets in this category
        },
      },
    });

    // Step 3: If not found, return error
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Step 4: Send success response
    return successResponse(res, category, 'Category retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get category', 500);
  }
};


// ============================================
// FEATURE 4: UPDATE CATEGORY (Admin only)
// ============================================

export const updateCategory = async (req: Request, res: Response) => {
  try {
    // Step 1: Get category ID from URL
    const id = req.params.id as string;

    // Step 2: Validate incoming data (partial = all fields optional)
    const validatedData = categorySchema.partial().parse(req.body);

    // Step 3: Update category in database
    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    // Step 4: Send success response
    return successResponse(res, category, 'Category updated successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(res, 'Validation failed', 400, error.errors);
    }
    return errorResponse(res, error.message || 'Failed to update category', 500);
  }
};


// ============================================
// FEATURE 5: DELETE CATEGORY (Admin only)
// ============================================

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    // Step 1: Get category ID from URL
    const id = req.params.id as string;

    // Step 2: Check if category has any tickets
    const ticketCount = await prisma.ticket.count({
      where: { categoryId: id },
    });

    // Step 3: If category has tickets, prevent deletion
    if (ticketCount > 0) {
      return errorResponse(
        res,
        `Cannot delete category. It has ${ticketCount} ticket(s) associated with it. Please reassign or delete those tickets first.`,
        400
      );
    }

    // Step 4: Delete category from database
    await prisma.category.delete({
      where: { id },
    });

    // Step 5: Send success response
    return successResponse(res, null, 'Category deleted successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to delete category', 500);
  }
};
