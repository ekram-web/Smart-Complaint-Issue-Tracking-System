// All Tickets Page (Admin)
// View and manage all tickets in the system

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ticketsAPI } from '../../api/tickets'
import type { Ticket } from '../../types'

export function AllTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredTickets = tickets
    .filter((t) => (filter === 'all' ? true : t.status === filter))
    .filter((t) =>
      searchQuery
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">All Tickets</h2>
        <p className="text-slate-500 mt-1">View and manage all tickets in the system</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, title, or author..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('OPEN')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'OPEN'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'IN_PROGRESS'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === 'RESOLVED'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">
              {searchQuery ? 'No tickets match your search' : 'No tickets found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Ticket ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Author</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.author?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
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

      {/* Results Count */}
      {!loading && (
        <div className="mt-4 text-sm text-slate-500 text-center">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      )}
    </Layout>
  )
}
