'use client'

import { motion } from 'framer-motion'
import { Dog, RefreshCw, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'

interface RescueGroupsCardProps {
  lastSynced?: Date | null
  dogCount?: number
  status?: 'connected' | 'error' | 'syncing'
}

export default function RescueGroupsCard({ lastSynced = new Date(), dogCount = 0, status = 'connected' }: RescueGroupsCardProps) {
  const statusConfig = {
    connected: {
      label: 'Connected',
      icon: CheckCircle2,
      className: 'text-green-600 dark:text-green-400',
      dot: 'bg-green-500'
    },
    error: {
      label: 'Error',
      icon: AlertCircle,
      className: 'text-red-500 dark:text-red-400',
      dot: 'bg-red-500'
    },
    syncing: {
      label: 'Syncing',
      icon: RefreshCw,
      className: 'text-primary-light dark:text-primary-dark',
      dot: 'bg-primary-light dark:bg-primary-dark'
    }
  }

  const s = statusConfig[status]

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Rescue Groups integration status"
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/20 dark:border-primary-dark/20 flex items-center justify-center shrink-0">
            <Dog size={14} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-mono font-black tracking-wide text-text-light dark:text-text-dark leading-none">Rescue Groups</p>
            <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-0.5">Integration</p>
          </div>
        </div>

        {/* Status pill */}
        <div className={`flex items-center gap-1.5 ${s.className}`} role="status" aria-label={`Integration status: ${s.label}`}>
          {status === 'syncing' ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} aria-hidden="true">
              <RefreshCw size={11} />
            </motion.span>
          ) : (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className={`block w-1.5 h-1.5 ${s.dot}`}
              aria-hidden="true"
            />
          )}
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase">{s.label}</span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
        <div className="bg-bg-light dark:bg-bg-dark px-5 py-4">
          <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">Dogs Synced</p>
          <p className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark">{dogCount}</p>
        </div>
        <div className="bg-bg-light dark:bg-bg-dark px-5 py-4">
          <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">Last Synced</p>
          <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-snug">
            {lastSynced
              ? new Date(lastSynced).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '—'}
          </p>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 px-4 py-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          disabled={status === 'syncing'}
          aria-label="Sync dogs from Rescue Groups"
          className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono tracking-[0.2em] uppercase border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw size={11} aria-hidden="true" />
          Sync Now
        </motion.button>

        <a
          href="https://app.rescuegroups.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Rescue Groups dashboard (opens in new tab)"
          className="flex items-center gap-2 px-3 py-2 text-[9px] font-mono tracking-[0.2em] uppercase border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <ExternalLink size={11} aria-hidden="true" />
          Open Dashboard
        </a>
      </div>
    </motion.article>
  )
}
