import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateToken } from '../store/slices/authSlice'
import { fetchUserPermissions } from '../store/slices/permissionSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !isAuthenticated && !isLoading) {
      dispatch(validateToken())
        .unwrap()
        .then(() => {
          dispatch(fetchUserPermissions())
        })
        .catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        })
    }
  }, [dispatch, isAuthenticated, isLoading])

  return {
    isAuthenticated,
    user,
    isLoading
  }
}