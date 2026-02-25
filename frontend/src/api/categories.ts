import axiosInstance from './axios'
import type { Category, CreateCategoryInput, ApiResponse } from '../types'

export const categoriesAPI = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories')
    return response.data
  },

  // Get single category
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${id}`)
    return response.data
  },

  // Create category (admin only)
  create: async (data: CreateCategoryInput): Promise<ApiResponse<Category>> => {
    const response = await axiosInstance.post<ApiResponse<Category>>('/categories', data)
    return response.data
  },

  // Update category (admin only)
  update: async (id: string, data: Partial<CreateCategoryInput>): Promise<ApiResponse<Category>> => {
    const response = await axiosInstance.put<ApiResponse<Category>>(`/categories/${id}`, data)
    return response.data
  },

  // Delete category (admin only)
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete<ApiResponse>(`/categories/${id}`)
    return response.data
  },
}
