import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import customerReducer from './slices/customerSlice'
import recordReducer from './slices/recordSlice'
import permissionReducer from './slices/permissionSlice'
import shopReducer from './slices/shopSlice' // ADD THIS

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    customers: customerReducer,
    records: recordReducer,
    permissions: permissionReducer,
    shops: shopReducer, // ADD THIS
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store