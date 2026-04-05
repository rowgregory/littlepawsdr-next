'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, Search, X, FileText, ExternalLink, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from '../common/Pagination'
import { formatDate } from 'app/utils/date.utils'
import AdminPageHeader from '../common/AdminPageHeader'
import { Newsletter, NewsletterIssue } from '@prisma/client'
import { store } from 'app/lib/store/store'
import { setOpenCreateAdminNewsletterIssueModal } from 'app/lib/store/slices/uiSlice'

const PAGE_SIZE = 20

const TABS = [
  { id: 'subscribers', label: 'Subscribers' },
  { id: 'issues', label: 'Issues' }
] as const

type Tab = (typeof TABS)[number]['id']

export default function AdminNewsletterPageClient({ newsletters, issues }: { newsletters: Newsletter[]; issues: NewsletterIssue[] }) {
  const [tab, setTab] = useState<Tab>('subscribers')
  return (
    <>
      <AdminPageHeader label="Admin" title="Newsletters" description="View and manage newsletter subscribers" />
      <div>
        {/* Tabs */}
        <div className="border-b border-border-light dark:border-border-dark px-4 xs:px-5 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center gap-0" role="tablist" aria-label="Newsletter sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-[10px] font-mono tracking-[0.2em] uppercase border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                  tab === t.id
                    ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
                    : 'border-transparent text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        <div id="panel-subscribers" role="tabpanel" aria-label="Subscribers" hidden={tab !== 'subscribers'}>
          <AdminNewsletterClient newsletters={newsletters} />
        </div>
        <div id="panel-issues" role="tabpanel" aria-label="Issues" hidden={tab !== 'issues'}>
          <AdminNewsletterIssuesClient issues={issues} />
        </div>
      </div>
    </>
  )
}

export function AdminNewsletterClient({ newsletters }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return newsletters
    return newsletters.filter((n) => n.newsletterEmail.toLowerCase().includes(search.toLowerCase()))
  }, [newsletters, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCopyAll = async () => {
    const emails = filtered.map((n) => n.newsletterEmail).join(', ')
    await navigator.clipboard.writeText(emails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 py-8">
      {/* Toolbar */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 mb-6">
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
            placeholder="Search subscribers..."
            aria-label="Search newsletter subscribers"
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

        {/* Stats + Copy */}
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark whitespace-nowrap">
            {filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleCopyAll}
            disabled={filtered.length === 0}
            aria-label={copied ? 'Emails copied to clipboard' : 'Copy all emails to clipboard as comma-separated list'}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy All Emails'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border-light dark:border-border-dark overflow-hidden" role="region" aria-label="Newsletter subscribers table">
        {/* Column headers */}
        <div
          className="hidden sm:grid sm:grid-cols-[1fr_180px] px-5 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Email</span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Subscribed</span>
        </div>

        {/* Rows */}
        <ul role="list" aria-label="Newsletter subscriber list">
          <AnimatePresence mode="popLayout">
            {paginated.length === 0 ? (
              <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 py-12 text-center">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  {search ? 'No subscribers match your search' : 'No subscribers yet'}
                </p>
              </motion.li>
            ) : (
              paginated.map((n, i) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`grid grid-cols-1 sm:grid-cols-[1fr_180px] items-center px-5 py-4 border-b border-border-light dark:border-border-dark last:border-b-0 transition-colors ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <span className="text-xs font-mono text-text-light dark:text-text-dark truncate" title={n.newsletterEmail}>
                    {n.newsletterEmail}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-muted-light dark:text-muted-dark mt-1 sm:mt-0">
                    {formatDate(new Date(n.createdAt))}
                  </span>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>

        {/* Pagination */}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPage={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />}
      </div>
    </div>
  )
}

export function AdminNewsletterIssuesClient({ issues }: { issues: NewsletterIssue[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
          {issues.length} issue{issues.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => store.dispatch(setOpenCreateAdminNewsletterIssueModal())}
          aria-label="Create new newsletter issue"
          className="inline-flex items-center gap-2 px-3 py-2 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Plus size={11} aria-hidden="true" />
          New Issue
        </button>
      </div>

      {/* Table */}
      <div className="border border-border-light dark:border-border-dark overflow-hidden" role="region" aria-label="Newsletter issues">
        {/* Column headers */}
        <div
          className="hidden sm:grid sm:grid-cols-[1fr_160px_120px] px-5 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Issue</span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Published</span>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">PDF</span>
        </div>

        <ul role="list" aria-label="Newsletter issue list">
          <AnimatePresence mode="popLayout">
            {issues.length === 0 ? (
              <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 py-12 text-center">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">No issues published yet</p>
              </motion.li>
            ) : (
              issues.map((issue, i) => (
                <motion.li
                  key={issue.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`grid grid-cols-1 sm:grid-cols-[1fr_160px_120px] items-center px-5 py-4 border-b border-border-light dark:border-border-dark last:border-b-0 gap-1 sm:gap-0 ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-text-light dark:text-text-dark font-medium truncate">{issue.title}</p>
                    {issue.description && (
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5 truncate">{issue.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-muted-light dark:text-muted-dark">
                    {formatDate(new Date(issue.publishedAt))}
                  </span>

                  <a
                    href={issue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${issue.title} PDF in new tab`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    <FileText size={11} aria-hidden="true" />
                    Open PDF
                    <ExternalLink size={10} aria-hidden="true" />
                  </a>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}
