import axiosInstance from './axios'
import type { Ticket, CreateTicketInput, UpdateTicketInput, CreateRemarkInput, ApiResponse } from '../types'

export const ticketsAPI = {
  // Get all tickets (filtered by role)
  getAll: async (filters?: any): Promise<ApiResponse<Ticket[]>> => {
    const response = await axiosInstance.get<ApiResponse<Ticket[]>>('/tickets', { params: filters })
    return response.data
  },

  // Get single ticket
  getById: async (id: string): Promise<ApiResponse<Ticket>> => {
    const response = await axiosInstance.get<ApiResponse<Ticket>>(`/tickets/${id}`)
    return response.data
  },

  // Create ticket
  create: async (data: CreateTicketInput): Promise<ApiResponse<Ticket>> => {
    const response = await axiosInstance.post<ApiResponse<Ticket>>('/tickets', data)
    return response.data
  },

  // Update ticket
  update: async (id: string, data: UpdateTicketInput): Promise<ApiResponse<Ticket>> => {
    const response = await axiosInstance.put<ApiResponse<Ticket>>(`/tickets/${id}`, data)
    return response.data
  },

  // Add remark/comment
  addRemark: async (id: string, data: CreateRemarkInput): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>(`/tickets/${id}/remarks`, data)
    return response.data
  },

  // Delete ticket (admin only)
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(`/tickets/${id}`)
    return response.data
  },
}
