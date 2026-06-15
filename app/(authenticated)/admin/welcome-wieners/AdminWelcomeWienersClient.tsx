'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, LayoutDashboard } from 'lucide-react'
import { getWelcomeWieners } from 'app/lib/actions/welcome-wiener/getWelcomeWieners'
import Picture from 'app/components/common/Picture'

type Props = {
  welcomeWieners: Awaited<ReturnType<typeof getWelcomeWieners>>
}

export default function AdminWelcomeWienersClient({ welcomeWieners }: Props) {
  const wieners = Array.isArray(welcomeWieners) ? welcomeWieners : []

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
            Dashboard
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <h1 className="text-[9px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark" aria-current="page">
            Welcome Wieners
          </h1>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-[9px] font-mono tabular-nums text-muted-light dark:text-muted-dark">
            {wieners.length} wiener{wieners.length === 1 ? '' : 's'}
          </span>
          <Link
            href="/admin/welcome-wieners/new"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark text-[9px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <Plus size={11} aria-hidden="true" />
            Add Wiener
          </Link>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 py-6">
        {/* ── Table ── */}
        <div className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-x-auto">
          <table className="w-full text-left" aria-label="Welcome Wieners">
            <caption className="sr-only">Welcome Wiener profiles and their donation products</caption>
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                {['Dog', 'Age', 'Products', 'Status', ''].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-2.5 text-[9px] font-mono tracking-[0.2em] uppercase font-normal text-muted-light dark:text-muted-dark whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {wieners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">No welcome wieners yet</p>
                    <Link
                      href={`/admin/welcome-wieners/new`}
                      className="mt-3 text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus:outline-none focus-visible:underline"
                    >
                      Add the first one →
                    </Link>
                  </td>
                </tr>
              ) : (
                wieners.map((wiener, i) => (
                  <motion.tr
                    key={wiener.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.4) }}
                    className="group hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors"
                  >
                    {/* Dog */}
                    <td className="px-4 py-2.5 min-w-0">
                      <div className="flex items-center gap-3">
                        {wiener.images[0] ? (
                          <Picture
                            priority={false}
                            src={wiener.images[0]}
                            alt=""
                            className="w-8 h-8 object-cover border border-border-light dark:border-border-dark shrink-0"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark shrink-0 flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">?</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-nunito text-text-light dark:text-text-dark truncate">
                            {wiener.name ?? <span className="text-muted-light dark:text-muted-dark italic">Unnamed</span>}
                          </p>
                          {wiener.bio && (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate max-w-45">{wiener.bio}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">{wiener.age ?? '—'}</td>

                    <td className="px-4 py-2.5 text-xs font-mono tabular-nums text-muted-light dark:text-muted-dark">
                      {(wiener.associatedProducts as any[])?.length ?? 0}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.15em] uppercase ${
                          wiener.archivedAt
                            ? 'text-muted-light dark:text-muted-dark'
                            : wiener.isLive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 shrink-0 ${
                            wiener.archivedAt ? 'bg-border-light dark:bg-border-dark' : wiener.isLive ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          aria-hidden="true"
                        />
                        {wiener.archivedAt ? 'Archived' : wiener.isLive ? 'Live' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/welcome-wieners/${wiener.id}`}
                        className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                        aria-label={`Edit ${wiener.name ?? 'wiener'}`}
                      >
                        Edit →
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
