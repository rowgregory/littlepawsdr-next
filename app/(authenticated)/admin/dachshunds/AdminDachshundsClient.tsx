'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dog, ExternalLink, LayoutDashboard } from 'lucide-react'
import Picture from '../../../components/common/Picture'
import { formatDate } from 'app/utils/date.utils'
import Link from 'next/link'

type Tab = 'Available' | 'Hold'

function formatQuality(quality: string): string {
  return quality
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim()
}

export default function AdminDachshundsClient({ available, hold }: { available: any[]; hold: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('Available')

  const tabData = { Available: available, Hold: hold }
  const filtered = tabData[activeTab]
  const counts = { Available: available?.length ?? 0, Hold: hold?.length ?? 0 }

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between">
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
            Dachshunds
          </h1>
        </nav>

        <span className="shrink-0 text-[9px] font-mono tabular-nums text-muted-light dark:text-muted-dark">
          {counts.Available + counts.Hold} dogs · synced from Rescue Groups
        </span>
      </header>

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Filter dachshunds by status"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit"
        >
          {(['Available', 'Hold'] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                activeTab === tab
                  ? 'text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'
                  : 'text-muted-light dark:text-muted-dark bg-surface-light dark:bg-surface-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              {tab}
              <span className="ml-2 text-primary-light dark:text-primary-dark tabular-nums">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-x-auto"
        >
          <table className="w-full text-left" aria-label={`${activeTab} dachshunds`}>
            <caption className="sr-only">{activeTab} dachshunds synced from Rescue Groups</caption>
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                {['Dog', 'Age', 'Sex', 'Breed', 'Added', ''].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-2.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark font-normal whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="divide-y divide-border-light dark:divide-border-dark"
            >
              {filtered?.length > 0 ? (
                filtered.map((dog) => (
                  <tr key={dog?.id} className="group hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors">
                    {/* Dog name + photo */}
                    <td className="px-4 py-3 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 overflow-hidden border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
                          {dog?.attributes?.photos ? (
                            <Picture src={dog?.attributes?.photos[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                              <Dog size={14} className="text-muted-light dark:text-muted-dark" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-snug">
                            {dog?.attributes?.name ?? '—'}
                          </p>
                          {dog?.attributes?.qualities?.length > 0 && (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5 truncate">
                              {dog.attributes.qualities.slice(0, 3).map(formatQuality).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                      {dog?.attributes?.ageGroup ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                      {dog?.attributes?.sex ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                      {dog?.attributes?.breedString ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                      {formatDate(dog?.attributes?.createdDate)}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://rescuegroups.org/manage/animal?animalID=${dog?.id}`}
                        aria-label={`Open ${dog?.attributes?.name ?? 'dog'} in Rescue Groups`}
                        className="inline-flex p-1.5 text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    No {activeTab.toLowerCase()} dogs
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
