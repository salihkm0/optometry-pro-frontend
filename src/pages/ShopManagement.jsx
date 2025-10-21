import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions } from '../utils/permissions.jsx'
import { adminService } from '../services/api'
import { Plus, Search, Edit, Trash2, Building, Eye, Users, FileText, MapPin, Phone, Mail, Shield } from 'lucide-react'

const AddShopForm = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    contact: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      }
    },
    subscription: {
      plan: 'basic',
      status: 'active'
    },
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      language: 'en',
      enableAdvancedPermissions: true,
      defaultUserRole: 'optometrist'
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        address: {
          ...prev.contact.address,
          [field]: value
        }
      }
    }))
  }

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">Add New Shop</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Basic Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Shop Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shop Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter shop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                <select
                  value={formData.subscription.plan}
                  onChange={(e) => setFormData({
                    ...formData,
                    subscription: { ...formData.subscription, plan: e.target.value }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="basic">Basic</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Owner Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Email *</label>
                <input
                  type="email"
                  required
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter owner email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Owner Phone</label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter owner phone"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter contact email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  value={formData.contact.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={formData.contact.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={formData.contact.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.contact.address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Shop Settings</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={formData.settings.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, currency: e.target.value }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={formData.settings.timezone}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, timezone: e.target.value }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default User Role</label>
                <select
                  value={formData.settings.defaultUserRole}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, defaultUserRole: e.target.value }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="optometrist">Optometrist</option>
                  <option value="assistant">Assistant</option>
                  <option value="receptionist">Receptionist</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ShopCard = ({ shop, onView, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      canceled: { color: 'bg-yellow-100 text-yellow-800', label: 'Canceled' }
    }
    
    const config = statusConfig[status] || statusConfig.inactive
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { color: 'bg-blue-100 text-blue-800', label: 'Basic' },
      professional: { color: 'bg-purple-100 text-purple-800', label: 'Professional' },
      enterprise: { color: 'bg-indigo-100 text-indigo-800', label: 'Enterprise' }
    }
    
    const config = planConfig[plan] || planConfig.basic
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(shop.subscription?.status)}
                {getPlanBadge(shop.subscription?.plan)}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(shop)}
              className="text-primary-600 hover:text-primary-900 p-1"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(shop)}
              className="text-blue-600 hover:text-blue-900 p-1"
              title="Edit Shop"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(shop)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Delete Shop"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{shop.analytics?.totalCustomers || 0} customers</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{shop.analytics?.totalRecords || 0} records</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 truncate">
              {shop.contact?.address?.city || 'No address'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{shop.contact?.phone || 'No phone'}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{shop.contact?.email || 'No email'}</span>
            </div>
            <span>Created: {new Date(shop.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShopManagement = () => {
  const dispatch = useDispatch()
  const { hasPermission } = usePermissions()
  const [shops, setShops] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadShops()
  }, [])

  const loadShops = async () => {
    try {
      setIsLoading(true)
      const response = await adminService.getShops()
      setShops(response.shops || [])
    } catch (error) {
      console.error('Error loading shops:', error)
      // Mock data for demonstration
      setShops([
        {
          _id: '1',
          name: 'Vision Plus Optometry',
          contact: {
            email: 'contact@visionplus.com',
            phone: '+1-555-0101',
            address: {
              city: 'New York',
              state: 'NY'
            }
          },
          subscription: {
            plan: 'professional',
            status: 'active'
          },
          analytics: {
            totalCustomers: 150,
            totalRecords: 450
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Clear Sight Clinic',
          contact: {
            email: 'info@clearsight.com',
            phone: '+1-555-0102',
            address: {
              city: 'Los Angeles',
              state: 'CA'
            }
          },
          subscription: {
            plan: 'enterprise',
            status: 'active'
          },
          analytics: {
            totalCustomers: 89,
            totalRecords: 267
          },
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.contact?.phone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || shop.subscription?.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddShop = async (shopData) => {
    try {
      setIsSubmitting(true)
      // In a real application, you would call the API here
      console.log('Creating shop:', shopData)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add the new shop to the list
      const newShop = {
        _id: Date.now().toString(),
        ...shopData,
        analytics: { totalCustomers: 0, totalRecords: 0 },
        createdAt: new Date().toISOString()
      }
      
      setShops(prev => [newShop, ...prev])
      setShowAddForm(false)
      
      alert('Shop created successfully!')
    } catch (error) {
      alert('Error creating shop: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewShop = (shop) => {
    // Navigate to shop details or show modal
    console.log('View shop:', shop)
    alert(`Viewing shop: ${shop.name}`)
  }

  const handleEditShop = (shop) => {
    // Open edit form
    console.log('Edit shop:', shop)
    alert(`Editing shop: ${shop.name}`)
  }

  const handleDeleteShop = (shop) => {
    if (window.confirm(`Are you sure you want to delete "${shop.name}"? This action cannot be undone.`)) {
      setShops(prev => prev.filter(s => s._id !== shop._id))
      alert('Shop deleted successfully!')
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all shops and their subscriptions
          </p>
        </div>
        {hasPermission('shops', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shop
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search shops by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map(shop => (
            <ShopCard
              key={shop._id}
              shop={shop}
              onView={handleViewShop}
              onEdit={handleEditShop}
              onDelete={handleDeleteShop}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredShops.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shops found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first shop.'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && hasPermission('shops', 'create') && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shop
            </button>
          )}
        </div>
      )}

      {/* Add Shop Form Modal */}
      <AddShopForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddShop}
        loading={isSubmitting}
      />
    </div>
  )
}

export default ShopManagement