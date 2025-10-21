import { format, parseISO } from 'date-fns'

export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '-'
  try {
    return format(parseISO(dateString), formatString)
  } catch {
    return '-'
  }
}

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy HH:mm')
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  // Simple phone formatting - you can enhance this based on your needs
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}