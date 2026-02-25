// Register Page Component
// Allows new users to create an account

import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import type { RegisterInput, UserRole } from '../../types'

export function Register() {
  // Form state
  const [formData, setFormData] = useState<RegisterInput>({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    identification: '',
    department: ''
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.identification) {
      setError('Please fill in all required fields')
      return
    }
    
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (!formData.email.includes('@astu.edu.et')) {
      setError('Please use your ASTU email address (@astu.edu.et)')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await authAPI.register(formData)
      
      if (response.success) {
        // Store token and user
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirect to dashboard
        navigate('/dashboard')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left Side: Register Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-6 lg:w-1/2 lg:px-20 xl:px-24 bg-white dark:bg-slate-900 overflow-y-auto">
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
              Create Account
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Join the ASTU Smart Complaint System
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@astu.edu.et"
                className="mt-2 block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
              />
            </div>
            
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>
            
            {/* Identification */}
            <div>
              <label htmlFor="identification" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                {formData.role === 'STUDENT' ? 'Student ID' : 'Staff ID'}
              </label>
              <input
                id="identification"
                name="identification"
                type="text"
                required
                value={formData.identification}
                onChange={handleChange}
                placeholder={formData.role === 'STUDENT' ? 'ASTU/2024/001' : 'STAFF-001'}
                className="mt-2 block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
              />
            </div>
            
            {/* Department (for staff) */}
            {formData.role === 'STAFF' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="IT Department"
                  className="mt-2 block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
                />
              </div>
            )}
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-0 py-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
                />
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
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white dark:ring-slate-700 sm:text-sm"
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Side: Hero Image */}
      <div className="hidden lg:relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-16 text-white z-10">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join the <br />ASTU Community
          </h2>
          <p className="text-lg text-white/90 max-w-md">
            Register now to submit complaints, track their progress, and help improve our university.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=1200&fit=crop"
          alt="Students on campus"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
