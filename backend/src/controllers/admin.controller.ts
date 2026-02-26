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

    // Count unassigned tickets
    const unassignedTickets = await prisma.ticket.count({
      where: { assignedToId: null },
    });

    // Step 2: Group tickets by status
    const ticketsByStatus = await prisma.ticket.groupBy({
      by: ['status'],
      _count: true,
    });

    // Calculate resolution rate
    const resolvedCount = ticketsByStatus.find((s) => s.status === 'RESOLVED')?._count || 0;
    const resolutionRate = totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 0;

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

    // Staff workload - tickets assigned to each staff member
    const staffWorkload = await prisma.user.findMany({
      where: {
        role: { in: ['STAFF', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        department: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        assignedTickets: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    // Tickets created in last 7 days (for trend)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTicketsCount = await prisma.ticket.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const stats = {
      overview: {
        totalTickets,
        totalUsers,
        totalCategories,
        avgResolutionTimeHours: avgResolutionTime,
        unassignedTickets,
        resolutionRate,
        recentTicketsCount, // Last 7 days
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
      staffWorkload: staffWorkload.map((staff) => ({
        name: staff.name,
        department: staff.department || 'N/A',
        assignedTickets: staff._count.assignedTickets,
      })),
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
