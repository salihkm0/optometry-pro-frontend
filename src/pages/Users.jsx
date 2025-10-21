import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions, withPermission } from '../utils/permissions.jsx'
import { fetchUsers, createUser, updateUser, deleteUser } from '../store/slices/userSlice'
import { shopService, userService } from '../services/api'
import { Plus, Search, Edit, Trash2, User, Shield, Mail, Phone, Building, Filter, RefreshCw } from 'lucide-react'

const UserForm = ({ isOpen, onClose, onSubmit, initialData = null, shops = [] }) => {
  // FIX: Safely handle initialData that might be null
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'optometrist',
    phone: initialData?.phone || '',
    department: initialData?.department || '',
    licenseNumber: initialData?.licenseNumber || '',
    specialization: initialData?.specialization || '',
    notes: initialData?.notes || '',
    shop: initialData?.shop?._id || initialData?.shop || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true
  })

  // Reset form when modal opens/closes or when editing user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        email: initialData?.email || '',
        password: '',
        role: initialData?.role || 'optometrist',
        phone: initialData?.phone || '',
        department: initialData?.department || '',
        licenseNumber: initialData?.licenseNumber || '',
        specialization: initialData?.specialization || '',
        notes: initialData?.notes || '',
        shop: initialData?.shop?._id || initialData?.shop || '',
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true
      })
    }
  }, [isOpen, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Prepare data for submission
    const submitData = { ...formData }
    
    // Don't send password if it's empty (for updates)
    if (!submitData.password && initialData) {
      delete submitData.password
    }
    
    // If no shop is selected and user is not admin, use current user's shop
    if (!submitData.shop && initialData?.shop) {
      submitData.shop = initialData.shop._id || initialData.shop
    }
    
    onSubmit(submitData)
  }

  if (!isOpen) return null

  const isEditing = !!initialData?._id

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Basic Information */}
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password {!isEditing && '*'}
              </label>
              <input
                type="password"
                required={!isEditing}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
              />
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to keep current password
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="optometrist">Optometrist</option>
                <option value="assistant">Assistant</option>
                <option value="receptionist">Receptionist</option>
                <option value="shop_owner">Shop Owner</option>
              </select>
            </div>

            {/* Shop Selection - Only show if admin and shops are available */}
            {shops.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shop Assignment
                </label>
                <select
                  value={formData.shop}
                  onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a shop (optional)</option>
                  {shops.map(shop => (
                    <option key={shop._id || shop.id} value={shop._id || shop.id}>
                      {shop.name}
                      {shop.contact?.city && ` - ${shop.contact.city}`}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Assign this user to a specific shop (admin only)
                </p>
              </div>
            )}

            {/* Professional Details */}
            <div className="sm:col-span-2 mt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Professional Details</h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter department"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter specialization"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter any additional notes..."
              />
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div className="sm:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active User</span>
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Inactive users cannot log into the system
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Users = () => {
  const dispatch = useDispatch()
  
  // FIXED: Use correct Redux state structure
  const { users = [], isLoading = false } = useSelector(state => state.users || {})
  const { user: currentUser } = useSelector(state => state.auth || {})
  
  const { hasPermission } = usePermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedShop, setSelectedShop] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [shops, setShops] = useState([])
  const [isLoadingShops, setIsLoadingShops] = useState(false)
  const [localUsers, setLocalUsers] = useState([]) // ADD THIS: Local state for users

  // Fetch shops and users
  useEffect(() => {
    loadShops()
    loadUsers()
  }, [dispatch])

  const loadShops = async () => {
    try {
      setIsLoadingShops(true)
      let shopsData = []
      
      if (currentUser?.role === 'admin') {
        // Admin can see all shops
        const response = await shopService.getShops()
        shopsData = response.shops || []
      } else if (currentUser?.shop) {
        // Non-admin users can only see their own shop
        shopsData = [currentUser.shop]
      }
      
      setShops(shopsData)
    } catch (error) {
      console.error('Error loading shops:', error)
      setShops([])
    } finally {
      setIsLoadingShops(false)
    }
  }

  const loadUsers = async (shopId = '') => {
    try {
      let usersData = []
      
      if (shopId) {
        // Fetch users for specific shop
        const response = await shopService.getShopUsers(shopId)
        usersData = response.users || []
        console.log('Users for shop:', usersData)
      } else {
        // Use Redux to fetch all users
        const result = await dispatch(fetchUsers()).unwrap()
        usersData = result.users || []
        console.log('All users from Redux:', usersData)
      }
      
      // Update local state with the fetched users
      setLocalUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      setLocalUsers([])
    }
  }

  // Use localUsers instead of Redux users for display
  const displayUsers = localUsers.length > 0 ? localUsers : users

  // Filter users based on search term, shop, and role
  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesShop = !selectedShop || 
      user.shop?._id === selectedShop || 
      user.shop === selectedShop ||
      (currentUser?.shop && currentUser.shop.id === selectedShop && user.shop === currentUser.shop.id)
    
    const matchesRole = !selectedRole || user.role === selectedRole
    
    return matchesSearch && matchesShop && matchesRole
  })

  const handleCreateUser = async (userData) => {
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser._id, userData })).unwrap()
      } else {
        await dispatch(createUser(userData)).unwrap()
      }
      setShowForm(false)
      setEditingUser(null)
      // Reload users to reflect changes
      loadUsers(selectedShop)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(id)).unwrap()
        // Reload users to reflect changes
        loadUsers(selectedShop)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleShopChange = (shopId) => {
    setSelectedShop(shopId)
    // Load users for the selected shop
    loadUsers(shopId)
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      shop_owner: 'bg-blue-100 text-blue-800',
      optometrist: 'bg-green-100 text-green-800',
      assistant: 'bg-yellow-100 text-yellow-800',
      receptionist: 'bg-gray-100 text-gray-800',
    }
    return colors[role] || colors.receptionist
  }

  const clearFilters = () => {
    setSelectedShop('')
    setSelectedRole('')
    setSearchTerm('')
    // Reload all users when clearing filters
    loadUsers()
  }

  const refreshData = () => {
    loadShops()
    loadUsers(selectedShop)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their roles
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          {hasPermission('users', 'create') && (
            <button
              onClick={() => {
                setEditingUser(null)
                setShowForm(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Shop Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Shop
                {isLoadingShops && <span className="ml-1 text-xs text-gray-500">(Loading...)</span>}
              </label>
              <select
                value={selectedShop}
                onChange={(e) => handleShopChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                disabled={isLoadingShops}
              >
                <option value="">All Shops</option>
                {shops.map(shop => (
                  <option key={shop._id || shop.id} value={shop._id || shop.id}>
                    {shop.name}
                    {currentUser?.shop && (shop._id === currentUser.shop.id || shop.id === currentUser.shop.id) && ' (Your Shop)'}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {shops.length} shop(s) available
              </p>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="shop_owner">Shop Owner</option>
                <option value="optometrist">Optometrist</option>
                <option value="assistant">Assistant</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-sm text-gray-500">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.licenseNumber || 'No license'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{user.department || 'No department'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Building className="h-4 w-4 mr-1 text-gray-400" />
                          {user.shop?.name || 'No Shop Assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {hasPermission('users', 'edit') && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {hasPermission('users', 'delete') && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <User className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || selectedShop || selectedRole 
                          ? 'Try adjusting your search or filters' 
                          : 'Get started by creating a new user'
                        }
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingUser(null)
        }}
        onSubmit={handleCreateUser}
        initialData={editingUser}
        shops={shops}
      />
    </div>
  )
}

export default withPermission(Users, 'users', 'view')