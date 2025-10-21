import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { usePermissions } from '../utils/permissions'
import { setCurrentRecord } from '../store/slices/recordSlice'
import { recordService } from '../services/api'
import { ArrowLeft, Edit, FileText, User, Calendar, Eye } from 'lucide-react'

const RecordDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { hasPermission } = usePermissions()
  const { currentRecord } = useSelector(state => state.records)
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecordData()
  }, [id])

  const loadRecordData = async () => {
    try {
      setIsLoading(true)
      const recordData = await recordService.getRecordById(id)
      dispatch(setCurrentRecord(recordData))
    } catch (error) {
      console.error('Error loading record data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentRecord) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Record not found</h3>
        <p className="mt-1 text-sm text-gray-500">The record you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/records')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Records
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
            onClick={() => navigate('/records')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Examination Record</h1>
            <p className="text-sm text-gray-500">
              {currentRecord.customer?.name} • {new Date(currentRecord.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          {hasPermission('records', 'edit') && (
            <button 
              onClick={() => navigate(`/records/edit/${currentRecord._id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Record
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{currentRecord.customer?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Age / Sex</p>
                  <p className="text-sm text-gray-900">
                    {currentRecord.customer?.age} years • {currentRecord.customer?.sex}
                  </p>
                </div>
              </div>

              {currentRecord.customer?.phone && (
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{currentRecord.customer.phone}</p>
                  </div>
                </div>
              )}

              {currentRecord.customer?.email && (
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{currentRecord.customer.email}</p>
                  </div>
                </div>
              )}

              {currentRecord.customer?.address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {currentRecord.customer.address.street && `${currentRecord.customer.address.street}, `}
                    {currentRecord.customer.address.city && `${currentRecord.customer.address.city}, `}
                    {currentRecord.customer.address.state && `${currentRecord.customer.address.state} - `}
                    {currentRecord.customer.address.pincode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Record Information */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Record Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Examination Type</p>
                <p className="text-sm text-gray-900 capitalize">
                  {currentRecord.examinationType?.replace('_', ' ') || 'Routine'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {new Date(currentRecord.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentRecord.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : currentRecord.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentRecord.status || 'completed'}
                </span>
              </div>

              {currentRecord.optometrist && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Optometrist</p>
                  <p className="text-sm text-gray-900">{currentRecord.optometrist}</p>
                </div>
              )}

              {currentRecord.assistant && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Assistant</p>
                  <p className="text-sm text-gray-900">{currentRecord.assistant}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">Record ID</p>
                <p className="text-sm text-gray-900 font-mono">{currentRecord._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Eye Measurements */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Eye Measurements</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Lens</th>
                      <th colSpan="4" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Right Eye</th>
                      <th colSpan="4" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Left Eye</th>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"></th>
                      
                      {/* Right Eye Headers */}
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SPH</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CYL</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AXIS</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">V/A</th>
                      
                      {/* Left Eye Headers */}
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SPH</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CYL</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AXIS</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">V/A</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* DV Row */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r">Dv</td>
                      
                      {/* Right Eye DV */}
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.dv?.sph || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.dv?.cyl || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.dv?.axis || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900 border-r">
                        {currentRecord.right_eye?.dv?.va || '-'}
                      </td>
                      
                      {/* Left Eye DV */}
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.dv?.sph || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.dv?.cyl || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.dv?.axis || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.dv?.va || '-'}
                      </td>
                    </tr>
                    
                    {/* Add Row */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r">Add</td>
                      
                      {/* Right Eye Add */}
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.add?.sph || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.add?.cyl || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.right_eye?.add?.axis || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900 border-r">
                        {currentRecord.right_eye?.add?.va || '-'}
                      </td>
                      
                      {/* Left Eye Add */}
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.add?.sph || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.add?.cyl || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.add?.axis || '-'}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {currentRecord.left_eye?.add?.va || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Additional Measurements */}
              {(currentRecord.pd || currentRecord.ph || currentRecord.prism || currentRecord.base) && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Measurements</h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
                    {currentRecord.pd && (
                      <div>
                        <p className="text-gray-500">PD (Pupillary Distance)</p>
                        <p className="text-gray-900 font-medium">{currentRecord.pd} mm</p>
                      </div>
                    )}
                    {currentRecord.ph && (
                      <div>
                        <p className="text-gray-500">PH (Pupillary Height)</p>
                        <p className="text-gray-900 font-medium">{currentRecord.ph} mm</p>
                      </div>
                    )}
                    {currentRecord.prism && (
                      <div>
                        <p className="text-gray-500">Prism</p>
                        <p className="text-gray-900 font-medium">{currentRecord.prism}Δ</p>
                      </div>
                    )}
                    {currentRecord.base && (
                      <div>
                        <p className="text-gray-500">Base</p>
                        <p className="text-gray-900 font-medium">{currentRecord.base}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {currentRecord.notes && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{currentRecord.notes}</p>
                </div>
              )}

              {/* Recommendations */}
              {currentRecord.recommendations && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{currentRecord.recommendations}</p>
                </div>
              )}

              {/* Diagnosis */}
              {currentRecord.diagnosis && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Diagnosis</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{currentRecord.diagnosis}</p>
                </div>
              )}

              {/* Record Metadata */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <p>Created: {new Date(currentRecord.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p>Last Updated: {new Date(currentRecord.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordDetails