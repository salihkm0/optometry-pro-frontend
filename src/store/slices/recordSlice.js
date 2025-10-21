import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { recordService } from '../../services/api'

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (params, { rejectWithValue }) => {
    try {
      const response = await recordService.getRecords(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch records')
    }
  }
)

export const fetchCustomerRecords = createAsyncThunk(
  'records/fetchCustomerRecords',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await recordService.getCustomerRecords(customerId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer records')
    }
  }
)

export const fetchRecordById = createAsyncThunk(
  'records/fetchRecordById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await recordService.getRecordById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch record')
    }
  }
)

export const createRecord = createAsyncThunk(
  'records/createRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await recordService.createRecord(recordData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create record')
    }
  }
)

export const updateRecord = createAsyncThunk(
  'records/updateRecord',
  async ({ id, recordData }, { rejectWithValue }) => {
    try {
      const response = await recordService.updateRecord(id, recordData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update record')
    }
  }
)

export const deleteRecord = createAsyncThunk(
  'records/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await recordService.deleteRecord(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete record')
    }
  }
)

export const getRecordsStats = createAsyncThunk(
  'records/getRecordsStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recordService.getRecordsStats()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch records stats')
    }
  }
)

const recordSlice = createSlice({
  name: 'records',
  initialState: {
    records: [],
    currentRecord: null,
    customerRecords: [],
    isLoading: false,
    error: null,
    stats: {},
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload
    },
    setCustomerRecords: (state, action) => {
      state.customerRecords = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.isLoading = false
        state.records = action.payload.records
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchCustomerRecords.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCustomerRecords.fulfilled, (state, action) => {
        state.isLoading = false
        state.customerRecords = action.payload.records || []
      })
      .addCase(fetchCustomerRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchRecordById.fulfilled, (state, action) => {
        state.currentRecord = action.payload
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.records.unshift(action.payload.record)
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(record => record._id === action.payload.record._id)
        if (index !== -1) {
          state.records[index] = action.payload.record
        }
        if (state.currentRecord && state.currentRecord._id === action.payload.record._id) {
          state.currentRecord = action.payload.record
        }
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(record => record._id !== action.payload)
        state.customerRecords = state.customerRecords.filter(record => record._id !== action.payload)
        if (state.currentRecord && state.currentRecord._id === action.payload) {
          state.currentRecord = null
        }
      })
      .addCase(getRecordsStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { clearError, setCurrentRecord, setCustomerRecords } = recordSlice.actions
export default recordSlice.reducer