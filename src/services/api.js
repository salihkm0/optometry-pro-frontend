import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        })
        
        const { token, refreshToken: newRefreshToken } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  validateToken: (token) => 
    api.get('/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data),
  
  getProfile: () => 
    api.get('/auth/profile').then(res => res.data),
  
  updateProfile: (profileData) => 
    api.put('/auth/profile', profileData).then(res => res.data),
  
  changePassword: (passwordData) => 
    api.put('/auth/change-password', passwordData).then(res => res.data),
}

// Customer services
export const customerService = {
  getCustomers: (params = {}) => 
    api.get('/customers', { params }).then(res => res.data),
  
  getCustomerById: (id) => 
    api.get(`/customers/${id}`).then(res => res.data),
  
  createCustomer: (customerData) => 
    api.post('/customers', customerData).then(res => res.data),
  
  updateCustomer: (id, customerData) => 
    api.put(`/customers/${id}`, customerData).then(res => res.data),
  
  deleteCustomer: (id) => 
    api.delete(`/customers/${id}`).then(res => res.data),
  
  getCustomerStats: () => 
    api.get('/customers/stats').then(res => res.data),
}

// Record services
export const recordService = {
  getRecords: (params = {}) => 
    api.get('/records', { params }).then(res => res.data),
  
  getRecordById: (id) => 
    api.get(`/records/${id}`).then(res => res.data),
  
  createRecord: (recordData) => 
    api.post('/records', recordData).then(res => res.data),
  
  updateRecord: (id, recordData) => 
    api.put(`/records/${id}`, recordData).then(res => res.data),
  
  deleteRecord: (id) => 
    api.delete(`/records/${id}`).then(res => res.data),
  
  getCustomerRecords: (customerId) => 
    api.get(`/records/customer/${customerId}`).then(res => res.data),
  
  getRecordsStats: () => 
    api.get('/records/stats').then(res => res.data),
}

// User management services
export const userService = {
  getUsers: (params = {}) => 
    api.get('/user-management', { params }).then(res => res.data),
  
  getUserById: (id) => 
    api.get(`/user-management/${id}`).then(res => res.data),
  
  createUser: (userData) => 
    api.post('/user-management', userData).then(res => res.data),
  
  updateUser: (id, userData) => 
    api.put(`/user-management/${id}`, userData).then(res => res.data),
  
  deleteUser: (id) => 
    api.delete(`/user-management/${id}`).then(res => res.data),
  
  resetUserPassword: (id, newPassword) => 
    api.post(`/user-management/${id}/reset-password`, { newPassword }).then(res => res.data),
}

// Permission services
export const permissionService = {
  getUserPermissions: () => 
    api.get('/permissions/my-permissions').then(res => res.data),
  
  checkPermission: (module, action) => 
    api.get('/permissions/check-permission', { 
      params: { module, action } 
    }).then(res => res.data),
  
  checkPageAccess: (page) => 
    api.get('/permissions/check-page-access', { 
      params: { page } 
    }).then(res => res.data),
  
  getAvailablePermissions: () => 
    api.get('/permissions/available-permissions').then(res => res.data),
  
  updateRolePermissions: (shopId, role, permissions) => 
    api.put(`/permissions/shop/${shopId}/role/${role}`, permissions).then(res => res.data),
  
  getShopPermissions: (shopId) => 
    api.get(`/permissions/shop/${shopId}`).then(res => res.data),
  
  resetRolePermissions: (shopId, role) => 
    api.post(`/permissions/shop/${shopId}/role/${role}/reset`).then(res => res.data),
  
  initializeShopPermissions: (shopId) => 
    api.post(`/permissions/shop/${shopId}/initialize`).then(res => res.data),
}

// Shop services
export const shopService = {
  getShops: (params = {}) => 
    api.get('/shops', { params }).then(res => res.data),
  
  getMyShop: () => 
    api.get('/shops/my-shop').then(res => res.data),
  
  getShopById: (id) => 
    api.get(`/shops/${id}`).then(res => res.data),
  
  updateShop: (id, shopData) => 
    api.put(`/shops/${id}`, shopData).then(res => res.data),
  
  createShop: (shopData) => 
    api.post('/shops', shopData).then(res => res.data),
  
  updateShopStatus: (id, status) => 
    api.patch(`/shops/${id}/status`, { status }).then(res => res.data),
  
  getShopUsers: (id, params = {}) => 
    api.get(`/shops/${id}/users`, { params }).then(res => res.data),
}

// Admin services - UPDATED with proper shop creation
export const adminService = {
  getDashboardStats: () => 
    api.get('/admin/dashboard').then(res => res.data),
  
  getShops: (params = {}) => 
    api.get('/admin/shops', { params }).then(res => res.data),
  
  getShopById: (id) => 
    api.get(`/admin/shops/${id}`).then(res => res.data),
  
  updateShop: (id, shopData) => 
    api.put(`/admin/shops/${id}`, shopData).then(res => res.data),
  
  updateShopStatus: (id, status) => 
    api.patch(`/admin/shops/${id}/status`, { status }).then(res => res.data),
  
  // FIX: Use the correct endpoint based on your backend
  createShopWithOwner: (shopData) => 
    api.post('/admin/shops', shopData).then(res => res.data),
  
  // ADD: Alternative method using regular shops endpoint
  createShop: (shopData) => 
    api.post('/shops', shopData).then(res => res.data),
}

export default api