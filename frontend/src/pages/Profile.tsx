// User Profile Page
// View and edit user profile information

import { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/auth'

export function Profile() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    identification: user?.identification || '',
    department: user?.department || '',
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await authAPI.updateProfile({
        name: formData.name,
        identification: formData.identification,
        department: formData.department,
      })

      if (response.success && response.data) {
        // Update user in context
        setUser(response.data)
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data))
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">My Profile</h2>
          <p className="text-slate-500 mt-1">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{user.email}</p>
              <div className="mt-4">
                <Badge variant="role" value={user.role}>{user.role}</Badge>
              </div>
              {user.department && (
                <p className="text-sm text-slate-600 mt-4">
                  <span className="material-symbols-outlined text-[16px] align-middle mr-1">
                    business
                  </span>
                  {user.department}
                </p>
              )}
            </div>
          </Card>

          {/* Information Card */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Account Information</h3>
              {!isEditing ? (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <span className="material-symbols-outlined text-[18px] mr-1">edit</span>
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => {
                      setIsEditing(false)
                      setError('')
                      setSuccess('')
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        identification: user?.identification || '',
                        department: user?.department || '',
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-slate-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <p className="text-slate-900">{user.email}</p>
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <Badge variant="role" value={user.role}>{user.role}</Badge>
              </div>

              {user.identification && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Identification
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.identification}
                      onChange={(e) =>
                        setFormData({ ...formData, identification: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-slate-900">{user.identification}</p>
                  )}
                </div>
              )}

              {(user.role === 'STAFF' || user.role === 'ADMIN') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-slate-900">{user.department || 'Not set'}</p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Created
                </label>
                <p className="text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics Card (for students) */}
        {user.role === 'STUDENT' && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">My Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-3xl font-bold text-primary">
                  {user._count?.tickets || 0}
                </p>
                <p className="text-sm text-slate-600 mt-1">Total Tickets</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-3xl font-bold text-amber-600">0</p>
                <p className="text-sm text-slate-600 mt-1">Open</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-slate-600 mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-3xl font-bold text-emerald-600">0</p>
                <p className="text-sm text-slate-600 mt-1">Resolved</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}
