// Main App Component
// Sets up routing and authentication

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { StudentDashboard } from './pages/student/Dashboard'
import { CreateTicket } from './pages/student/CreateTicket'
import { TicketsList } from './pages/student/TicketsList'
import { TicketDetail } from './pages/student/TicketDetail'
import { StaffDashboard } from './pages/staff/Dashboard'
import { AdminDashboard } from './pages/admin/Dashboard'
import { Users } from './pages/admin/Users'
import { Categories } from './pages/admin/Categories'
import { AllTickets } from './pages/admin/AllTickets'
import { Profile } from './pages/Profile'
import { AssignedTickets } from './pages/staff/AssignedTickets'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes - Student */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <TicketsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/create"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CreateTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'ADMIN']}>
                <TicketDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Profile - All authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'STAFF', 'ADMIN']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Staff */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/tickets"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <AssignedTickets />
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AllTickets />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-slate-900">404</h1>
                  <p className="mt-4 text-slate-600">Page not found</p>
                  <a href="/login" className="mt-4 inline-block text-primary hover:underline">
                    Go to Login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
