/** Formats a date as "Jan 1, 2026", optionally with time as "Jan 1, 2026, 12:00 PM" */
export function formatDate(date: Date | string, includeTime = false) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(includeTime && { hour: 'numeric', minute: '2-digit', hour12: true })
  })
}

/** Formats a date as "Jan 1, 2026, 12:00 PM" — shorthand for formatDate(date, true) */
export function formatDateTime(date: Date | string) {
  return formatDate(date, true)
}

/** Formats a date as "12:00 PM" or "12:00:00 PM" with optional seconds */
export function formatTime(date: Date | string, includeSeconds = false) {
  return new Date(date).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
    hour12: true
  })
}

/** Returns the number of days remaining until a given end date (rounded up) */
export function getDaysRemaining(endDate: Date | string) {
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/** Converts a date to the YYYY-MM-DD format required by HTML input[type="date"] */
export function formatDateForInput(date: Date | string | number | boolean | null | undefined): string {
  if (!date || typeof date === 'boolean' || typeof date === 'number') return ''
  try {
    const d = new Date(date as Date | string)
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

/** Converts a date to the YYYY-MM-DDTHH:MM format required by HTML input[type="datetime-local"] */
export function toDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
