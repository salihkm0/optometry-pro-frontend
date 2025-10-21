import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions } from '../utils/permissions.jsx'
import { setCurrentCustomer } from '../store/slices/customerSlice'
import { fetchCustomerRecords } from '../store/slices/recordSlice'
import { customerService } from '../services/api'
import { ArrowLeft, Edit, Plus, FileText, User, Phone, Mail, MapPin, Calendar, Eye, Trash2 } from 'lucide-react'

const CustomerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { hasPermission } = usePermissions()
  const { currentCustomer } = useSelector(state => state.customers)
  const { customerRecords, isLoading: recordsLoading } = useSelector(state => state.records)
  
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  console.log("customerRecords : ", customerRecords)
  console.log("currentCustomer : ", currentCustomer)

  useEffect(() => {
    loadCustomerData()
  }, [id])

  const loadCustomerData = async () => {
    try {
      setIsLoading(true)
      // Load customer data and their records in parallel
      const [customerData] = await Promise.all([
        customerService.getCustomerById(id),
        dispatch(fetchCustomerRecords(id))
      ])
      
      dispatch(setCurrentCustomer(customerData))
    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewRecord = (recordId) => {
    navigate(`/records/${recordId}`)
  }

  const handleEditRecord = (recordId) => {
    navigate(`/records/edit/${recordId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentCustomer) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Customer not found</h3>
        <p className="mt-1 text-sm text-gray-500">The customer you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentCustomer.name}</h1>
            <p className="text-sm text-gray-500">Customer Details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {hasPermission('records', 'create') && (
            <button
              onClick={() => navigate(`/records/new?customerId=${id}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </button>
          )}
          {hasPermission('customers', 'edit') && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'details', name: 'Details' },
            { id: 'records', name: 'Records', count: customerRecords.length },
            { id: 'medical', name: 'Medical History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count !== undefined && (
                <span className="ml-2 py-0.5 px-2 text-xs bg-gray-100 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        {activeTab === 'details' && <CustomerDetailsTab customer={currentCustomer} />}
        {activeTab === 'records' && (
          <CustomerRecordsTab 
            records={customerRecords} 
            isLoading={recordsLoading}
            onViewRecord={handleViewRecord}
            onEditRecord={handleEditRecord}
            hasPermission={hasPermission}
          />
        )}
        {activeTab === 'medical' && <MedicalHistoryTab customer={currentCustomer} />}
      </div>
    </div>
  )
}

const CustomerDetailsTab = ({ customer }) => (
  <div className="p-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex items-center space-x-3">
        <User className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-sm text-gray-900">{customer.name}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Calendar className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-500">Age / Sex</p>
          <p className="text-sm text-gray-900">
            {customer.age ? `${customer.age} years` : 'Not specified'} • {customer.sex || 'Not specified'}
          </p>
        </div>
      </div>

      {customer.phone && (
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">{customer.phone}</p>
          </div>
        </div>
      )}

      {customer.email && (
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{customer.email}</p>
          </div>
        </div>
      )}

      {customer.address && (customer.address.street || customer.address.city) && (
        <div className="flex items-start space-x-3 sm:col-span-2">
          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-sm text-gray-900">
              {[customer.address.street, customer.address.city, customer.address.state, customer.address.zipCode]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      )}

      {customer.lastVisit && (
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">Last Visit</p>
            <p className="text-sm text-gray-900">
              {new Date(customer.lastVisit).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <Calendar className="h-5 w-5 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-500">Member Since</p>
          <p className="text-sm text-gray-900">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </div>
)

const CustomerRecordsTab = ({ records, isLoading, onViewRecord, onEditRecord, hasPermission }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {records.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No records</h3>
          <p className="mt-1 text-sm text-gray-500">No examination records found for this customer.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div key={record._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h4 className="text-lg font-semibold text-gray-900 capitalize">
                      {record.examinationType?.replace('_', ' ') || 'Examination'}
                    </h4>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(record.date).toLocaleDateString()} 
                    {record.optometrist && ` • ${record.optometrist}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewRecord(record._id)}
                    className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                    title="View Record"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {hasPermission('records', 'edit') && (
                    <button 
                      onClick={() => onEditRecord(record._id)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit Record"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('records', 'delete') && (
                    <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Eye Measurements Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Eye Measurements</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Right Eye */}
                  <div>
                    <h6 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      Right Eye (OD)
                    </h6>
                    <div className="space-y-3">
                      {/* Right Eye DV */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Distance Vision (DV)</p>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">SPH</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.dv?.sph || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">CYL</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.dv?.cyl || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">AXIS</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.dv?.axis || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">V/A</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.dv?.va || '-'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Eye Add */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Add (Near Vision)</p>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">SPH</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.add?.sph || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">CYL</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.add?.cyl || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">AXIS</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.add?.axis || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">V/A</p>
                            <p className="font-medium text-gray-900">{record.right_eye?.add?.va || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Eye */}
                  <div>
                    <h6 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                      Left Eye (OS)
                    </h6>
                    <div className="space-y-3">
                      {/* Left Eye DV */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Distance Vision (DV)</p>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">SPH</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.dv?.sph || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">CYL</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.dv?.cyl || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">AXIS</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.dv?.axis || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">V/A</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.dv?.va || '-'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Left Eye Add */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Add (Near Vision)</p>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">SPH</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.add?.sph || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">CYL</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.add?.cyl || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">AXIS</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.add?.axis || '-'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">V/A</p>
                            <p className="font-medium text-gray-900">{record.left_eye?.add?.va || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                {record.notes && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}
                
                {/* Additional Measurements */}
                {(record.pd || record.ph || record.prism || record.base) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Additional Measurements</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {record.pd && (
                        <div>
                          <span className="text-gray-500">PD: </span>
                          <span className="font-medium text-gray-900">{record.pd} mm</span>
                        </div>
                      )}
                      {record.ph && (
                        <div>
                          <span className="text-gray-500">PH: </span>
                          <span className="font-medium text-gray-900">{record.ph} mm</span>
                        </div>
                      )}
                      {record.prism && (
                        <div>
                          <span className="text-gray-500">Prism: </span>
                          <span className="font-medium text-gray-900">{record.prism}Δ</span>
                        </div>
                      )}
                      {record.base && (
                        <div>
                          <span className="text-gray-500">Base: </span>
                          <span className="font-medium text-gray-900">{record.base}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
const MedicalHistoryTab = ({ customer }) => (
  <div className="p-6">
    {customer.medicalHistory ? (
      <div className="space-y-6">
        {customer.medicalHistory.allergies && customer.medicalHistory.allergies.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Allergies</h4>
            <div className="flex flex-wrap gap-2">
              {customer.medicalHistory.allergies.map((allergy, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {customer.medicalHistory.conditions && customer.medicalHistory.conditions.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Medical Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {customer.medicalHistory.conditions.map((condition, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}

        {customer.medicalHistory.medications && customer.medicalHistory.medications.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Medications</h4>
            <div className="flex flex-wrap gap-2">
              {customer.medicalHistory.medications.map((medication, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {medication}
                </span>
              ))}
            </div>
          </div>
        )}

        {customer.medicalHistory.notes && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{customer.medicalHistory.notes}</p>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No medical history</h3>
        <p className="mt-1 text-sm text-gray-500">No medical history recorded for this customer.</p>
      </div>
    )}
  </div>
)

export default CustomerDetails