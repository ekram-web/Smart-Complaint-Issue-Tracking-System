import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ticketsAPI } from '../../api/tickets'
import type { Ticket } from '../../types'

export function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Tickets</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage all your complaints
          </p>
        </div>
        <Link
          to="/tickets/create"
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Create Ticket
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No tickets yet. Create your first complaint!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ticket ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
    </Layout>
  )
}
