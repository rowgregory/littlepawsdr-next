export const PAGE_SIZE = 50

export const LEVELS = ['all', 'info', 'warn', 'error', 'debug'] as const

export const levelStyles: Record<string, string> = {
  info: 'text-primary-light dark:text-primary-dark',
  warn: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
  debug: 'text-muted-light dark:text-muted-dark'
}
