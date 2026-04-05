import { setInputs } from 'app/lib/store/slices/formSlice'
import { setOpenAuctionItemDrawer } from 'app/lib/store/slices/uiSlice'
import { store } from 'app/lib/store/store'
import { getAuctionItemStatusConfig } from 'app/utils/getAuctionItemStatusConfig'
import { Package, Plus } from 'lucide-react'
import { IAuction } from 'types/entities/auction'
import { motion } from 'framer-motion'
import Picture from '../common/Picture'
import { formatMoney } from 'app/utils/currency.utils'
import Link from 'next/link'
import { useState } from 'react'

export function AdminAuctionItemsTab({ auction }: { auction: IAuction }) {
  const [itemTab, setItemTab] = useState<'AUCTION' | 'FIXED'>('AUCTION')

  const auctionItems = auction.items.filter((i) => i.sellingFormat === 'AUCTION')
  const fixedItems = auction.items.filter((i) => i.sellingFormat === 'FIXED')

  return (
    <div className="border border-border-light dark:border-border-dark">
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Items <span className="ml-1">{auction.items.length}</span>
          </h2>
        </div>
        <button
          onClick={() => {
            store.dispatch(setInputs({ formName: 'auctionItemForm', data: { auction, sellingFormat: itemTab } }))
            store.dispatch(setOpenAuctionItemDrawer())
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-light dark:bg-primary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label="Add auction item"
        >
          <Plus size={11} aria-hidden="true" /> Add Item
        </button>
      </div>

      {/* ── Item type tabs ── */}
      <div role="tablist" aria-label="Item type" className="flex items-center border-b border-border-light dark:border-border-dark px-5">
        {(['AUCTION', 'FIXED'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={itemTab === tab}
            onClick={() => setItemTab(tab)}
            className={`relative px-4 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
              itemTab === tab
                ? 'text-primary-light dark:text-primary-dark'
                : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
          >
            {itemTab === tab && (
              <motion.span
                layoutId="item-tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                aria-hidden="true"
              />
            )}
            {tab === 'AUCTION' ? 'Auction' : 'Instant Buy'}
            <span className="ml-2 text-muted-light dark:text-muted-dark">{tab === 'AUCTION' ? auctionItems.length : fixedItems.length}</span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      {(['AUCTION', 'FIXED'] as const).map((tab) => (
        <div key={tab} hidden={itemTab !== tab} className="overflow-x-auto">
          <table className="w-full" aria-label={`${tab === 'AUCTION' ? 'Auction' : 'Instant buy'} items`}>
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                {(tab === 'AUCTION'
                  ? ['Item', 'Starting', 'Current Bid', 'Increase', 'Bids', 'Status', '']
                  : ['Item', 'Price', 'Quantity', 'Sold', 'Status', '']
                ).map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tab === 'AUCTION' ? auctionItems : fixedItems).map((item) => {
                const itemStatus = getAuctionItemStatusConfig(item.status)
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    {/* Item name + photo */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {item.photos?.length > 0 ? (
                          <Picture
                            priority={false}
                            src={item.photos.find((p) => p.isPrimary)?.url ?? item.photos[0].url}
                            alt={item.name}
                            className="w-8 h-8 object-cover border border-border-light dark:border-border-dark shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0">
                            <Package size={12} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                          </div>
                        )}
                        <p className="text-xs font-semibold text-text-light dark:text-text-dark truncate max-w-40">{item.name}</p>
                      </div>
                    </td>

                    {tab === 'AUCTION' ? (
                      <>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(item.startingPrice)}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">
                            {formatMoney(item.highestBidAmount ?? item.currentBid)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {item.startingPrice && item.highestBidAmount ? (
                            <span
                              className={`text-xs font-mono tabular-nums ${
                                item.highestBidAmount > item.startingPrice
                                  ? 'text-green-500 dark:text-green-400'
                                  : 'text-muted-light dark:text-muted-dark'
                              }`}
                            >
                              {item.highestBidAmount > item.startingPrice
                                ? `+${(((item.highestBidAmount - item.startingPrice) / item.startingPrice) * 100).toFixed(0)}%`
                                : '—'}
                            </span>
                          ) : (
                            <span className="text-xs font-mono text-muted-light dark:text-muted-dark">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{item.totalBids}</span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(item.buyNowPrice)}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{item.totalQuantity ?? '—'}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{item.instantBuyers?.length ?? 0}</span>
                        </td>
                      </>
                    )}

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${itemStatus.classes}`}>{itemStatus.label}</span>
                    </td>

                    <td className="px-5 py-3.5 space-x-3 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/auctions/${item.auctionId}/${item.id}`}
                        aria-label={`View ${item.name}`}
                        className="text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          store.dispatch(setInputs({ formName: 'auctionItemForm', data: { ...item, isUpdating: true, status: auction.status } }))
                          store.dispatch(setOpenAuctionItemDrawer())
                        }}
                        aria-label={`Edit ${item.name}`}
                        className="text-[10px] font-mono text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
              {(tab === 'AUCTION' ? auctionItems : fixedItems).length === 0 && (
                <tr>
                  <td colSpan={tab === 'AUCTION' ? 7 : 6} className="px-5 py-16 text-center">
                    <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                      No {tab === 'AUCTION' ? 'auction' : 'instant buy'} items yet — add your first item.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
