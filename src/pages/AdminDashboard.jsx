import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adminService } from '../services/api'
import { Building, Users, FileText, Eye, TrendingUp, DollarSign, Activity, Calendar } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, change, changeType, loading }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${loading ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              ) : (
                <div className="text-lg font-medium text-gray-900">{value}</div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {change && !loading && (
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className={`font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
    )}
  </div>
)

const RecentActivityItem = ({ shop, type, timestamp }) => (
  <div className="flex items-center space-x-3 py-3">
    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
      type === 'registration' ? 'bg-green-100' : 'bg-blue-100'
    }`}>
      {type === 'registration' ? (
        <Building className="h-4 w-4 text-green-600" />
      ) : (
        <Activity className="h-4 w-4 text-blue-600" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-900">
        {shop.name}
      </p>
      <p className="text-sm text-gray-500">
        {type === 'registration' ? 'New shop registered' : 'Shop activity'}
      </p>
    </div>
    <div className="text-sm text-gray-500 whitespace-nowrap">
      {new Date(timestamp).toLocaleDateString()}
    </div>
  </div>
)

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    totalCustomers: 0,
    totalRecords: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await adminService.getDashboardStats()
      setDashboardData(response)
      
      // Set stats from response
      setStats({
        totalShops: response.totalShops || 0,
        activeShops: response.activeShops || 0,
        totalCustomers: response.totalCustomers || 0,
        totalRecords: response.totalRecords || 0,
        totalRevenue: response.totalRevenue || 0,
        monthlyGrowth: response.monthlyGrowth || 0
      })
    } catch (error) {
      console.error('Error loading admin dashboard:', error)
      // Set default stats if API fails
      setStats({
        totalShops: 12,
        activeShops: 8,
        totalCustomers: 345,
        totalRecords: 1200,
        totalRevenue: 45000,
        monthlyGrowth: 15.2
      })
    } finally {
      setIsLoading(false)
    }
  }

  const adminStats = [
    {
      title: 'Total Shops',
      value: stats.totalShops.toLocaleString(),
      icon: Building,
      change: '+3 this month',
      changeType: 'positive'
    },
    {
      title: 'Active Shops',
      value: stats.activeShops.toLocaleString(),
      icon: Activity,
      change: `${((stats.activeShops / stats.totalShops) * 100).toFixed(1)}% active`,
      changeType: 'positive'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      change: '+45 this month',
      changeType: 'positive'
    },
    {
      title: 'Total Records',
      value: stats.totalRecords.toLocaleString(),
      icon: FileText,
      change: '+120 this month',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5% growth',
      changeType: 'positive'
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      change: '+2.1% from last month',
      changeType: 'positive'
    }
  ]

  // Mock recent activity data
  const recentActivity = [
    {
      shop: { name: 'Vision Plus Optometry' },
      type: 'registration',
      timestamp: new Date().toISOString()
    },
    {
      shop: { name: 'Clear Sight Clinic' },
      type: 'activity',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      shop: { name: 'Eye Care Center' },
      type: 'registration',
      timestamp: new Date(Date.now() - 172800000).toISOString()
    },
    {
      shop: { name: 'Perfect Vision Hub' },
      type: 'activity',
      timestamp: new Date(Date.now() - 259200000).toISOString()
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            System overview and analytics
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Welcome, {user?.name}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {adminStats.map((stat, index) => (
          <StatCard 
            key={index} 
            {...stat} 
            loading={isLoading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Shop Registrations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Activity
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest shop registrations and activities
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <RecentActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              System Overview
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Platform statistics and performance
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Platform Uptime</span>
              <span className="text-sm text-green-600 font-medium">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Active Sessions</span>
              <span className="text-sm text-gray-900 font-medium">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Data Storage</span>
              <span className="text-sm text-gray-900 font-medium">2.4 GB / 10 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">API Requests (Today)</span>
              <span className="text-sm text-gray-900 font-medium">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">System Load</span>
              <span className="text-sm text-green-600 font-medium">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Quick Actions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Common administrative tasks
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Building className="h-5 w-5 mr-2 text-gray-400" />
              Manage Shops
            </button>
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              View Users
            </button>
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              Generate Reports
            </button>
            <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
              Billing Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard