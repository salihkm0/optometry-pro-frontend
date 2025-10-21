import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../../services/api'

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
    }
  }
)

export const resetUserPassword = createAsyncThunk(
  'users/resetUserPassword',
  async ({ id, newPassword }, { rejectWithValue }) => {
    try {
      const response = await userService.resetUserPassword(id, newPassword)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload.user)
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload.user._id)
        if (index !== -1) {
          state.users[index] = action.payload.user
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        // Password reset successful - you can add any specific handling here
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError, setCurrentUser } = userSlice.actions
export default userSlice.reducer