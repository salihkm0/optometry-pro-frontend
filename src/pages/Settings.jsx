import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { usePermissions } from '../utils/permissions'
import { Settings as SettingsIcon, User, Shield, Bell, Building, Save } from 'lucide-react'

const Settings = () => {
  const { user } = useSelector(state => state.auth)
  const { canAccessPage } = usePermissions()

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, permission: () => true },
    { id: 'shop', name: 'Shop Settings', icon: Building, permission: () => user?.role === 'shop_owner' || user?.role === 'admin' },
    { id: 'security', name: 'Security', icon: Shield, permission: () => true },
    { id: 'notifications', name: 'Notifications', icon: Bell, permission: () => true },
  ].filter(tab => tab.permission())

  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)

  if (!canAccessPage('settings')) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have permission to access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and application settings
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings isLoading={isLoading} setIsLoading={setIsLoading} />}
          {activeTab === 'shop' && <ShopSettings isLoading={isLoading} setIsLoading={setIsLoading} />}
          {activeTab === 'security' && <SecuritySettings isLoading={isLoading} setIsLoading={setIsLoading} />}
          {activeTab === 'notifications' && <NotificationSettings isLoading={isLoading} setIsLoading={setIsLoading} />}
        </div>
      </div>
    </div>
  )
}

const ProfileSettings = ({ isLoading, setIsLoading }) => {
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Handle profile update API call
      console.log('Updating profile:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Error updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <p className="mt-1 text-sm text-gray-500">Update your account profile information.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

const ShopSettings = ({ isLoading, setIsLoading }) => {
  const { user } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    name: user?.shop?.name || '',
    email: user?.shop?.contact?.email || '',
    phone: user?.shop?.contact?.phone || '',
    address: {
      street: user?.shop?.contact?.address?.street || '',
      city: user?.shop?.contact?.address?.city || '',
      state: user?.shop?.contact?.address?.state || '',
      zipCode: user?.shop?.contact?.address?.zipCode || '',
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Updating shop settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Shop settings updated successfully!')
    } catch (error) {
      alert('Error updating shop settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user?.shop) {
    return (
      <div className="text-center py-8">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No shop associated</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have a shop associated with your account.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Shop Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Manage your shop configuration and contact information.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Shop Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

const SecuritySettings = ({ isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    setIsLoading(true)
    try {
      console.log('Changing password:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Password changed successfully!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      alert('Error changing password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Update your password and security preferences.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </form>
  )
}

const NotificationSettings = ({ isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: true,
    sms: false,
    push: true,
    appointmentReminders: true,
    newRecords: true,
    systemUpdates: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Updating notification settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Notification settings updated successfully!')
    } catch (error) {
      alert('Error updating notification settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Notification Methods</h4>
          <div className="space-y-3">
            {[
              { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
              { id: 'sms', label: 'SMS Notifications', description: 'Receive notifications via text message' },
              { id: 'push', label: 'Push Notifications', description: 'Receive push notifications in the app' },
            ].map((method) => (
              <label key={method.id} className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData[method.id]}
                  onChange={(e) => setFormData({ ...formData, [method.id]: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{method.label}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Notification Types</h4>
          <div className="space-y-3">
            {[
              { id: 'appointmentReminders', label: 'Appointment Reminders', description: 'Get reminded about upcoming appointments' },
              { id: 'newRecords', label: 'New Records', description: 'Notify when new patient records are added' },
              { id: 'systemUpdates', label: 'System Updates', description: 'Receive updates about system maintenance and features' },
            ].map((type) => (
              <label key={type.id} className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData[type.id]}
                  onChange={(e) => setFormData({ ...formData, [type.id]: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{type.label}</p>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default Settings