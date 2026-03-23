'use client'

import { useSession } from 'next-auth/react'

export function SignedInRow() {
  const session = useSession()
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className="shrink-0 w-6 h-6 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30"
        aria-hidden="true"
      >
        <span className="text-[9px] font-mono font-bold text-primary-light dark:text-primary-dark uppercase">{session.data.user.email[0]}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Signed in as</p>
        <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{session.data.user.email}</p>
      </div>
      <div className="shrink-0 ml-auto w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
    </div>
  )
}
