'use client'

import { useState, useMemo } from 'react'
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from '../common/Pagination'
import { formatDate } from 'app/utils/date.utils'
import { JsonValue } from '@prisma/client/runtime/library'
import AdminPageHeader from '../common/AdminPageHeader'

const PAGE_SIZE = 50

type Log = {
  id: string
  level: string
  message: string
  metadata: JsonValue
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

const LEVELS = ['all', 'info', 'warn', 'error', 'debug'] as const

const levelStyles: Record<string, string> = {
  info: 'text-primary-light dark:text-primary-dark',
  warn: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
  debug: 'text-muted-light dark:text-muted-dark'
}

function LogRow({ log, index }: { log: Log; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const parsedMetadata = useMemo(() => {
    if (!log.metadata) return null
    try {
      const parsed = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata
      if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, unknown>
      return null
    } catch {
      return null
    }
  }, [log.metadata])

  const hasMetadata = parsedMetadata !== null && Object.keys(parsedMetadata).length > 0

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={`border-b border-border-light dark:border-border-dark last:border-b-0 ${
        index % 2 === 0 ? 'bg-transparent' : 'bg-surface-light dark:bg-surface-dark'
      }`}
    >
      <button
        onClick={() => hasMetadata && setExpanded((v) => !v)}
        aria-expanded={hasMetadata ? expanded : undefined}
        aria-label={`Log entry: ${log.message}`}
        disabled={!hasMetadata}
        className="w-full grid grid-cols-[20px_80px_140px_1fr_120px] items-center gap-3 px-5 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:cursor-default"
      >
        {/* Expand icon */}
        <span className="text-muted-light dark:text-muted-dark" aria-hidden="true">
          {hasMetadata ? expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} /> : null}
        </span>

        {/* Level */}
        <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${levelStyles[log.level] ?? 'text-muted-light dark:text-muted-dark'}`}>
          {log.level}
        </span>

        {/* Timestamp */}
        <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
          {formatDate(new Date(log.createdAt), true)}
        </span>

        {/* Message */}
        <span className="text-xs font-mono text-text-light dark:text-text-dark truncate">{log.message}</span>

        {/* User */}
        <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate text-right">{log.userId ?? '—'}</span>
      </button>

      {/* Metadata */}
      <AnimatePresence>
        {expanded && hasMetadata && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="px-5 pb-4 pt-0 text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed overflow-x-auto bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
              {JSON.stringify(log.metadata as Record<string, unknown>, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function AdminLogsClient({ logs }: { logs: Log[] }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<string>('all')

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = level === 'all' || log.level === level
      const matchesSearch =
        !search.trim() ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.userId?.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(log.metadata ?? {})
          .toLowerCase()
          .includes(search.toLowerCase())
      return matchesLevel && matchesSearch
    })
  }, [logs, search, level])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleLevel = (val: string) => {
    setLevel(val)
    setPage(1)
  }

  const counts = useMemo(() => {
    return LEVELS.reduce(
      (acc, l) => {
        acc[l] = l === 'all' ? logs.length : logs.filter((log) => log.level === l).length
        return acc
      },
      {} as Record<string, number>
    )
  }, [logs])

  return (
    <>
      <AdminPageHeader label="Admin" title="Logs" description="System logs and error tracking" />
      <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search logs..."
              aria-label="Search logs"
              className="w-full pl-8 pr-8 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-[10px] font-mono tracking-[0.2em] text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={11} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Level filters */}
          <div className="flex items-center gap-1" role="group" aria-label="Filter by log level">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => handleLevel(l)}
                aria-pressed={level === l}
                className={`px-3 py-2 text-[10px] font-mono tracking-[0.2em] uppercase border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                  level === l
                    ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark text-white dark:text-bg-dark'
                    : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40'
                }`}
              >
                {l} {counts[l] > 0 && <span className="ml-1 opacity-60">{counts[l]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border border-border-light dark:border-border-dark overflow-hidden" role="region" aria-label="System logs">
          {/* Column headers */}
          <div
            className="hidden sm:grid sm:grid-cols-[20px_80px_140px_1fr_120px] gap-3 px-5 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            aria-hidden="true"
          >
            <span />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Level</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Time</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Message</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark text-right">User</span>
          </div>

          <ul role="list" aria-label="Log entries">
            <AnimatePresence mode="popLayout">
              {paginated.length === 0 ? (
                <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 py-12 text-center">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">No logs found</p>
                </motion.li>
              ) : (
                paginated.map((log, i) => <LogRow key={log.id} log={log} index={i} />)
              )}
            </AnimatePresence>
          </ul>

          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />}
        </div>
      </div>
    </>
  )
}
