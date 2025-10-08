import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Home,
  FileText,
  Plus,
  Package,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  const exporterNavItems = [
    { path: '/exporter', label: 'Dashboard', icon: Home },
    { path: '/exporter/expenses', label: 'Expenses', icon: FileText },
    { path: '/exporter/expenses/create', label: 'Create Expense', icon: Plus },
    { path: '/exporter/parts', label: 'Parts', icon: Package },
    { path: '/exporter/statistics', label: 'Statistics', icon: BarChart3 },
  ]

  const localNavItems = [
    { path: '/srilanka', label: 'Dashboard', icon: Home },
    { path: '/srilanka/expenses', label: 'Shared Expenses', icon: FileText },
    { path: '/srilanka/exporters', label: 'Exporters', icon: Users },
  ]

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/exporters', label: 'Exporters', icon: Users },
    { path: '/admin/expenses', label: 'All Expenses', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const getNavItems = () => {
    // Show admin nav items when on admin page
    if (location.pathname === '/admin' || location.pathname === '/admin-old') {
      return adminNavItems
    }
    
    // Show exporter nav items when on exporter pages (for UI designers)
    if (location.pathname.startsWith('/exporter')) {
      return exporterNavItems
    }
    
    // Show local nav items when on srilanka pages (for UI designers)
    if (location.pathname.startsWith('/srilanka')) {
      return localNavItems
    }
    
    switch (user?.role) {
      case 'ROLE_EXPORTER':
        return exporterNavItems
      case 'ROLE_LOCAL':
        return localNavItems
      case 'ROLE_ADMIN':
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
