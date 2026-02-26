import axiosInstance from './axios'
import type { ApiResponse, Attachment } from '../types'

export const uploadsAPI = {
  // Upload file to ticket
  uploadToTicket: async (ticketId: string, file: File): Promise<ApiResponse<Attachment>> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post<ApiResponse<Attachment>>(
      `/uploads/ticket/${ticketId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  // Get attachment by ID
  getAttachment: async (id: string): Promise<ApiResponse<Attachment>> => {
    const response = await axiosInstance.get<ApiResponse<Attachment>>(`/uploads/${id}`)
    return response.data
  },
}
