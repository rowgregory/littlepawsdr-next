import { motion } from 'framer-motion'
import { IAuction } from 'types/entities/auction'

export function AdminAuctionBiddersTab({ auction }: { auction: IAuction }) {
  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Bidders <span className="ml-1">{auction.bidders.length}</span>
          </h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Auction bidders">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              {['Bidder', 'Anonymous', 'Status'].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody key="bidders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
            {auction.bidders.length > 0 ? (
              auction.bidders.map((bidder) => {
                const name = [bidder.user?.firstName, bidder.user?.lastName].filter(Boolean).join(' ') || bidder.user?.email || 'Guest'
                return (
                  <tr
                    key={bidder.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark">{name}</p>
                      {bidder.user?.email && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.user.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
                          bidder.user?.anonymousBidding
                            ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                            : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                        }`}
                      >
                        {bidder.user?.anonymousBidding ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark">{name}</p>
                      {bidder?.status && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{bidder.status}</p>}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-5 py-16 text-center">
                  <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No bidders yet.</p>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}
