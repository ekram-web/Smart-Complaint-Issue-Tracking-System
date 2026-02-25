// Protected Route Component
// Redirects to login if user is not authenticated
// Optionally checks user role

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have permission - redirect to their dashboard
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'STAFF') {
      return <Navigate to="/staff/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>
}
