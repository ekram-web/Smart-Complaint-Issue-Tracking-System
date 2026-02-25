// Login Page Component
// Allows users to authenticate and access the system

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import type { LoginInput } from '../../types'

export function Login() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Form inputs - controlled components
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Navigation hook - for redirecting after login
  const navigate = useNavigate()
  
  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Prevent default form submission (page reload)
    e.preventDefault()
    
    // Clear any previous errors
    setError('')
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    // Email validation (basic)
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    
    // Start loading state
    setLoading(true)
    
    try {
      // Prepare login data
      const credentials: LoginInput = { email, password }
      
      // Call backend API
      const response = await authAPI.login(credentials)
      
      // Check if login was successful
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token)
        
        // Store user data (optional, for quick access)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // If "Remember Me" is checked, set longer expiry
        if (rememberMe) {
          // Token already has 7-day expiry from backend
          localStorage.setItem('rememberMe', 'true')
        }
        
        // Redirect based on user role
        const userRole = response.data.user.role
        
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard')
        } else if (userRole === 'STAFF') {
          navigate('/staff/dashboard')
        } else {
          navigate('/dashboard') // Student dashboard
        }
      } else {
        // Backend returned success: false
        setError(response.message || 'Login failed')
      }
    } catch (err: any) {
      // Handle errors
      console.error('Login error:', err)
      
      // Extract error message from response
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      // Stop loading state (runs whether success or error)
      setLoading(false)
    }
  }
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left Side: Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-4 lg:w-1/2 lg:px-20 xl:px-24 bg-white dark:bg-slate-900">
        <div className="mx-auto w-full max-w-md">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-2xl">campaign</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              ASTU Smart Complaint
            </h2>
          </div>
          
          {/* Welcome Message */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Please enter your university credentials to access your account.
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200"
              >
                University Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@astu.edu.et"
                  className="block w-full rounded-lg border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-0 py-2.5 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm sm:leading-6"
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-3 block text-sm leading-6 text-slate-700 dark:text-slate-300"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm leading-6">
                <a href="#" className="font-semibold text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          
          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold leading-6 text-primary hover:text-primary/80"
            >
              Register here
            </Link>
          </p>
          
          {/* Footer Links */}
          <div className="mt-6 flex justify-center gap-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              About System
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              Help Center
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      
      {/* Right Side: Hero Image */}
      <div className="hidden lg:relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-16 text-white z-10">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Empowering the <br />ASTU Community
          </h2>
          <p className="text-lg text-white/90 max-w-md">
            The Smart Complaint System provides a streamlined platform for students and staff to raise concerns and track resolutions in real-time.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=1200&fit=crop"
          alt="University campus"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
