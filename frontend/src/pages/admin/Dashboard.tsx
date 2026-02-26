// Admin Dashboard
// Overview of system statistics and recent activity

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { adminAPI } from '../../api/admin'

interface DashboardStats {
  overview: {
    totalTickets: number
    totalUsers: number
    totalCategories: number
    avgResolutionTimeHours: number
    unassignedTickets: number
    resolutionRate: number
    recentTicketsCount: number
  }
  ticketsByStatus: Array<{ status: string; count: number }>
  ticketsByPriority: Array<{ priority: string; count: number }>
  ticketsByCategory: Array<{ category: string; count: number }>
  staffWorkload: Array<{ name: string; department: string; assignedTickets: number }>
  recentTickets: any[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard()
      if (response.success && response.data) {
        setStats(response.data as DashboardStats)
      }
    } catch (error) {
      // Failed to fetch dashboard
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading dashboard...</div>
        </div>
      </Layout>
    )
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-slate-600">Failed to load dashboard</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500 mt-1">System overview and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">confirmation_number</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.overview.totalTickets}</p>
          <p className="text-sm text-slate-500 mt-1">Total Tickets</p>
          <p className="text-xs text-emerald-600 mt-2">
            +{stats.overview.recentTicketsCount} in last 7 days
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.overview.resolutionRate}%</p>
          <p className="text-sm text-slate-500 mt-1">Resolution Rate</p>
          <p className="text-xs text-slate-600 mt-2">
            Tickets successfully resolved
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.overview.unassignedTickets}</p>
          <p className="text-sm text-slate-500 mt-1">Unassigned Tickets</p>
          <p className="text-xs text-amber-600 mt-2">
            Waiting for assignment
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">schedule</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {stats.overview.avgResolutionTimeHours.toFixed(1)}h
          </p>
          <p className="text-sm text-slate-500 mt-1">Avg Resolution Time</p>
          <p className="text-xs text-slate-600 mt-2">
            Time to resolve tickets
          </p>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.overview.totalUsers}</p>
          <p className="text-sm text-slate-500 mt-1">Total Users</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined">category</span>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.overview.totalCategories}</p>
          <p className="text-sm text-slate-500 mt-1">Categories</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {stats.ticketsByStatus.find(s => s.status === 'IN_PROGRESS')?.count || 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">Active Tickets</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tickets by Status */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Tickets by Status</h3>
          <div className="space-y-3">
            {stats.ticketsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="status" value={item.status as any}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-2xl font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tickets by Priority */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Tickets by Priority</h3>
          <div className="space-y-3">
            {stats.ticketsByPriority.map((item) => (
              <div key={item.priority} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="priority" value={item.priority as any}>
                    {item.priority}
                  </Badge>
                </div>
                <span className="text-2xl font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tickets by Category */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Tickets by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.ticketsByCategory.map((item) => (
            <div key={item.category} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">{item.category}</span>
              <span className="text-xl font-bold text-primary">{item.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Staff Workload */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Staff Workload Distribution</h3>
        <div className="space-y-3">
          {stats.staffWorkload.length > 0 ? (
            stats.staffWorkload.map((staff) => (
              <div key={staff.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{staff.name}</p>
                  <p className="text-sm text-slate-500 truncate">{staff.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{staff.assignedTickets}</p>
                    <p className="text-xs text-slate-500">assigned</p>
                  </div>
                  <div className="w-24 bg-slate-200 rounded-full h-2 flex-shrink-0">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min((staff.assignedTickets / stats.overview.totalTickets) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">No staff members with assigned tickets</p>
          )}
        </div>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Tickets</h3>
          <Link to="/admin/tickets" className="text-sm font-semibold text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ticket ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {ticket.ticketId}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{ticket.author.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant="status" value={ticket.status}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="priority" value={ticket.priority}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="p-1 text-slate-400 hover:text-primary transition-colors inline-block"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  )
}
