import axiosInstance from './axios'
import type { ApiResponse, User } from '../types'

interface DashboardStats {
  overview: {
    totalTickets: number
    totalUsers: number
    totalCategories: number
    avgResolutionTimeHours: number
  }
  ticketsByStatus: Array<{ status: string; count: number }>
  ticketsByPriority: Array<{ priority: string; count: number }>
  ticketsByCategory: Array<{ category: string; count: number }>
  recentTickets: any[]
}

export const adminAPI = {
  // Get dashboard statistics
  getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard')
    return response.data
  },

  // Get all users
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/admin/users')
    return response.data
  },

  // Update user role
  updateUserRole: async (
    userId: string,
    data: { role: string; department?: string }
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/admin/users/${userId}/role`,
      data
    )
    return response.data
  },
}
