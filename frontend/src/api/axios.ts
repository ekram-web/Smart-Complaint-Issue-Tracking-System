// Axios Configuration
// This file sets up axios with base URL and interceptors

import axios from 'axios'
import toast from 'react-hot-toast'

// Base URL for all API requests
// In production, this would be your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// ============================================
// REQUEST INTERCEPTOR
// ============================================
// Runs BEFORE every request
// Used to add auth token to headers

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
// Runs AFTER every response
// Used to handle errors globally

axiosInstance.interceptors.response.use(
  (response) => {
    // Success - no logging needed, let components handle it
    return response
  },
  (error) => {
    // Only handle critical errors automatically
    // If 401 Unauthorized, token is invalid
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.')
      
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      }
    }
    // Network error
    else if (error.code === 'ERR_NETWORK') {
      toast.error('Cannot connect to server. Please check your connection.')
    }
    
    // Let components handle other errors
    return Promise.reject(error)
  }
)

export default axiosInstance
