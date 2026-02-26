import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-500 mb-4">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
