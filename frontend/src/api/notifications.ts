// Notifications API
import api from './axios';

export const notificationsAPI = {
  // Get all notifications
  getAll: () => api.get('/notifications'),

  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // Mark as read
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
};
