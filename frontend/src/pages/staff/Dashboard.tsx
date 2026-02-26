// Staff Dashboard
// View and manage assigned tickets

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ticketsAPI } from '../../api/tickets'
import type { Ticket } from '../../types'

export function StaffDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('all')

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await ticketsAPI.getAll()
      if (response.success && response.data) {
        setTickets(response.data)
      }
    } catch (error) {
      // Failed to fetch tickets
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const response = await ticketsAPI.update(ticketId, { status: newStatus as any })
      if (response.success) {
        fetchTickets() // Refresh list
      }
    } catch (error) {
      // Failed to update status
    }
  }

  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter)

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">
          Staff Dashboard
        </h2>
        <p className="text-slate-500 mt-1">
          Manage and respond to student complaints
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">all_inbox</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500 mt-1">Total Tickets</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined">fiber_new</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.open}</p>
          <p className="text-sm text-slate-500 mt-1">Open Tickets</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">sync</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.inProgress}</p>
          <p className="text-sm text-slate-500 mt-1">In Progress</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.resolved}</p>
          <p className="text-sm text-slate-500 mt-1">Resolved</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('OPEN')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'OPEN'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'IN_PROGRESS'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'RESOLVED'
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Tickets List */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No tickets found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-primary"
                      >
                        {ticket.title}
                      </Link>
                      <Badge variant="status" value={ticket.status}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="priority" value={ticket.priority}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{ticket.ticketId}</p>
                    <p className="text-sm text-slate-500 line-clamp-2">{ticket.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      {ticket.author?.name || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">category</span>
                      {ticket.category?.name || 'N/A'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {ticket.status === 'OPEN' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(ticket.id, 'IN_PROGRESS')}
                      >
                        Start Working
                      </Button>
                    )}
                    {ticket.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStatusUpdate(ticket.id, 'RESOLVED')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Link to={`/tickets/${ticket.id}`}>
                      <Button size="sm" variant="secondary">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  )
}
