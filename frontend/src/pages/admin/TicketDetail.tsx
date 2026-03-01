// Admin/Staff Ticket Detail Page with Assignment
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ticketsAPI } from '../../api/tickets'
import { adminAPI } from '../../api/admin'
import { getFileURL } from '../../utils/config'
import type { Ticket, User } from '../../types'

export function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [remarkContent, setRemarkContent] = useState('')
  const [submittingRemark, setSubmittingRemark] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [staffUsers, setStaffUsers] = useState<User[]>([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchTicket()
    fetchStaffUsers()
  }, [id])

  const fetchTicket = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const response = await ticketsAPI.getById(id)
      if (response.success && response.data) {
        setTicket(response.data)
      }
    } catch (error) {
      // Failed to fetch ticket
    } finally {
      setLoading(false)
    }
  }

  const fetchStaffUsers = async () => {
    try {
      const response = await adminAPI.getUsers()
      if (response.success && response.data) {
        const staff = response.data.filter((u: User) => u.role === 'STAFF' || u.role === 'ADMIN')
        setStaffUsers(staff)
      }
    } catch (error) {
      // Failed to fetch staff
    }
  }

  const handleAssign = async () => {
    if (!id || !selectedStaff) return

    try {
      setAssigning(true)
      const response = await ticketsAPI.update(id, { assignedToId: selectedStaff })
      
      if (response.success) {
        setShowAssignModal(false)
        fetchTicket()
      }
    } catch (error) {
      // Failed to assign ticket
    } finally {
      setAssigning(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!id || !selectedStatus) return

    try {
      setUpdatingStatus(true)
      const response = await ticketsAPI.update(id, { status: selectedStatus as any })
      
      if (response.success) {
        setShowStatusModal(false)
        fetchTicket()
      }
    } catch (error) {
      // Failed to update status
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !remarkContent.trim()) return

    try {
      setSubmittingRemark(true)
      const response = await ticketsAPI.addRemark(id, {
        content: remarkContent,
        isInternal: false,
      })

      if (response.success) {
        setRemarkContent('')
        fetchTicket()
      }
    } catch (error) {
      // Failed to add remark
    } finally {
      setSubmittingRemark(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading ticket...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
            error
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ticket not found</h2>
          <p className="text-slate-600 mb-6">The ticket you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-medium">Back</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                  {ticket.ticketId}
                </span>
                <Badge variant="status" value={ticket.status}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge variant="priority" value={ticket.priority}>
                  {ticket.priority}
                </Badge>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {ticket.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {ticket.author && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">person</span>
                    <span>{ticket.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                {ticket.category && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">category</span>
                    <span>{ticket.category.name}</span>
                  </div>
                )}
                {ticket.location && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span>{ticket.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedStatus(ticket.status)
                  setShowStatusModal(true)
                }}
              >
                <span className="material-symbols-outlined text-[18px] mr-1">edit</span>
                Update Status
              </Button>
              <Button
                onClick={() => {
                  setSelectedStaff(ticket.assignedToId || '')
                  setShowAssignModal(true)
                }}
              >
                <span className="material-symbols-outlined text-[18px] mr-1">person_add</span>
                {ticket.assignedTo ? 'Reassign' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                Description
              </h2>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">attach_file</span>
                  Attachments ({ticket.attachments.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ticket.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={getFileURL(attachment.filepath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined">
                          {attachment.mimetype.startsWith('image/') ? 'image' : 'description'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(attachment.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400">download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                Comments ({ticket.remarks?.length || 0})
              </h2>
              
              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {ticket.remarks && ticket.remarks.length > 0 ? (
                  ticket.remarks.map((remark) => (
                    <div key={remark.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {remark.author?.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-900">{remark.author?.name || 'Unknown'}</span>
                          {remark.author?.role && <Badge variant="role" value={remark.author.role}>{remark.author.role}</Badge>}
                          <span className="text-xs text-slate-500 ml-auto">
                            {new Date(remark.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700">{remark.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                      chat_bubble_outline
                    </span>
                    <p className="text-slate-500">No comments yet</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddRemark} className="border-t border-slate-200 pt-4">
                <textarea
                  value={remarkContent}
                  onChange={(e) => setRemarkContent(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    disabled={!remarkContent.trim() || submittingRemark}
                  >
                    {submittingRemark ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED'
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Created</p>
                    <p className="text-xs text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED'
                      ? 'bg-primary text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">In Progress</p>
                    <p className="text-xs text-slate-500">
                      {ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED' ? 'Active' : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ticket.status === 'RESOLVED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Resolved</p>
                    <p className="text-xs text-slate-500">
                      {ticket.resolvedAt
                        ? new Date(ticket.resolvedAt).toLocaleDateString()
                        : 'Not yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned To */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Assigned To</h3>
              {ticket.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {ticket.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{ticket.assignedTo.name}</p>
                    <p className="text-sm text-slate-500">{ticket.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Not assigned yet</p>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Last Updated</p>
                  <p className="font-medium text-slate-900">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Department</p>
                  <p className="font-medium text-slate-900">{ticket.category?.department || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Ticket"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select staff...</option>
              {staffUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.department || 'No department'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedStaff || assigning}
            >
              {assigning ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || updatingStatus}
            >
              {updatingStatus ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
