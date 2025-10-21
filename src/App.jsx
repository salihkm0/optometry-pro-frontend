import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import DashboardLayout from './layouts/DashboardLayout'
import LoginForm from './components/Auth/LoginForm'
import RegisterForm from './components/Auth/RegisterForm'

// Pages
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Customers from './pages/Customers'
import CustomerDetails from './pages/CustomerDetails'
import Records from './pages/Records'
import RecordDetails from './pages/RecordDetails'
import Users from './pages/Users'
import Permissions from './pages/Permissions'
import Settings from './pages/Settings'

// ADD THIS IMPORT
import ShopManagement from './pages/ShopManagement'

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
  </div>
)

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Admin Route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />
}

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated) {
    return children
  }
  
  // Redirect to appropriate dashboard based on role
  return user?.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/dashboard" />
}

function App() {
  const { isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            user?.role === 'admin' 
              ? <Navigate to="/admin-dashboard" replace /> 
              : <Navigate to="/dashboard" replace />
          } />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* ADD THIS ROUTE HERE */}
          <Route path="admin/shops" element={<AdminRoute><ShopManagement /></AdminRoute>} />
          
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="records" element={<Records />} />
          <Route path="records/:id" element={<RecordDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={
          user?.role === 'admin' 
            ? <Navigate to="/admin-dashboard" replace /> 
            : <Navigate to="/dashboard" replace />
        } />
      </Routes>
    </div>
  )
}

export default App