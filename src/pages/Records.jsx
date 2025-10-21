import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePermissions, withPermission } from '../utils/permissions'
import { fetchRecords, createRecord } from '../store/slices/recordSlice'
import { fetchCustomers } from '../store/slices/customerSlice'
import { Plus, Search, Edit, Trash2, Eye, FileText } from 'lucide-react'

const RecordForm = ({ isOpen, onClose, onSubmit, customers }) => {
  const [formData, setFormData] = useState({
    customer: '',
    date: new Date().toISOString().split('T')[0],
    examinationType: 'routine',
    status: 'completed',
    right_eye: { dv: {}, nv: {} },
    left_eye: { dv: {}, nv: {} },
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleEyeDataChange = (eye, lens, field, value) => {
    setFormData(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [lens]: {
          ...prev[eye][lens],
          [field]: value
        }
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold text-gray-900">Add New Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-2xl">×</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Examination Type</label>
              <select
                value={formData.examinationType}
                onChange={(e) => setFormData({ ...formData, examinationType: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="routine">Routine</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="contact_lens">Contact Lens</option>
                <option value="follow_up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Eye Measurements Table */}
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h4 className="text-lg font-medium text-gray-900">Eye Measurements</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
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
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="SPH"
                        value={formData.right_eye.dv.sph || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'dv', 'sph', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="CYL"
                        value={formData.right_eye.dv.cyl || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'dv', 'cyl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="AXIS"
                        value={formData.right_eye.dv.axis || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'dv', 'axis', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2 border-r">
                      <input
                        type="text"
                        placeholder="V/A"
                        value={formData.right_eye.dv.va || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'dv', 'va', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    
                    {/* Left Eye DV */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="SPH"
                        value={formData.left_eye.dv.sph || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'dv', 'sph', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="CYL"
                        value={formData.left_eye.dv.cyl || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'dv', 'cyl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="AXIS"
                        value={formData.left_eye.dv.axis || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'dv', 'axis', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="V/A"
                        value={formData.left_eye.dv.va || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'dv', 'va', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                  </tr>
                  
                  {/* Add Row */}
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r">Add</td>
                    
                    {/* Right Eye Add */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="SPH"
                        value={formData.right_eye.nv.sph || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'nv', 'sph', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="CYL"
                        value={formData.right_eye.nv.cyl || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'nv', 'cyl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="AXIS"
                        value={formData.right_eye.nv.axis || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'nv', 'axis', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2 border-r">
                      <input
                        type="text"
                        placeholder="V/A"
                        value={formData.right_eye.nv.va || ''}
                        onChange={(e) => handleEyeDataChange('right_eye', 'nv', 'va', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    
                    {/* Left Eye Add */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="SPH"
                        value={formData.left_eye.nv.sph || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'nv', 'sph', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="CYL"
                        value={formData.left_eye.nv.cyl || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'nv', 'cyl', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="AXIS"
                        value={formData.left_eye.nv.axis || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'nv', 'axis', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="V/A"
                        value={formData.left_eye.nv.va || ''}
                        onChange={(e) => handleEyeDataChange('left_eye', 'nv', 'va', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Records = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { records, isLoading } = useSelector(state => state.records)
  const { customers } = useSelector(state => state.customers)
  const { hasPermission } = usePermissions()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchRecords())
    dispatch(fetchCustomers())
  }, [dispatch])

  const filteredRecords = records.filter(record =>
    record.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.examinationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateRecord = (recordData) => {
    dispatch(createRecord(recordData))
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage optometry examination records
          </p>
        </div>
        {hasPermission('records', 'create') && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search records by patient name, examination type, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Examination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.customer?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.customer?.age} years • {record.customer?.sex}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {record.examinationType.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {record.notes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/records/${record._id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {hasPermission('records', 'edit') && (
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('records', 'delete') && (
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Form Modal */}
      <RecordForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateRecord}
        customers={customers}
      />
    </div>
  )
}

export default withPermission(Records, 'records', 'view')