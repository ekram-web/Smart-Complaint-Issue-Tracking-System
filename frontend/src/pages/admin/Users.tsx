// User Management Page
// Admin can view and manage all users

import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { adminAPI } from '../../api/admin'
import type { User } from '../../types'

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState('')
  const [newDepartment, setNewDepartment] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      }
    } catch (error) {
      // Failed to fetch users
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewRole(user.role)
    setNewDepartment(user.department || '')
  }

  const handleUpdateRole = async () => {
    if (!editingUser) return

    try {
      const response = await adminAPI.updateUserRole(editingUser.id, {
        role: newRole,
        department: newDepartment || undefined,
      })

      if (response.success) {
        setEditingUser(null)
        fetchUsers() // Refresh list
      }
    } catch (error) {
      // Failed to update user
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">User Management</h2>
        <p className="text-slate-500 mt-1">Manage user roles and permissions</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Identification
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="role" value={user.role}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.identification || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="secondary" onClick={() => handleEditUser(user)}>
                        Edit Role
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 m-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Edit User Role</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  User: {editingUser.name}
                </label>
                <p className="text-sm text-slate-500">{editingUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {(newRole === 'STAFF' || newRole === 'ADMIN') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g., IT Department"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpdateRole} className="flex-1">
                  Update Role
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditingUser(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  )
}
