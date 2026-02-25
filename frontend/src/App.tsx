// Main App Component
// Sets up routing and authentication

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

function App() {
  return (
    <AuthProvider>
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
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold">Student Dashboard</h1>
                  <p className="mt-4">Coming soon!</p>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Staff */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold">Staff Dashboard</h1>
                  <p className="mt-4">Coming soon!</p>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Protected routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <div className="p-8 text-center">
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="mt-4">Coming soon!</p>
                </div>
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
  )
}

export default App
