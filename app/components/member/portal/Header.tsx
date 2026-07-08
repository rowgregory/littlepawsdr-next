import { fadeUp } from 'app/lib/constants/motion.constants'
import { formatMoney } from 'app/utils/currency.utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { AuctionParticipation, MerchAndWWOrder, PortalUser, Subscription } from 'types/member-portal.types'

interface HeaderProps {
  user: PortalUser
  editingName: boolean
  setEditingName: Dispatch<SetStateAction<boolean>>
  handleUpdateName: (e: { preventDefault: () => void }) => Promise<void>
  firstNameInput: string
  setFirstNameInput: Dispatch<SetStateAction<string>>
  lastNameInput: string
  setLastNameInput: Dispatch<SetStateAction<string>>
  nameLoading: boolean
  totalGiven: number
  subscriptions: Subscription[]
  merchAndWWOrders: MerchAndWWOrder[]
  auctionParticipation: AuctionParticipation[]
}

export function Header({
  user,
  editingName,
  handleUpdateName,
  firstNameInput,
  setFirstNameInput,
  lastNameInput,
  setLastNameInput,
  nameLoading,
  setEditingName,
  totalGiven,
  subscriptions,
  merchAndWWOrders,
  auctionParticipation
}: HeaderProps) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Member'
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16">
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Avatar */}
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="font-quicksand font-black text-base text-primary-light dark:text-primary-dark">
            {initials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Member Portal
            </p>
          </div>

          <AnimatePresence mode="wait">
            {editingName ? (
              <motion.form
                key="name-form"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleUpdateName}
                className="flex flex-col xs:flex-row gap-2 mt-1"
                aria-label="Update your name"
              >
                <input
                  type="text"
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  aria-label="First name"
                  className="w-full xs:w-32 px-3 py-2 text-sm font-mono border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                />
                <input
                  type="text"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  aria-label="Last name"
                  className="w-full xs:w-32 px-3 py-2 text-sm font-mono border-2 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={nameLoading}
                    aria-label="Save name"
                    className="px-3 py-2 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-50"
                  >
                    {nameLoading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current"
                        aria-hidden="true"
                      />
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingName(false)}
                    aria-label="Cancel editing name"
                    className="px-3 py-2 border border-border-light dark:border-border-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="name-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <h1 className="font-quicksand font-black text-3xl sm:text-4xl text-text-light dark:text-text-dark leading-tight">
                  {fullName}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setFirstNameInput(user.firstName ?? '')
                    setLastNameInput(user.lastName ?? '')
                    setEditingName(true)
                  }}
                  aria-label="Edit your name"
                  className="shrink-0 text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5 truncate">{user.email}</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-8 grid grid-cols-2 xs:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
        {[
          { label: 'Total Given', value: formatMoney(Number(totalGiven)) },
          { label: 'Subscriptions', value: String(subscriptions.filter((s) => s.status === 'CONFIRMED').length) },
          { label: 'Merch & Welcome Wieners', value: String(merchAndWWOrders.length) },
          { label: 'Auctions', value: String(auctionParticipation.length) }
        ].map(({ label, value }) => (
          <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-4 sm:py-5">
            <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">
              {label}
            </p>
            <p className="font-quicksand font-black text-xl sm:text-2xl text-text-light dark:text-text-dark tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
