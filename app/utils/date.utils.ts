export function formatDate(date: Date | string, includeTime = false) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime && {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  })
}

export function getDaysRemaining(endDate: Date) {
  const now = new Date()
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

/**
 * Converts a Date object or ISO string to the format required by HTML input type="date" (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string | number | boolean | null | undefined): string => {
  if (!date || typeof date === 'boolean' || typeof date === 'number') return ''

  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return ''
    return dateObj.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export function toDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}
