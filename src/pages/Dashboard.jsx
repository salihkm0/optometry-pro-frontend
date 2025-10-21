import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions } from '../utils/permissions.jsx'
import { fetchCustomers } from '../store/slices/customerSlice'
import { fetchRecords } from '../store/slices/recordSlice'
import { Users, FileText, Eye, TrendingUp } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {change && (
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

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { customers, records, isLoading: customersLoading } = useSelector(state => ({
    customers: state.customers.customers,
    records: state.records.records,
    customersLoading: state.customers.isLoading
  }))
  const { canAccessPage } = usePermissions()

  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Only load data once when component mounts
    if (!dataLoaded) {
      if (canAccessPage('customers')) {
        dispatch(fetchCustomers({ page: 1, limit: 5 }))
      }
      if (canAccessPage('records')) {
        dispatch(fetchRecords({ page: 1, limit: 5 }))
      }
      setDataLoaded(true)
    }
  }, [dispatch, canAccessPage, dataLoaded])

  // Mock stats since we don't have real data yet
  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Records',
      value: records.length,
      icon: FileText,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'This Month',
      value: '24',
      icon: Eye,
      change: '+4%',
      changeType: 'positive'
    },
    {
      title: 'Growth Rate',
      value: '15.2%',
      icon: TrendingUp,
      change: '+2.1%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Customers */}
        {canAccessPage('customers') && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Recent Customers
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {customersLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : customers.length > 0 ? (
                customers.slice(0, 5).map((customer) => (
                  <div key={customer._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.phone} • {customer.age} years
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No customers found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Records */}
        {canAccessPage('records') && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Recent Records
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {customersLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : records.length > 0 ? (
                records.slice(0, 5).map((record) => (
                  <div key={record._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.customer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.examinationType} • {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {record.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No records found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard