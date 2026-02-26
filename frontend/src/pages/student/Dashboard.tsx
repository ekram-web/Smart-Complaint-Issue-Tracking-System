import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { StatsCardSkeleton, TableSkeleton } from '../../components/ui/Skeleton'
import { SearchBar } from '../../components/ui/SearchBar'
import { BackToTop } from '../../components/ui/BackToTop'
import { useAuth } from '../../context/AuthContext'
import { ticketsAPI } from '../../api/tickets'
import type { Ticket, TicketStatus } from '../../types'

export function StudentDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL')

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

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  }

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here is a quick overview of your current complaints and their status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">all_inbox</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</p>
          <p className="text-sm text-slate-500 mt-1">Total Tickets</p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined">fiber_new</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Action Required
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.open}</p>
          <p className="text-sm text-slate-500 mt-1">Open Tickets</p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Review
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.inProgress}</p>
          <p className="text-sm text-slate-500 mt-1">In Progress</p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.resolved}</p>
          <p className="text-sm text-slate-500 mt-1">Resolved Tickets</p>
        </Card>
          </>
        )}
      </div>

      {/* Recent Tickets Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Tickets</h3>
            <Link to="/tickets" className="text-sm font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by ticket ID or title..."
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">
              {searchQuery || statusFilter !== 'ALL'
                ? 'No tickets match your filters'
                : 'No tickets yet. Create your first complaint!'}
            </p>
            {!searchQuery && statusFilter === 'ALL' && (
              <Link
                to="/tickets/create"
                className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Create Ticket
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTickets.slice(0, 10).map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
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
        )}
      </Card>

      {/* Floating Action Button */}
      <Link
        to="/tickets/create"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Create New Ticket
        </span>
      </Link>

      {/* Back to Top Button */}
      <BackToTop />
    </Layout>
  )
}
