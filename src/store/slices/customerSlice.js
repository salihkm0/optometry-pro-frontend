import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { customerService } from '../../services/api'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers')
    }
  }
)

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer')
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(customerData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer')
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(id, customerData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer')
    }
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete customer')
    }
  }
)

export const getCustomerStats = createAsyncThunk(
  'customers/getCustomerStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerStats()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer stats')
    }
  }
)

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    currentCustomer: null,
    isLoading: false,
    error: null,
    stats: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload.customers
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.currentCustomer = action.payload
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload.customer)
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(customer => customer._id === action.payload.customer._id)
        if (index !== -1) {
          state.customers[index] = action.payload.customer
        }
        if (state.currentCustomer && state.currentCustomer._id === action.payload.customer._id) {
          state.currentCustomer = action.payload.customer
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer._id !== action.payload)
        if (state.currentCustomer && state.currentCustomer._id === action.payload) {
          state.currentCustomer = null
        }
      })
      .addCase(getCustomerStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { clearError, setCurrentCustomer } = customerSlice.actions
export default customerSlice.reducer