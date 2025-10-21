import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePermissions, withPermission } from '../utils/permissions.jsx'
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../store/slices/customerSlice'
import { Plus, Search, Edit, Trash2, Eye, Users, Building } from 'lucide-react'

const CustomerForm = ({ isOpen, onClose, onSubmit, initialData = null, shops = [], isAdmin = false }) => {
  console.log("initialData : ", initialData)
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    shop: '' // Add shop field
  })

  // Reset form when initialData changes or modal opens/closes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        sex: initialData.sex || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: {
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          zipCode: initialData.address?.zipCode || '',
        },
        shop: initialData.shop?._id || initialData.shop || ''
      })
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        age: '',
        sex: '',
        phone: '',
        email: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
        shop: ''
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {initialData && initialData._id ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl"
            type="button"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Shop Selection - Only for Admin */}
            {isAdmin && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Shop *</label>
                <select
                  required={isAdmin}
                  value={formData.shop}
                  onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a Shop</option>
                  {shops.map(shop => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                min="0"
                max="150"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Phone number"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email address"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="ZIP code"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData && initialData._id ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Customers = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { customers, isLoading } = useSelector(state => state.customers)
  const { user } = useSelector(state => state.auth)
  const { hasPermission } = usePermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShop, setSelectedShop] = useState('all')
  const [shops, setShops] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(fetchCustomers())
    loadShops()
  }, [dispatch])

  const loadShops = async () => {
    if (isAdmin) {
      try {
        // Mock shops data - in real app, fetch from API
        const mockShops = [
          { _id: '1', name: 'Vision Plus Optometry' },
          { _id: '2', name: 'Clear Sight Clinic' },
          { _id: '3', name: 'Eye Care Center' }
        ]
        setShops(mockShops)
      } catch (error) {
        console.error('Error loading shops:', error)
      }
    }
  }

  // Filter customers based on search term and selected shop
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.includes(searchTerm) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // If admin and shop filter is selected, filter by shop
    const matchesShop = !isAdmin || selectedShop === 'all' || customer.shop?._id === selectedShop
    
    return matchesSearch && matchesShop
  })

  const handleCreateCustomer = async (customerData) => {
    try {
      // For non-admin users, automatically assign their shop
      if (!isAdmin && user?.shop) {
        customerData.shop = user.shop._id || user.shop
      }

      if (editingCustomer && editingCustomer._id) {
        // Update existing customer
        await dispatch(updateCustomer({ 
          id: editingCustomer._id, 
          customerData 
        })).unwrap()
      } else {
        // Create new customer
        await dispatch(createCustomer(customerData)).unwrap()
      }
      setShowForm(false)
      setEditingCustomer(null)
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Failed to save customer. Please try again.')
    }
  }

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await dispatch(deleteCustomer(id)).unwrap()
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Failed to delete customer. Please try again.')
      }
    }
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
        {hasPermission('customers', 'create') && (
          <button
            onClick={handleAddCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
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
                  placeholder="Search customers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Shop Filter - Only for Admin */}
            {isAdmin && shops.length > 0 && (
              <div className="sm:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Shops</option>
                    {shops.map(shop => (
                      <option key={shop._id} value={shop._id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedShop !== 'all' 
                    ? 'No customers match your search criteria.' 
                    : 'Get started by creating a new customer.'
                  }
                </p>
                {hasPermission('customers', 'create') && !searchTerm && selectedShop === 'all' && (
                  <button
                    onClick={handleAddCustomer}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Customer
                  </button>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shop
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age/Sex
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Shop Column - Only for Admin */}
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.shop?.name || 'No shop assigned'}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone || 'No phone'}</div>
                        <div className="text-sm text-gray-500">{customer.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.age ? `${customer.age} years` : 'No age'}
                        </div>
                        <div className="text-sm text-gray-500">{customer.sex || 'No gender'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/customers/${customer._id}`)}
                            className="text-primary-600 hover:text-primary-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {hasPermission('customers', 'edit') && (
                            <button
                              onClick={() => handleEditCustomer(customer)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit Customer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {hasPermission('customers', 'delete') && (
                            <button
                              onClick={() => handleDeleteCustomer(customer._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Customer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Customer Form Modal */}
      <CustomerForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingCustomer(null)
        }}
        onSubmit={handleCreateCustomer}
        initialData={editingCustomer}
        shops={shops}
        isAdmin={isAdmin}
      />
    </div>
  )
}

export default withPermission(Customers, 'customers', 'view')