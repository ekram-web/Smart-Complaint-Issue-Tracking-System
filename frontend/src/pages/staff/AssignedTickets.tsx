import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ticketsAPI } from '../../api/tickets'
import { useAuth } from '../../context/AuthContext'
import type { Ticket } from '../../types'

export function AssignedTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await ticketsAPI.getAll({ assignedToId: user?.id })
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
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">My Assigned Tickets</h2>
        <p className="text-slate-500 mt-1">Tickets assigned to you</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No tickets assigned to you yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ticket.author?.name || 'N/A'}</td>
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
                      <Link to={`/tickets/${ticket.id}`}>
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
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
