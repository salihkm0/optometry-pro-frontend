import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { permissionService } from '../../services/api'

export const fetchUserPermissions = createAsyncThunk(
  'permissions/fetchUserPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionService.getUserPermissions()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch permissions')
    }
  }
)

// ADD THIS: Fetch shop permissions
export const fetchShopPermissions = createAsyncThunk(
  'permissions/fetchShopPermissions',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await permissionService.getShopPermissions(shopId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shop permissions')
    }
  }
)

export const checkPermission = createAsyncThunk(
  'permissions/checkPermission',
  async ({ module, action }, { rejectWithValue }) => {
    try {
      const response = await permissionService.checkPermission(module, action)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Permission check failed')
    }
  }
)

export const checkPageAccess = createAsyncThunk(
  'permissions/checkPageAccess',
  async (page, { rejectWithValue }) => {
    try {
      const response = await permissionService.checkPageAccess(page)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Page access check failed')
    }
  }
)

export const getAvailablePermissions = createAsyncThunk(
  'permissions/getAvailablePermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionService.getAvailablePermissions()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available permissions')
    }
  }
)

const permissionSlice = createSlice({
  name: 'permissions',
  initialState: {
    userPermissions: {},
    accessiblePages: [],
    shopPermissions: [], // ADD THIS: Store shop-specific permissions
    availablePages: [
      'dashboard',
      'customers',
      'records',
      'appointments',
      'billing',
      'inventory',
      'reports',
      'settings',
      'users',
      'permissions',
      'analytics',
      'notifications',
      'help'
    ],
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'manage'],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload.permissions || {}
      state.accessiblePages = action.payload.accessiblePages || []
    },
    // ADD THIS: Set shop permissions
    setShopPermissions: (state, action) => {
      state.shopPermissions = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.userPermissions = action.payload.permissions || {}
        state.accessiblePages = action.payload.accessiblePages || []
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(fetchShopPermissions.fulfilled, (state, action) => {
        state.shopPermissions = action.payload.permissions || []
      })
      .addCase(getAvailablePermissions.fulfilled, (state, action) => {
        state.availablePages = action.payload.availablePages || state.availablePages
        state.availableActions = action.payload.availableActions || state.availableActions
      })
  },
})

export const { clearError, setUserPermissions, setShopPermissions } = permissionSlice.actions
export default permissionSlice.reducer