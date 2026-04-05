import { store } from 'app/lib/store/store'
import { updateAuction } from 'app/lib/actions/updateAuction'
import { useRouter } from 'next/navigation'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { IAuction } from 'types/entities/auction'
import { ChangeEvent, useState } from 'react'
import { toDatetimeLocal } from 'app/utils/date.utils'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteAuction } from 'app/lib/actions/deleteAuction'

const inputStyles = `w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors scheme-light dark:scheme-dark`

export function AdminAuctionSettingsTab({ auction }: { auction: IAuction }) {
  const router = useRouter()
  const [inputs, setInputs] = useState(auction)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleInput = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleDeleteAuction = async () => {
    setDeleting(true)

    const result = await deleteAuction(inputs.id)

    setDeleting(false)

    if (!result.success) {
      store.dispatch(
        showToast({
          message: 'Failed to delete auction',
          description: result.error ?? 'Something went wrong. Please try again.'
        })
      )
      return
    }

    store.dispatch(
      showToast({
        message: 'Auction deleted',
        description: `"${inputs.title}" has been permanently deleted.`
      })
    )

    router.push('/admin/auctions')
  }
  const handleSaveAuctionSettings = async () => {
    setLoading(true)

    const result = await updateAuction(inputs.id, {
      title: inputs.title,
      goal: inputs.goal,
      customAuctionLink: inputs.customAuctionLink ?? '',
      startDate: new Date(inputs.startDate),
      endDate: new Date(inputs.endDate)
    })

    setLoading(false)

    if (!result.success) {
      store.dispatch(
        showToast({
          message: 'Failed to save changes',
          description: result.error ?? 'Something went wrong. Please try again.'
        })
      )
      return
    }

    router.refresh()
    store.dispatch(
      showToast({
        message: 'Auction settings saved',
        description: `"${inputs.title}" has been updated successfully.`
      })
    )
  }

  return (
    <div className="max-w-xl space-y-5">
      <div className="border border-border-light dark:border-border-dark">
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-3">
            <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction Settings</h2>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Title
            </label>
            <input id="title" name="title" type="text" onChange={handleInput} value={inputs?.title || ''} className={inputStyles} />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="startDate" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                Start Date
              </label>
              <input
                disabled={auction.status === 'ACTIVE'}
                name="startDate"
                id="startDate"
                type="datetime-local"
                onChange={handleInput}
                value={toDatetimeLocal(inputs?.startDate) || ''}
                className={inputStyles}
              />
              {auction.status === 'ACTIVE' && (
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Start date cannot be changed once the auction is live</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="endDate" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                End Date
              </label>
              <input
                name="endDate"
                id="endDate"
                type="datetime-local"
                onChange={handleInput}
                value={toDatetimeLocal(inputs?.endDate) || ''}
                className={inputStyles}
              />
            </div>
          </div>

          {/* Goal */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="goal" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Goal ($)
            </label>
            <input name="goal" id="goal" type="number" onChange={handleInput} value={inputs?.goal || ''} min={0} className={inputStyles} />
          </div>

          {/* Custom link */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="customLink" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              Custom Link
            </label>
            <input
              name="customAuctionLink"
              id="customAuctionLink"
              type="text"
              onChange={handleInput}
              value={inputs?.customAuctionLink ?? ''}
              placeholder="e.g. spring-2026"
              className="w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              onClick={handleSaveAuctionSettings}
              className="px-5 py-2.5 bg-primary-light dark:bg-primary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" /> Saving...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
          {/* Danger zone — only visible for DRAFT auctions */}
          {inputs?.status === 'DRAFT' && (
            <div className="pt-6 mt-6 border-t border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-4 h-px bg-red-500 dark:bg-red-400 shrink-0" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-red-500 dark:text-red-400">Danger Zone</p>
              </div>
              <div className="border border-red-500/20 dark:border-red-400/20 bg-red-500/5 dark:bg-red-400/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-text-light dark:text-text-dark font-medium mb-0.5">Delete Auction</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    Permanently delete this auction and all its items. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAuction}
                  disabled={deleting}
                  aria-label="Delete this auction permanently"
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-red-500/40 dark:border-red-400/40 text-red-500 dark:text-red-400 text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-red-500 dark:hover:bg-red-400 hover:text-white dark:hover:text-bg-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 size={11} className="animate-spin" aria-hidden="true" /> : <Trash2 size={11} aria-hidden="true" />}
                  {deleting ? 'Deleting...' : 'Delete Auction'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
