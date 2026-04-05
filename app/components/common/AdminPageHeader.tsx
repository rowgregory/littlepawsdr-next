'use client'

import { useCountdown } from '@hooks/useCountdown'
import { motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface AdminPageHeaderProps {
  label: string
  title: string
  description?: string
  bypassCode?: string
  nextRotationAt?: Date
  children?: React.ReactNode // for action buttons
}

export default function AdminPageHeader({ label, title, description, bypassCode, nextRotationAt, children }: AdminPageHeaderProps) {
  const [copied, setCopied] = useState(false)

  const { days, hours, minutes, seconds, done } = useCountdown(nextRotationAt ? new Date(nextRotationAt) : new Date())

  const handleCopy = async () => {
    if (!bypassCode) return
    await navigator.clipboard.writeText(bypassCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 bg-bg-light dark:bg-bg-dark"
      style={{ height: '70.5px' }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left — label + title */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark leading-none mb-1">{label}</p>
            <h1 className="font-quicksand font-black text-lg sm:text-xl text-text-light dark:text-text-dark leading-none truncate">{title}</h1>
            {description && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-1 truncate">{description}</p>}
          </div>
        </div>

        {/* Right — bypass code + children */}
        <div className="flex items-center gap-4 shrink-0">
          {bypassCode && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleCopy}
                aria-label={copied ? 'Bypass code copied' : 'Copy bypass code to clipboard'}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                {copied ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy Bypass Code'}
              </button>
              {nextRotationAt && (
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  {done ? 'Rotating soon' : `Rotates in ${days}d ${hours}h ${minutes}m ${seconds}s`}
                </p>
              )}
            </div>
          )}

          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
      </div>
    </motion.div>
  )
}
