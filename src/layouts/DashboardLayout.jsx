import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { usePermissions } from '../utils/permissions.jsx'
import {
  Eye,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Building
} from 'lucide-react'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(state => state.auth)
  const { canAccessPage, hasPermission } = usePermissions()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isAdmin = user?.role === 'admin'

  // Define navigation items based on user role and permissions
  const navigation = [
    { 
      name: 'Dashboard', 
      href: isAdmin ? '/admin-dashboard' : '/dashboard', 
      icon: BarChart3, 
      permission: () => canAccessPage('dashboard'),
      show: true
    },
    { 
      name: 'Customers', 
      href: '/customers', 
      icon: Users, 
      permission: () => canAccessPage('customers'),
      show: true
    },
    { 
      name: 'Records', 
      href: '/records', 
      icon: FileText, 
      permission: () => canAccessPage('records'),
      show: true
    },
    { 
      name: 'Appointments', 
      href: '/appointments', 
      icon: Calendar, 
      permission: () => canAccessPage('appointments'),
      show: true
    },
    // Admin-only navigation items
    { 
      name: 'Shops', 
      href: '/admin/shops', 
      icon: Building, 
      permission: () => isAdmin && hasPermission('shops', 'view'),
      show: isAdmin
    },
    // Users navigation - different for admin vs regular users
    { 
      name: isAdmin ? 'All Users' : 'Users', 
      href: isAdmin ? '/admin/users' : '/users', 
      icon: User, 
      permission: () => hasPermission('users', 'view'),
      show: true
    },
    { 
      name: 'Permissions', 
      href: '/permissions', 
      icon: Shield, 
      permission: () => hasPermission('permissions', 'view'),
      show: true
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings, 
      permission: () => canAccessPage('settings'),
      show: true
    },
  ].filter(item => item.show && item.permission())

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/admin-dashboard') return 'Admin Dashboard'
    if (path === '/customers') return 'Customers'
    if (path === '/records') return 'Records'
    if (path === '/users') return 'Users'
    if (path === '/admin/users') return 'All Users'
    if (path === '/permissions') return 'Permissions'
    if (path === '/settings') return 'Settings'
    if (path === '/admin/shops') return 'Shop Management'
    return 'Dashboard'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Optometry Pro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 capitalize truncate">
                {user?.role?.replace('_', ' ')}
                {user?.shop?.name && ` • ${user.shop.name}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-500 rounded-lg"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <div className="flex items-center space-x-4">
                {!isAdmin && user?.shop?.name && (
                  <span className="text-sm text-gray-500">
                    {user.shop.name}
                  </span>
                )}
                {isAdmin && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Administrator
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout