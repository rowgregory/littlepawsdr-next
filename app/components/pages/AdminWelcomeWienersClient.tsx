'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { getWelcomeWieners } from 'app/lib/actions/getWelcomeWieners'
import AdminPageHeader from '../common/AdminPageHeader'
import Picture from '../common/Picture'
import { store } from 'app/lib/store/store'
import { setOpenWelcomeWienerDrawer } from 'app/lib/store/slices/uiSlice'
import { setInputs } from 'app/lib/store/slices/formSlice'

type Props = {
  welcomeWieners: Awaited<ReturnType<typeof getWelcomeWieners>>
}

export default function AdminWelcomeWienersClient({ welcomeWieners }: Props) {
  const wieners = Array.isArray(welcomeWieners) ? welcomeWieners : []

  return (
    <>
      <AdminPageHeader label="Admin" title="Welcome Wieners" description="Manage dachshund profiles and their associated donation products" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="border border-border-light dark:border-border-dark overflow-hidden">
          {/* ── Toolbar ── */}
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark shrink-0">
              All Wieners
              <span className="ml-2 text-primary-light dark:text-primary-dark">{wieners.length}</span>
            </p>

            <motion.button
              onClick={() => store.dispatch(setOpenWelcomeWienerDrawer())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add Wiener
            </motion.button>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Welcome Wieners list">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  {['Dog', 'Age', 'Products', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wieners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">No welcome wieners yet</p>
                      <button
                        onClick={() => store.dispatch(setOpenWelcomeWienerDrawer())}
                        className="mt-3 text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus:outline-none focus-visible:underline"
                      >
                        Add the first one →
                      </button>
                    </td>
                  </tr>
                ) : (
                  wieners.map((wiener, i) => (
                    <motion.tr
                      key={wiener.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="border-b border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 group"
                    >
                      {/* Dog */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {wiener.images[0] ? (
                            <Picture
                              priority={true}
                              src={wiener.images[0]}
                              alt={wiener.name ?? 'Dog photo'}
                              className="w-8 h-8 object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shrink-0 flex items-center justify-center">
                              <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">?</span>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-mono text-text-light dark:text-text-dark">
                              {wiener.name ?? <span className="text-muted-light dark:text-muted-dark italic">Unnamed</span>}
                            </p>
                            {wiener.bio && (
                              <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate max-w-45">{wiener.bio}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Age */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{wiener.age ?? '—'}</span>
                      </td>

                      {/* Products */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-muted-light dark:text-muted-dark">
                          {(wiener.associatedProducts as any[])?.length ?? 0}
                        </span>
                      </td>

                      {/* Live status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.15em] uppercase ${
                            wiener.isLive ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              wiener.isLive ? 'bg-primary-light dark:bg-primary-dark' : 'bg-border-light dark:bg-border-dark'
                            }`}
                            aria-hidden="true"
                          />
                          {wiener.isLive ? 'Live' : 'Draft'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            store.dispatch(setInputs({ formName: 'welcomeWienerForm', data: { ...wiener, isUpdating: true } }))
                            store.dispatch(setOpenWelcomeWienerDrawer())
                          }}
                          className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:underline"
                          aria-label={`Edit ${wiener.name ?? 'wiener'}`}
                        >
                          Edit →
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
