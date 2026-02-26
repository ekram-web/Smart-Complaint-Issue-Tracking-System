// Authentication API
// Functions to handle login, register, and profile

import axiosInstance from './axios'
import type { 
  LoginInput, 
  RegisterInput, 
  LoginResponse, 
  RegisterResponse,
  ApiResponse,
  User 
} from '../types'

export const authAPI = {
  /**
   * Login user
   * POST /api/auth/login
   * 
   * @param credentials - Email and password
   * @returns Token and user data
   * 
   * Example:
   * const response = await authAPI.login({
   *   email: 'student@astu.edu.et',
   *   password: 'student123'
   * })
   * // Returns: { success: true, data: { token: "...", user: {...} } }
   */
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   * POST /api/auth/register
   * 
   * @param userData - User registration data
   * @returns Token and user data
   * 
   * Example:
   * const response = await authAPI.register({
   *   name: 'John Doe',
   *   email: 'john@astu.edu.et',
   *   password: 'password123',
   *   role: 'STUDENT',
   *   identification: 'ASTU/2024/001'
   * })
   */
  register: async (userData: RegisterInput): Promise<RegisterResponse> => {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', userData)
    return response.data
  },

  /**
   * Get current user profile
   * GET /api/auth/profile
   * Requires authentication token
   * 
   * @returns Current user data
   * 
   * Example:
   * const response = await authAPI.getProfile()
   * // Returns: { success: true, data: { id: "...", name: "...", ... } }
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/profile')
    return response.data
  },

  /**
   * Update user profile
   * PUT /api/auth/profile
   * Requires authentication token
   * 
   * @param data - Profile data to update (name, identification, department)
   * @returns Updated user data
   * 
   * Example:
   * const response = await authAPI.updateProfile({
   *   name: 'John Updated',
   *   identification: 'ASTU/2024/002'
   * })
   */
  updateProfile: async (data: { name?: string; identification?: string; department?: string }): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>('/auth/profile', data)
    return response.data
  },

  /**
   * Logout user (client-side only)
   * Clears token and user data from localStorage
   */
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}
