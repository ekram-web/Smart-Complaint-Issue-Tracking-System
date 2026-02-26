// Notification Controller
import { Request, Response } from 'express';
import prisma from '../config/database';
import { successResponse, errorResponse } from '../utils/response';

// Get user's notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, // Last 20 notifications
    });

    return successResponse(res, notifications, 'Notifications retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get notifications', 500);
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return successResponse(res, { count }, 'Unread count retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to get unread count', 500);
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    if (notification.userId !== userId) {
      return errorResponse(res, 'Forbidden', 403);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return successResponse(res, updated, 'Notification marked as read');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to mark as read', 500);
  }
};

// Mark all as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return successResponse(res, null, 'All notifications marked as read');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to mark all as read', 500);
  }
};

// Helper function to create notification
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string
) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
  } catch (error) {
    // Failed to create notification
  }
};
