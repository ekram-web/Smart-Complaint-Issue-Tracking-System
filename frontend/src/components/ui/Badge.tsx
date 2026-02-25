import type { TicketStatus, TicketPriority, UserRole } from '../../types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'status' | 'priority' | 'role'
  value?: TicketStatus | TicketPriority | UserRole
}

export function Badge({ children, variant = 'status', value }: BadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-amber-100 text-amber-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-slate-100 text-slate-600'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700'
      case 'HIGH':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-slate-100 text-slate-700'
      case 'STAFF':
        return 'bg-blue-100 text-blue-700'
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  let colorClass = 'bg-slate-100 text-slate-800'
  
  if (value) {
    if (variant === 'status') colorClass = getStatusColor(value)
    else if (variant === 'priority') colorClass = getPriorityColor(value)
    else if (variant === 'role') colorClass = getRoleColor(value)
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children}
    </span>
  )
}
