// Admin dashboard controller - analytics and stats
import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

// ============================================
// FEATURE 1: GET DASHBOARD STATISTICS
// ============================================

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Step 1: Get total counts
    const totalTickets = await prisma.ticket.count();
    const totalUsers = await prisma.user.count();
    const totalCategories = await prisma.category.count();

    // Step 2: Group tickets by status (how many OPEN, IN_PROGRESS, RESOLVED)
    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ['status'],
      _count: true,
    });

    // Step 3: Group tickets by priority
    const ticketsByPriority = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: true,
    });

    // Step 4: Group tickets by category
    const ticketsByCategory = await prisma.ticket.groupBy({
      by: ['categoryId'],
      _count: true,
    });

    // Get category names
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const categoryStats = ticketsByCategory.map((item) => ({
      category: categories.find((c) => c.id === item.categoryId)?.name || 'Unknown',
      count: item._count,
    }));

    // Recent tickets
    const recentTickets = await prisma.ticket.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true },
        },
      },
    });

    // Average resolution time (for resolved tickets)
    const resolvedTickets = await prisma.ticket.findMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    let avgResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalTime = resolvedTickets.reduce((sum, ticket) => {
        const diff = ticket.resolvedAt!.getTime() - ticket.createdAt.getTime();
        return sum + diff;
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60)); // in hours
    }

    const stats = {
      overview: {
        totalTickets,
        totalUsers,
        totalCategories,
        avgResolutionTimeHours: avgResolutionTime,
      },
      ticketsByStatus: ticketsByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
      ticketsByPriority: ticketsByPriority.map((item) => ({
        priority: item.priority,
        count: item._count,
      })),
      ticketsByCategory: categoryStats,
      recentTickets,
    };

    return successResponse(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get dashboard stats', 500);
  }
};

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        identification: true,
        department: true,
        createdAt: true,
        _count: {
          select: {
            authoredTickets: true,
            assignedTickets: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get users', 500);
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) 
      ? req.params.id[0] 
      : req.params.id;
    const { role, department } = req.body;

    if (!role || !['STUDENT', 'STAFF', 'ADMIN'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role, department },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
    });

    return successResponse(res, user, 'User role updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update user role', 500);
  }
};
