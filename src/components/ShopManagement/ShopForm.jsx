import React, { useState, useEffect } from 'react'
import { Building, User, Mail, Phone, MapPin, Save, X, Search, Users } from 'lucide-react'

const ShopForm = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false, existingUsers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
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
    settings: {
      timezone: 'UTC',
      currency: 'USD',
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: true }
      }
    },
    owner: {
      name: '',
      email: '',
      phone: '',
      password: '',
      userId: '' // Add userId field for existing user selection
    }
  })

  const [errors, setErrors] = useState({})
  const [ownerType, setOwnerType] = useState('new') // 'new' or 'existing'
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Reset form when modal opens/closes or when editing shop changes
  useEffect(() => {
    if (isOpen) {
      setErrors({})
      setOwnerType('new')
      setUserSearchTerm('')
      setShowUserDropdown(false)
      
      if (initialData) {
        // For editing, populate existing data
        setFormData({
          name: initialData.name || '',
          contact: {
            email: initialData.contact?.email || '',
            phone: initialData.contact?.phone || '',
            address: {
              street: initialData.contact?.address?.street || '',
              city: initialData.contact?.address?.city || '',
              state: initialData.contact?.address?.state || '',
              zipCode: initialData.contact?.address?.zipCode || '',
              country: initialData.contact?.address?.country || 'USA'
            }
          },
          settings: {
            timezone: initialData.settings?.timezone || 'UTC',
            currency: initialData.settings?.currency || 'USD',
            businessHours: initialData.settings?.businessHours || {
              monday: { open: '09:00', close: '17:00', closed: false },
              tuesday: { open: '09:00', close: '17:00', closed: false },
              wednesday: { open: '09:00', close: '17:00', closed: false },
              thursday: { open: '09:00', close: '17:00', closed: false },
              friday: { open: '09:00', close: '17:00', closed: false },
              saturday: { open: '09:00', close: '17:00', closed: false },
              sunday: { open: '09:00', close: '17:00', closed: true }
            }
          },
          // For editing, don't show owner section as it can't be changed
          owner: {
            name: '',
            email: '',
            phone: '',
            password: '',
            userId: ''
          }
        })
      } else {
        // Reset to empty form for new shop
        setFormData({
          name: '',
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
          settings: {
            timezone: 'UTC',
            currency: 'USD',
            businessHours: {
              monday: { open: '09:00', close: '17:00', closed: false },
              tuesday: { open: '09:00', close: '17:00', closed: false },
              wednesday: { open: '09:00', close: '17:00', closed: false },
              thursday: { open: '09:00', close: '17:00', closed: false },
              friday: { open: '09:00', close: '17:00', closed: false },
              saturday: { open: '09:00', close: '17:00', closed: false },
              sunday: { open: '09:00', close: '17:00', closed: true }
            }
          },
          owner: {
            name: '',
            email: '',
            phone: '',
            password: '',
            userId: ''
          }
        })
      }
    }
  }, [isOpen, initialData])

  // Filter users based on search term
  const filteredUsers = existingUsers.filter(user => 
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  )

  const validateForm = () => {
    const newErrors = {}

    // Shop validation
    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required'
    }

    if (!formData.contact.email.trim()) {
      newErrors['contact.email'] = 'Shop email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors['contact.email'] = 'Please enter a valid email address'
    }

    // Owner validation (only for new shops)
    if (!initialData) {
      if (ownerType === 'new') {
        // Validate new owner fields
        if (!formData.owner.name.trim()) {
          newErrors['owner.name'] = 'Owner name is required'
        }

        if (!formData.owner.email.trim()) {
          newErrors['owner.email'] = 'Owner email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.owner.email)) {
          newErrors['owner.email'] = 'Please enter a valid email address'
        }

        if (!formData.owner.password) {
          newErrors['owner.password'] = 'Owner password is required'
        } else if (formData.owner.password.length < 6) {
          newErrors['owner.password'] = 'Password must be at least 6 characters'
        }
      } else {
        // Validate existing user selection
        if (!formData.owner.userId) {
          newErrors['owner.userId'] = 'Please select an existing user'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Prepare data for submission
      const submitData = { ...formData }
      
      // For editing, don't send owner data
      if (initialData) {
        delete submitData.owner
      } else {
        // For new shop, format owner data based on selection type
        if (ownerType === 'existing') {
          // Only send userId for existing user
          submitData.owner = {
            userId: formData.owner.userId
          }
        }
        // For new user, send all owner data as is
      }
      
      onSubmit(submitData)
    }
  }

  const updateContact = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }))
    
    // Clear error when field is updated
    if (errors[`contact.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`contact.${field}`]
        return newErrors
      })
    }
  }

  const updateAddress = (field, value) => {
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

  const updateOwner = (field, value) => {
    setFormData(prev => ({
      ...prev,
      owner: { ...prev.owner, [field]: value }
    }))
    
    // Clear error when field is updated
    if (errors[`owner.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`owner.${field}`]
        return newErrors
      })
    }
  }

  const updateBusinessHours = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        businessHours: {
          ...prev.settings.businessHours,
          [day]: {
            ...prev.settings.businessHours[day],
            [field]: value
          }
        }
      }
    }))
  }

  const handleNameChange = (value) => {
    setFormData(prev => ({ ...prev, name: value }))
    if (errors.name) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.name
        return newErrors
      })
    }
  }

  const handleOwnerTypeChange = (type) => {
    setOwnerType(type)
    // Reset owner fields when switching types
    setFormData(prev => ({
      ...prev,
      owner: {
        name: '',
        email: '',
        phone: '',
        password: '',
        userId: ''
      }
    }))
    // Clear owner-related errors
    setErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('owner.')) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      owner: {
        ...prev.owner,
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      }
    }))
    setUserSearchTerm(user.name)
    setShowUserDropdown(false)
  }

  const clearUserSelection = () => {
    setFormData(prev => ({
      ...prev,
      owner: {
        ...prev.owner,
        userId: '',
        name: '',
        email: '',
        phone: ''
      }
    }))
    setUserSearchTerm('')
  }

  if (!isOpen) return null

  const isEditing = !!initialData?._id
  const selectedUser = existingUsers.find(user => user._id === formData.owner.userId)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Shop' : 'Create New Shop'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Shop Information
            </h4>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter shop name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors['contact.email'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="shop@example.com"
                />
                {errors['contact.email'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['contact.email']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.contact.address.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={formData.contact.address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.contact.address.state}
                  onChange={(e) => updateAddress('state', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={formData.contact.address.zipCode}
                  onChange={(e) => updateAddress('zipCode', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="10001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  value={formData.contact.address.country}
                  onChange={(e) => updateAddress('country', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shop Owner Information - Only show when creating new shop */}
          {!isEditing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Shop Owner
              </h4>
              
              {/* Owner Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Owner Type
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleOwnerTypeChange('new')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      ownerType === 'new' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        ownerType === 'new' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">Create New Owner</div>
                        <div className="text-sm text-gray-500">Create a new user account for the shop owner</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleOwnerTypeChange('existing')}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      ownerType === 'existing' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        ownerType === 'existing' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">Use Existing User</div>
                        <div className="text-sm text-gray-500">Assign an existing user as shop owner</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Existing User Selection */}
              {ownerType === 'existing' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Existing User *
                  </label>
                  <div className="relative">
                    {selectedUser ? (
                      <div className="border border-gray-300 rounded-md p-3 bg-white">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{selectedUser.name}</div>
                            <div className="text-sm text-gray-500">{selectedUser.email}</div>
                            {selectedUser.phone && (
                              <div className="text-sm text-gray-500">{selectedUser.phone}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={clearUserSelection}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={userSearchTerm}
                            onChange={(e) => {
                              setUserSearchTerm(e.target.value)
                              setShowUserDropdown(true)
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Search users by name or email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        
                        {showUserDropdown && filteredUsers.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredUsers.map(user => (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.phone && (
                                  <div className="text-sm text-gray-500">{user.phone}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {errors['owner.userId'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['owner.userId']}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {existingUsers.length} user(s) available for selection
                  </p>
                </div>
              )}

              {/* New Owner Form */}
              {ownerType === 'new' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.owner.name}
                      onChange={(e) => updateOwner('name', e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        errors['owner.name'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter owner's full name"
                    />
                    {errors['owner.name'] && (
                      <p className="mt-1 text-text-red-600">{errors['owner.name']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.owner.email}
                      onChange={(e) => updateOwner('email', e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        errors['owner.email'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="owner@example.com"
                    />
                    {errors['owner.email'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['owner.email']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Owner Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.owner.phone}
                      onChange={(e) => updateOwner('phone', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.owner.password}
                      onChange={(e) => updateOwner('password', e.target.value)}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                        errors['owner.password'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter password for owner account"
                    />
                    {errors['owner.password'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['owner.password']}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Owner will use this password to login
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Business Hours */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Business Hours
            </h4>
            
            <div className="space-y-3">
              {Object.entries(formData.settings.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </label>
                  </div>
                  
                  {!hours.closed && (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                        className="block w-32 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                        className="block w-32 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  
                  {hours.closed && (
                    <span className="text-sm text-gray-500">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Shop' : 'Create Shop'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShopForm