'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dog, ExternalLink } from 'lucide-react'
import Picture from '../common/Picture'
import AdminPageHeader from '../common/AdminPageHeader'
import { formatDate } from 'app/utils/date.utils'

type Tab = 'Available' | 'Hold'

export default function AdminDachshundsClient({ available, hold }) {
  const [activeTab, setActiveTab] = useState<Tab>('Available')
  const tabData = {
    Available: available,
    Hold: hold
  }

  const filtered = tabData[activeTab]
  const counts = {
    Available: available?.length,
    Hold: hold?.length
  }

  return (
    <>
      <AdminPageHeader label="Admin" title="Dachshunds" description="Manage adoptable dogs synced from Rescue Groups" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Filter dachshunds by status"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6 relative"
        >
          {(['Available', 'Hold'] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
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
              <span className="ml-2 text-primary-light dark:text-primary-dark">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="border border-border-light dark:border-border-dark overflow-hidden"
        >
          {/* Table header */}
          <div className="px-5 py-3.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              {activeTab}
              <span className="ml-2 text-primary-light dark:text-primary-dark">{filtered?.length}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label={`${activeTab} dachshunds`}>
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  {['Dog', 'Age', 'Sex', 'Breed', 'Added', ''].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                {filtered?.length > 0 ? (
                  filtered?.map((dog) => {
                    function formatQuality(quality: string): string {
                      return quality
                        .replace(/([A-Z])/g, ' $1')
                        .toLowerCase()
                        .trim()
                    }
                    return (
                      <tr
                        key={dog?.id}
                        className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150"
                      >
                        {/* Dog name + photo */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 shrink-0 overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                              {dog?.attributes?.photos ? (
                                <Picture
                                  src={dog?.attributes?.photos[0]}
                                  alt={dog?.attributes?.name ?? 'Dog'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Dog size={14} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
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

                        {/* Age */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{dog?.attributes?.ageGroup ?? '—'}</span>
                        </td>

                        {/* Sex */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{dog?.attributes?.sex ?? '—'}</span>
                        </td>

                        {/* Color */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{dog?.attributes?.breedString ?? '—'}</span>
                        </td>

                        {/* Added */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{formatDate(dog?.attributes?.createdDate)}</span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <a
                            target="_blank"
                            href={`https://rescuegroups.org/manage/animal?animalID=${dog?.id}`}
                            aria-label={`Open details for ${dog?.attributes?.name ?? 'dog'}`}
                            className="block p-2 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark border border-transparent hover:border-primary-light/30 dark:hover:border-primary-dark/30 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                          >
                            <ExternalLink size={15} aria-hidden="true" />
                          </a>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <p className="text-sm font-mono text-muted-light dark:text-muted-dark">No {activeTab.toLowerCase()} dogs found.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
