import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { shopService } from '../../services/api'

export const fetchShops = createAsyncThunk(
  'shops/fetchShops',
  async (params, { rejectWithValue }) => {
    try {
      const response = await shopService.getShops(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shops')
    }
  }
)

export const fetchMyShop = createAsyncThunk(
  'shops/fetchMyShop',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopService.getMyShop()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shop')
    }
  }
)

const shopSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: [],
    currentShop: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentShop: (state, action) => {
      state.currentShop = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false
        state.shops = action.payload.shops || []
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchMyShop.fulfilled, (state, action) => {
        state.currentShop = action.payload
      })
  },
})

export const { clearError, setCurrentShop } = shopSlice.actions
export default shopSlice.reducer