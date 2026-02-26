// TypeScript Types for ASTU Smart Complaint System
// These match the backend Prisma schema

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  identification: string  // Student ID or Staff ID
  department?: string     // Optional, mainly for staff
  createdAt: string
  updatedAt: string
  
  // Relations count (populated by backend)
  _count?: {
    tickets?: number
  }
}

// ============================================
// TICKET TYPES
// ============================================

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Ticket {
  id: string
  ticketId: string        // ASTU-2026-001 format
  title: string
  description: string
  location?: string
  status: TicketStatus
  priority: TicketPriority
  categoryId: string
  authorId: string
  assignedToId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  
  // Relations (populated by backend)
  author?: User
  assignedTo?: User
  category?: Category
  attachments?: Attachment[]
  remarks?: Remark[]
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string
  name: string
  description: string
  department: string
  createdAt: string
  updatedAt: string
  
  // Relations
  _count?: {
    tickets: number
  }
}

// ============================================
// ATTACHMENT TYPES
// ============================================

export interface Attachment {
  id: string
  ticketId: string
  filename: string
  filepath: string
  mimetype: string
  size: number
  uploadedById: string
  createdAt: string
  
  // Relations
  uploadedBy?: User
}

// ============================================
// REMARK (COMMENT) TYPES
// ============================================

export interface Remark {
  id: string
  ticketId: string
  authorId: string
  content: string
  isInternal: boolean  // Staff-only notes
  createdAt: string
  
  // Relations
  author?: User
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  link?: string
  isRead: boolean
  createdAt: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

// Standard API response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

// Auth responses
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

// Dashboard statistics (Admin)
export interface DashboardStats {
  overview: {
    totalTickets: number
    totalUsers: number
    totalCategories: number
    avgResolutionTimeHours: number
  }
  ticketsByStatus: Array<{
    status: TicketStatus
    count: number
  }>
  ticketsByPriority: Array<{
    priority: TicketPriority
    count: number
  }>
  ticketsByCategory: Array<{
    categoryId: string
    categoryName: string
    count: number
  }>
  recentTickets: Ticket[]
}

// ============================================
// FORM INPUT TYPES
// ============================================

// Login form
export interface LoginInput {
  email: string
  password: string
}

// Register form
export interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
  identification: string
  department?: string
}

// Create ticket form
export interface CreateTicketInput {
  title: string
  description: string
  categoryId: string
  location?: string
  priority: TicketPriority
}

// Update ticket form (Staff/Admin)
export interface UpdateTicketInput {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  assignedToId?: string
  categoryId?: string
  location?: string
}

// Create category form (Admin)
export interface CreateCategoryInput {
  name: string
  description: string
  department: string
}

// Add remark/comment
export interface CreateRemarkInput {
  content: string
  isInternal: boolean
}

// Update user role (Admin)
export interface UpdateUserRoleInput {
  role: UserRole
  department?: string
}

// ============================================
// FILTER/QUERY TYPES
// ============================================

export interface TicketFilters {
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: string
  authorId?: string
  assignedToId?: string
}

// ============================================
// UI STATE TYPES
// ============================================

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface PaginationState {
  page: number
  limit: number
  total: number
}

// ============================================
// HELPER TYPES
// ============================================

// For dropdown options
export interface SelectOption {
  value: string
  label: string
}

// For status badges
export const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-emerald-100 text-emerald-800'
}

// For priority indicators
export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700'
}

// For role badges
export const ROLE_COLORS: Record<UserRole, string> = {
  STUDENT: 'bg-slate-100 text-slate-700',
  STAFF: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-purple-100 text-purple-700'
}
