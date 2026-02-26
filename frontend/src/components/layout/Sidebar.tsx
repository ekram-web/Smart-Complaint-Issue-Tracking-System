import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import astuLogo from '../../assets/astullogo.png'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const studentLinks = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/tickets', icon: 'confirmation_number', label: 'My Tickets' },
    { path: '/tickets/create', icon: 'add_box', label: 'Create Ticket' },
    { path: '/profile', icon: 'person', label: 'Profile' },
  ]

  const staffLinks = [
    { path: '/staff/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/staff/tickets', icon: 'assignment', label: 'Assigned Tickets' },
    { path: '/profile', icon: 'person', label: 'Profile' },
  ]

  const adminLinks = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/tickets', icon: 'confirmation_number', label: 'All Tickets' },
    { path: '/admin/users', icon: 'group', label: 'Users' },
    { path: '/admin/categories', icon: 'category', label: 'Categories' },
  ]

  const links =
    user?.role === 'ADMIN' ? adminLinks : user?.role === 'STAFF' ? staffLinks : studentLinks

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img 
              src={astuLogo} 
              alt="ASTU Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-slate-900 text-sm font-bold leading-tight">ASTU Smart</h1>
              <p className="text-slate-500 text-xs">Complaint System</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(link.path)
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
