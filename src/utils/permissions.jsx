import React from 'react'
import { useSelector } from 'react-redux'

export const usePermissions = () => {
  const { userPermissions, accessiblePages } = useSelector(state => state.permissions)
  const { user } = useSelector(state => state.auth)

  // Helper function to extract clean permission value from Mongoose document
  const getPermissionValue = (module, action) => {
    if (!userPermissions[module]) return false
    
    const moduleData = userPermissions[module]
    
    // Handle Mongoose document structure
    if (moduleData._doc) {
      // If it has _doc, it's a Mongoose subdocument
      return moduleData._doc[action] === true
    } else if (moduleData.$__ && moduleData.$isNew === false) {
      // If it has $__ and is not new, it's a Mongoose document
      return moduleData._doc?.[action] === true
    } else {
      // Regular JavaScript object
      return moduleData[action] === true
    }
  }

  const hasPermission = (module, action) => {
    if (user?.role === 'admin') return true
    return getPermissionValue(module, action)
  }

  const canAccessPage = (page) => {
    if (user?.role === 'admin') return true
    return accessiblePages.includes(page)
  }

  const getAccessiblePages = () => {
    return accessiblePages
  }

  return {
    hasPermission,
    canAccessPage,
    getAccessiblePages,
    userPermissions,
    accessiblePages
  }
}

export const withPermission = (Component, module, action) => {
  return (props) => {
    const { hasPermission } = usePermissions()
    
    if (!hasPermission(module, action)) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="text-gray-500">You don't have permission to access this resource.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}