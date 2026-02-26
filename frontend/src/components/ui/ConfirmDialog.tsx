// Confirmation Dialog Component
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: 'error',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: 'warning',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: 'info',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const style = variantStyles[variant]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center">
        <div className={`mx-auto w-12 h-12 ${style.iconBg} rounded-full flex items-center justify-center mb-4`}>
          <span className={`material-symbols-outlined text-2xl ${style.iconColor}`}>
            {style.icon}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 ${style.button} text-white rounded-lg font-semibold transition-colors disabled:opacity-50`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
