import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions, withPermission } from '../utils/permissions.jsx'
import { fetchUserPermissions, getAvailablePermissions } from '../store/slices/permissionSlice'
import { fetchShops } from '../store/slices/shopSlice'
import { permissionService } from '../services/api'
import { Shield, Check, X, Save, RefreshCw, Building, Users, Store } from 'lucide-react'

const PermissionMatrix = ({ permissions, onPermissionChange, availablePages, availableActions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module
            </th>
            {availableActions.map(action => (
              <th key={action} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {availablePages.map(page => (
            <tr key={page}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                {page.replace('_', ' ')}
              </td>
              {availableActions.map(action => (
                <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => onPermissionChange(page, action)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      permissions[page]?.[action] 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {permissions[page]?.[action] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Permissions = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { userPermissions, accessiblePages, availablePages, availableActions } = useSelector(state => state.permissions)
  const { shops, isLoading: shopsLoading } = useSelector(state => state.shops)
  const { hasPermission } = usePermissions()
  
  const [selectedShop, setSelectedShop] = useState(user?.shop?.id || '')
  const [selectedRole, setSelectedRole] = useState('optometrist')
  const [permissions, setPermissions] = useState({})
  const [pageAccess, setPageAccess] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [shopPermissions, setShopPermissions] = useState([])

  useEffect(() => {
    dispatch(fetchUserPermissions())
    // Fetch all shops if user is admin, otherwise just load permissions for current shop
    if (user?.role === 'admin') {
      dispatch(fetchShops())
    }
    loadShopPermissions()
  }, [dispatch, selectedShop, user?.role])

  const loadShopPermissions = async () => {
    if (!selectedShop) return
    
    try {
      const response = await permissionService.getShopPermissions(selectedShop)
      setShopPermissions(response.permissions || [])
    } catch (error) {
      console.error('Error loading shop permissions:', error)
      setMessage('Error loading shop permissions: ' + (error.response?.data?.message || error.message))
    }
  }

  const roles = ['shop_owner', 'optometrist', 'assistant', 'receptionist']

  const handlePermissionChange = (page, action) => {
    setPermissions(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [action]: !prev[page]?.[action]
      }
    }))
  }

  const handlePageAccessChange = (page) => {
    setPageAccess(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    )
  }

  const handleSavePermissions = async () => {
    if (!selectedShop) {
      setMessage('Please select a shop first')
      return
    }

    setIsLoading(true)
    try {
      await permissionService.updateRolePermissions(selectedShop, selectedRole, {
        permissions,
        pageAccess
      })
      setMessage('Permissions updated successfully!')
      setTimeout(() => setMessage(''), 3000)
      loadShopPermissions() // Refresh the permissions list
    } catch (error) {
      setMessage('Error updating permissions: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPermissions = async () => {
    if (!selectedShop) {
      setMessage('Please select a shop first')
      return
    }

    setIsLoading(true)
    try {
      await permissionService.resetRolePermissions(selectedShop, selectedRole)
      setMessage('Permissions reset to default successfully!')
      setTimeout(() => setMessage(''), 3000)
      loadShopPermissions() // Refresh the permissions list
      setPermissions({})
      setPageAccess([])
    } catch (error) {
      setMessage('Error resetting permissions: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  // FIXED: Handle both Map and Object formats for permissions
  const loadRolePermissions = async (shopId, role) => {
    try {
      const shopPerms = shopPermissions.find(p => p.role === role && p.shop === shopId)
      if (shopPerms) {
        let permsObj = {}
        
        // Handle both Map (from MongoDB) and Object formats
        if (shopPerms.permissions) {
          if (shopPerms.permissions instanceof Map || shopPerms.permissions.constructor.name === 'Map') {
            // It's a Map - convert to object
            shopPerms.permissions.forEach((value, key) => {
              permsObj[key] = { ...value }
            })
          } else if (typeof shopPerms.permissions === 'object') {
            // It's already an object
            permsObj = { ...shopPerms.permissions }
          }
        }
        
        setPermissions(permsObj)
        setPageAccess(shopPerms.pageAccess || [])
      } else {
        // No permissions found for this role, set defaults
        setPermissions({})
        setPageAccess([])
      }
    } catch (error) {
      console.error('Error loading role permissions:', error)
      setPermissions({})
      setPageAccess([])
    }
  }

  useEffect(() => {
    if (selectedShop && selectedRole) {
      loadRolePermissions(selectedShop, selectedRole)
    }
  }, [selectedShop, selectedRole, shopPermissions])

  // Get available shops for dropdown
  const getAvailableShops = () => {
    if (user?.role === 'admin') {
      return shops
    } else {
      // For non-admin users, only show their own shop
      return user?.shop ? [user.shop] : []
    }
  }

  if (!hasPermission('permissions', 'view')) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to manage permissions.</p>
        </div>
      </div>
    )
  }

  const availableShops = getAvailableShops()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user roles and permissions for your shops
          </p>
        </div>
      </div>

      {message && (
        <div className={`rounded-md p-4 ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Shop and Role Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
          {/* Shop Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="inline h-4 w-4 mr-1" />
              Select Shop
              {shopsLoading && <span className="ml-2 text-xs text-gray-500">Loading...</span>}
            </label>
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              disabled={shopsLoading}
            >
              <option value="">Select a shop</option>
              {availableShops.map(shop => (
                <option key={shop.id || shop._id} value={shop.id || shop._id}>
                  {shop.name} 
                  {user?.shop && (shop.id === user.shop.id || shop._id === user.shop.id) && ' (Your Shop)'}
                </option>
              ))}
              {availableShops.length === 0 && !shopsLoading && (
                <option value="" disabled>No shops available</option>
              )}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {user?.role === 'admin' 
                ? `${availableShops.length} shop(s) available` 
                : 'You can only manage permissions for your own shop'
              }
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              disabled={!selectedShop}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedShop ? (
          <>
            {/* Shop Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Store className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Managing permissions for: {availableShops.find(s => (s.id || s._id) === selectedShop)?.name}
                  </h4>
                  <p className="text-xs text-blue-600">
                    Role: {selectedRole.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permission Matrix</h3>
              {Object.keys(permissions).length > 0 ? (
                <PermissionMatrix
                  permissions={permissions}
                  onPermissionChange={handlePermissionChange}
                  availablePages={availablePages}
                  availableActions={availableActions}
                />
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No permissions configured</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Click "Reset to Default" to set default permissions for this role.
                  </p>
                </div>
              )}
            </div>

            {/* Page Access */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Page Access</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {availablePages.map(page => (
                  <label key={page} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pageAccess.includes(page)}
                      onChange={() => handlePageAccessChange(page)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {page.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleResetPermissions}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {availableShops.length === 0 ? 'No Shops Available' : 'Select a Shop'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {availableShops.length === 0 
                ? 'You need to have access to at least one shop to manage permissions.'
                : 'Please select a shop to manage permissions.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Current Shop Permissions Overview */}
      {selectedShop && shopPermissions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Current Shop Permissions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {shopPermissions.map((perm) => {
              // Safely get permissions count for both Map and Object formats
              let permissionsCount = 0
              if (perm.permissions) {
                if (perm.permissions instanceof Map || perm.permissions.constructor?.name === 'Map') {
                  permissionsCount = perm.permissions.size
                } else if (typeof perm.permissions === 'object') {
                  permissionsCount = Object.keys(perm.permissions).length
                }
              }
              
              return (
                <div key={perm.role} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 capitalize mb-2">
                    {perm.role.replace('_', ' ')}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{perm.pageAccess?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Permissions:</span>
                      <span className="font-medium">{permissionsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${perm.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {perm.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Current User Permissions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Current Permissions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(userPermissions).map(([page, actions]) => (
            <div key={page} className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 capitalize mb-2">
                {page.replace('_', ' ')}
              </h3>
              <div className="space-y-1">
                {Object.entries(actions).map(([action, allowed]) => (
                  <div key={action} className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      allowed ? 'bg-green-400' : 'bg-gray-300'
                    }`} />
                    <span className="text-gray-600 capitalize">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withPermission(Permissions, 'permissions', 'view')