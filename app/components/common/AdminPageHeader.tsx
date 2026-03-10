'use client'

import { motion } from 'framer-motion'

interface AdminPageHeaderProps {
  label: string
  title: string
  description?: string
  children?: React.ReactNode // for action buttons
}

export default function AdminPageHeader({ label, title, description, children }: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-5 bg-bg-light dark:bg-bg-dark"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{label}</p>
          </div>
          <h1 className="font-quicksand font-black text-2xl sm:text-3xl text-text-light dark:text-text-dark leading-tight">{title}</h1>
          {description && <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">{description}</p>}
        </div>

        {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
      </div>
    </motion.div>
  )
}
