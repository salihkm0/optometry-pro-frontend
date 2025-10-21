import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import { adminService, userService } from '../services/api' // ADD userService import
import ShopForm from '../components/ShopManagement/ShopForm'
import ShopList from '../components/ShopManagement/ShopList'
import ShopFilters from '../components/ShopManagement/ShopFilters'

const ShopManagement = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  
  const [shops, setShops] = useState([])
  const [existingUsers, setExistingUsers] = useState([]) // ADD: State for existing users
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false) // ADD: Loading state for users
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load shops and existing users on component mount
  useEffect(() => {
    loadShops()
    loadExistingUsers() // ADD: Load existing users
  }, [currentPage])

  const loadShops = async () => {
    try {
      setIsLoading(true)
      const response = await adminService.getShops({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter
      })
      
      setShops(response.shops || [])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error('Error loading shops:', error)
      setShops([])
    } finally {
      setIsLoading(false)
    }
  }

  // ADD: Function to load existing users
  const loadExistingUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const response = await userService.getUsers({ 
        limit: 1000, // Get all users
        page: 1 
      })
      setExistingUsers(response.users || [])
    } catch (error) {
      console.error('Error loading existing users:', error)
      setExistingUsers([])
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Reload when filters change
  useEffect(() => {
    setCurrentPage(1)
    loadShops()
  }, [searchTerm, statusFilter])

  const handleCreateShop = async (shopData) => {
    try {
      setIsLoading(true)
      if (editingShop) {
        // Update existing shop
        await adminService.updateShop(editingShop._id, shopData)
      } else {
        // Create new shop with owner using the admin endpoint
        // FIX: Use the correct endpoint - either admin/shops or shops
        try {
          // Try admin endpoint first
          await adminService.createShopWithOwner(shopData)
        } catch (adminError) {
          console.log('Admin endpoint failed, trying regular shops endpoint:', adminError)
          // Fallback to regular shops endpoint
          await adminService.createShop(shopData)
        }
      }
      
      setShowForm(false)
      setEditingShop(null)
      loadShops()
      // Reload users in case new owner was created
      loadExistingUsers()
    } catch (error) {
      console.error('Error saving shop:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error saving shop'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteShop = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this shop? The shop owner and users will no longer be able to access the system.')) {
      try {
        await adminService.updateShopStatus(id, 'inactive')
        loadShops()
      } catch (error) {
        console.error('Error deactivating shop:', error)
        alert(error.response?.data?.message || 'Error deactivating shop')
      }
    }
  }

  const handleEditShop = (shop) => {
    setEditingShop(shop)
    setShowForm(true)
  }

  const handleViewShop = (shop) => {
    // Navigate to shop details page or show modal
    console.log('View shop:', shop)
    // You can implement a detailed view modal here
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const refreshData = () => {
    loadShops()
    loadExistingUsers() // ADD: Refresh users data too
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all shops and their owners in the system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* ADD: Users count badge */}
          <div className="text-sm text-gray-500">
            {isLoadingUsers ? (
              <span>Loading users...</span>
            ) : (
              <span>{existingUsers.length} users available</span>
            )}
          </div>
          <button
            onClick={() => {
              setEditingShop(null)
              setShowForm(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Shop
          </button>
        </div>
      </div>

      {/* Filters */}
      <ShopFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
        onRefresh={refreshData}
        isLoading={isLoading}
      />

      {/* Shops List */}
      <ShopList
        shops={shops}
        onEdit={handleEditShop}
        onDelete={handleDeleteShop}
        onView={handleViewShop}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Shop Form Modal */}
      <ShopForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingShop(null)
        }}
        onSubmit={handleCreateShop}
        initialData={editingShop}
        isLoading={isLoading}
        existingUsers={existingUsers} // ADD: Pass existing users to form
      />
    </div>
  )
}

export default ShopManagement