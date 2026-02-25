// Axios Configuration
// This file sets up axios with base URL and interceptors

import axios from 'axios'

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
    
    // Log request for debugging (remove in production)
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    
    return config
  },
  (error) => {
    // Handle request error
    console.error('❌ Request Error:', error)
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
    // Log successful response (remove in production)
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    
    return response
  },
  (error) => {
    // Handle response errors
    console.error('❌ Response Error:', error.response?.data || error.message)
    
    // If 401 Unauthorized, token is invalid
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    // If 403 Forbidden, user doesn't have permission
    if (error.response?.status === 403) {
      console.error('🚫 Access Denied: You do not have permission')
    }
    
    // If 500 Server Error
    if (error.response?.status === 500) {
      console.error('🔥 Server Error: Something went wrong on the backend')
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
