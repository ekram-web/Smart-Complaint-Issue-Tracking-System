// Main App Component
// Sets up routing for the entire application

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Temporary dashboard route - we'll build this next */}
        <Route path="/dashboard" element={<div className="p-8 text-center">
          <h1 className="text-3xl font-bold">Dashboard Coming Soon!</h1>
          <p className="mt-4">You're logged in successfully.</p>
          <button 
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-900">404</h1>
            <p className="mt-4 text-slate-600">Page not found</p>
            <a href="/login" className="mt-4 inline-block text-primary hover:underline">
              Go to Login
            </a>
          </div>
        </div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
