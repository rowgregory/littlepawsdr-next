'use client'

import { fadeUp } from 'app/lib/constants/motion'
import { AnimatePresence, motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Picture from '../common/Picture'
import { CheckCircle, CreditCard, Gavel, Gift, MapPin, Pencil, Plus, Receipt, Repeat } from 'lucide-react'
import { store } from 'app/lib/store/store'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate } from 'app/utils/date.utils'
import { setDefaultPaymentMethod } from 'app/lib/actions/setDefaultPaymentMethod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { setOpenAddPaymentMethodModal } from 'app/lib/store/slices/uiSlice'
import { deletePaymentMethod } from 'app/lib/actions/deletePaymentMethod'
import { UpdateAddressModal } from '../modals/UpdateAddressModal'
import { MemberPortalPageProps } from 'types/member-portal'
import { StatusPill } from '../ui/StatusPill'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { updateUserName } from 'app/lib/actions/updateUserName'
import { pusherClient } from 'app/lib/pusher-client'
import { ShippedCelebration } from '../unique/ShippedCelebration'

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{label}</h2>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border-light dark:border-border-dark py-10 text-center">
      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">{message}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MemberPortalClient({
  user,
  donations,
  subscriptions,
  auctionParticipation,
  paymentMethods,
  adoptionFees,
  merchAndWWOrders
}: MemberPortalPageProps) {
  const router = useRouter()
  const session = useSession()

  const [shippedOrderId, setShippedOrderId] = useState<string | null>(null)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [setDefaultSuccess, setSetDefaultSuccess] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<Record<string, string>>({})

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Member'
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  const isAuthed = session.status === 'authenticated'

  const totalGiven = [
    ...donations.map((d) => d.amount),
    ...subscriptions.map((s) => s.amount),
    ...auctionParticipation.flatMap((a) => a.bids.filter((b) => b.isWinner).map((b) => b.bidAmount)),
    ...adoptionFees.map((a) => a.feeAmount),
    ...merchAndWWOrders.map((o) => o.totalAmount)
  ].reduce((sum, amount) => sum + Number(amount), 0)

  const handleSetDefaultPaymentMethod = async (id: string) => {
    const result = await setDefaultPaymentMethod(id)
    if (result.success) {
      setSetDefaultSuccess(id)
      router.refresh()
      setTimeout(() => setSetDefaultSuccess(null), 2000)
    }
  }

  const handleDeletePaymentMethod = async (id: string) => {
    const result = await deletePaymentMethod(id)
    if (!result.success) {
      setDeleteError((prev) => ({ ...prev, [id]: result.error ?? 'Failed to delete card' }))
    } else {
      router.refresh()
    }
  }

  const [editingName, setEditingName] = useState(false)
  const [firstNameInput, setFirstNameInput] = useState(user.firstName ?? '')
  const [lastNameInput, setLastNameInput] = useState(user.lastName ?? '')
  const [nameLoading, setNameLoading] = useState(false)

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameLoading(true)
    try {
      const result = await updateUserName({
        firstName: firstNameInput.trim(),
        lastName: lastNameInput.trim()
      })

      if (!result.success) throw new Error(result.error ?? 'Failed to update name')
      store.dispatch(showToast({ message: 'Name updated', type: 'success' }))
      setEditingName(false)
      router.refresh()
    } catch (err) {
      store.dispatch(showToast({ message: err instanceof Error ? err.message : 'Failed to update name', type: 'error' }))
    } finally {
      setNameLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthed || !session.data?.user?.id) return

    const channel = pusherClient.subscribe(`user-${session.data.user.id}`)

    channel.bind('order-shipped', (data: { orderId: string }) => {
      setShippedOrderId(data.orderId)
      router.refresh()
    })

    return () => {
      channel.unbind('order-shipped')
      pusherClient.unsubscribe(`user-${session.data.user.id}`)
    }
  }, [isAuthed, router, session.data.user.id])

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Home
          </Link>

          <div className="flex items-center gap-4">
            {(session?.data?.user?.role === 'ADMIN' || session?.data?.user?.role === 'SUPERUSER') && (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="square"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>
            )}

            <button
              onClick={() => signOut({ redirectTo: '/auth/login' })}
              className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Sign Out
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Avatar */}
            {user.image ? (
              <Picture
                priority={true}
                src={user.image}
                alt={fullName}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover border border-border-light dark:border-border-dark shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="font-quicksand font-black text-base text-primary-light dark:text-primary-dark">{initials}</span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Member Portal</p>
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
                    <h1 className="font-quicksand font-black text-3xl sm:text-4xl text-text-light dark:text-text-dark leading-tight">{fullName}</h1>
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
              { label: 'Total Given', value: formatMoney(totalGiven) },
              { label: 'Subscriptions', value: subscriptions.filter((s) => s.status === 'CONFIRMED')?.length.toString() },
              { label: 'Merch & Welcome Wieners', value: merchAndWWOrders?.length.toString() },
              { label: 'Auctions', value: auctionParticipation?.reduce((sum, a) => sum + a.totalBids, 0).toString() }
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-4 sm:py-5">
                <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">{label}</p>
                <p className="font-quicksand font-black text-xl sm:text-2xl text-text-light dark:text-text-dark">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-14 sm:gap-16">
          {/* ── Merch & Wiener Gifts ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0} aria-labelledby="merch-wiener-heading">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel label="Merch & Wiener Gifts" />
              {merchAndWWOrders?.length > 5 && (
                <Link
                  href="/member/portal/merch-and-ww"
                  className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                >
                  View all ({merchAndWWOrders?.length}) →
                </Link>
              )}
            </div>

            {merchAndWWOrders?.length === 0 ? (
              <EmptyState message="You haven't made any purchases yet." />
            ) : (
              <div className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                {merchAndWWOrders?.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                        <div>
                          <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                            {formatDate(order.createdAt, true)}
                          </p>
                          {order.customerName && <p className="text-xs font-mono text-text-light dark:text-text-dark mt-0.5">{order.customerName}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark">
                          {order.type === 'MIXED' ? 'Merch + Welcome Wiener' : order.type === 'WELCOME_WIENER' ? 'Welcome Wiener' : 'Merch'}
                        </span>
                        <StatusPill status={order.status} />
                        {order.shippingStatus && <StatusPill status={order.shippingStatus} />}
                        <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark tabular-nums">
                          {formatMoney(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <ul className="space-y-2" role="list" aria-label="Order items">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3" role="listitem">
                          <div
                            className="shrink-0 w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden"
                            aria-hidden="true"
                          >
                            {item.image ? (
                              <Picture priority={false} src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{item.name}</p>
                            {item.quantity > 1 && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">×{item.quantity}</p>}
                          </div>
                          <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums shrink-0">
                            {formatMoney(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Shipping address */}
                    {order.shippingAddress && (
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                        <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark shrink-0">Ships to</p>
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                          {', '}
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipPostalCode}
                        </p>
                      </div>
                    )}

                    {/* View confirmation */}
                    <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                      <Link
                        href={`/order-confirmation/${order.id}`}
                        aria-label={`View order confirmation for ${formatDate(order.createdAt)}`}
                        className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                      >
                        View confirmation →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View all button — shown below the list too */}
            {merchAndWWOrders?.length > 5 && (
              <div className="mt-4">
                <Link
                  href="/member/portal/merch-and-ww"
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  View all {merchAndWWOrders?.length} orders →
                </Link>
              </div>
            )}
          </motion.section>

          {/* ── Shipping Address ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={1} aria-labelledby="address-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 id="address-heading" className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                  Shipping Address
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                aria-label={user?.address ? 'Edit shipping address' : 'Add shipping address'}
              >
                <Pencil className="w-3 h-3 shrink-0" aria-hidden="true" />
                {user?.address ? 'Edit' : 'Add'}
              </button>
            </div>

            {user?.address ? (
              <div className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
                <div className="flex items-start gap-3 p-5">
                  <MapPin className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">{user.address.name}</p>
                    <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1 leading-relaxed">
                      {user.address.addressLine1}
                      {user.address.addressLine2 && `, ${user.address.addressLine2}`}
                      <br />
                      {user.address.city}, {user.address.state} {user.address.zipPostalCode}
                    </p>
                  </div>
                </div>
                {user.address.updatedAt && (
                  <div className="px-5 py-2.5 border-t border-border-light dark:border-border-dark">
                    <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60">
                      Last updated {formatDate(user.address.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState message="No shipping address on file." />
            )}

            <UpdateAddressModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} address={user?.address ?? null} />
          </motion.section>

          {/* ── Payment Methods ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={2} aria-labelledby="payment-methods-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Saved Payment Methods</h2>
              </div>
              <button
                type="button"
                onClick={() => store.dispatch(setOpenAddPaymentMethodModal())}
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Plus className="w-3 h-3 shrink-0" aria-hidden="true" />
                Add Card
              </button>
            </div>
            {paymentMethods?.length === 0 ? (
              <EmptyState message="No saved payment methods." />
            ) : (
              <ul
                className="grid grid-cols-1 xs:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {paymentMethods?.map((pm) => (
                  <li key={pm.id} className="bg-bg-light dark:bg-bg-dark p-4">
                    <div className="flex items-center gap-3 min-w-0 mb-3">
                      <div className="shrink-0 w-10 h-7 flex items-center justify-center border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                        <CreditCard className="w-4 h-4 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark capitalize">
                            {pm.cardBrand} •••• {pm.cardLast4}
                          </p>
                          {pm.isDefault && (
                            <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark shrink-0">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                          {pm.cardholderName && `${pm.cardholderName} · `}Expires {pm.cardExpMonth.toString().padStart(2, '0')}/{pm.cardExpYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-13">
                      {!pm.isDefault && (
                        <>
                          {setDefaultSuccess === pm.id ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-green-500 shrink-0" aria-hidden="true" />
                              <span className="text-[9px] font-mono tracking-widest uppercase text-green-500">Default updated</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                              aria-label={`Set ${pm.cardBrand} ending in ${pm.cardLast4} as default`}
                              className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                            >
                              Set Default
                            </button>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeletePaymentMethod(pm.id)}
                        aria-label={`Delete ${pm.cardBrand} ending in ${pm.cardLast4}`}
                        className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1.5 border border-border-light dark:border-border-dark hover:border-red-500 dark:hover:border-red-400 text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                    {deleteError[pm.id] && (
                      <p className="text-[10px] font-mono text-red-500 dark:text-red-400 mt-2 pl-13 leading-relaxed">{deleteError[pm.id]}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* ── Adoption Fees ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={3} aria-labelledby="adoption-fees-heading">
            <SectionLabel label="Adoption Fees" />
            {adoptionFees?.length === 0 ? (
              <EmptyState message="No adoption fees on file." />
            ) : (
              <ul
                className="grid grid-cols-1 xs:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {adoptionFees?.map((fee) => (
                  <li key={fee.id} className="bg-bg-light dark:bg-bg-dark p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">
                        {[fee.firstName, fee.lastName].filter(Boolean).join(' ') || 'Adoption Fee'}
                      </p>
                      <StatusPill status={fee.status} />
                    </div>
                    <div className="space-y-1">
                      {fee.feeAmount != null && (
                        <p className="font-quicksand font-black text-lg text-primary-light dark:text-primary-dark">
                          {formatMoney(Number(fee.feeAmount))}
                        </p>
                      )}
                      {fee.bypassCode && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark flex items-center">
                          Bypass code used:
                          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </p>
                      )}
                      {fee.expiresAt && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Expires {formatDate(fee.expiresAt)}</p>
                      )}
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Created {formatDate(fee.createdAt)}</p>
                      {fee.status === 'ACTIVE' && (
                        <p className="mt-1 text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                          You have an active application window. Note: the application must be completed in one sitting — progress cannot be saved.{' '}
                          <Link
                            href="/adopt/application/apply"
                            className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none underline"
                          >
                            Begin application →
                          </Link>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* ── Subscriptions ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={4} aria-labelledby="subscriptions-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Subscriptions</h2>
              </div>
              <Link
                href="/subscriptions"
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Repeat className="w-3 h-3 shrink-0" aria-hidden="true" />
                Subscribe
              </Link>
            </div>
            {subscriptions?.length === 0 ? (
              <EmptyState message="No active subscriptions." />
            ) : (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {subscriptions.map((sub) => {
                  const isCancelled = sub.status === 'CANCELLED'
                  return (
                    <li key={sub.id} className={`bg-bg-light dark:bg-bg-dark p-5 ${isCancelled ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug truncate">
                            {sub.tierName}
                          </p>
                          {isCancelled && (
                            <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-red-500 dark:text-red-400 mt-0.5">Cancelled</p>
                          )}
                        </div>
                        <StatusPill status={sub.status} />
                      </div>

                      <p
                        className={`font-quicksand font-black text-2xl ${isCancelled ? 'text-muted-light dark:text-muted-dark' : 'text-primary-light dark:text-primary-dark'}`}
                      >
                        {formatMoney(sub.amount)}
                        <span className="text-xs font-mono font-normal text-muted-light dark:text-muted-dark ml-1">/ {sub.interval}</span>
                      </p>

                      {sub.nextBillingDate && sub.status === 'CONFIRMED' && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-2">
                          Next billing {formatDate(sub.nextBillingDate)}
                        </p>
                      )}

                      {sub.nextBillingDate && isCancelled && (
                        <p className="text-[10px] font-mono text-red-500/70 dark:text-red-400/70 mt-2">
                          Active until {formatDate(sub.nextBillingDate)}
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                        <Link
                          href={`/member/portal/subscription/${sub.id}`}
                          aria-label={`View details for ${sub.tierName} subscription`}
                          className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                        >
                          View details →
                        </Link>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </motion.section>

          {/* ── One-time donations ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={5} aria-labelledby="donations-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">One-Time Donations</h2>
              </div>
              <Link
                href="/donate"
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Gift className="w-3 h-3 shrink-0" aria-hidden="true" />
                Donate
              </Link>
            </div>
            {donations?.length === 0 ? (
              <EmptyState message="No donations yet." />
            ) : (
              <div className="border border-border-light dark:border-border-dark overflow-hidden">
                <table className="w-full" role="table" aria-label="One-time donations">
                  <thead>
                    <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d, i) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                        className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150"
                      >
                        <td className="px-4 sm:px-5 py-3.5 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                          {formatDate(d.createdAt, true)}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 font-quicksand font-black text-sm text-text-light dark:text-text-dark whitespace-nowrap">
                          {formatMoney(d.amount)}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5">
                          <StatusPill status={d.status} />
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-right">
                          <Link
                            href={`/order-confirmation/${d.id}`}
                            aria-label={`View order confirmation for ${formatDate(d.createdAt)}`}
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                          >
                            <span className="hidden sm:inline">View</span>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.section>

          {/* ── Auctions ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={7} aria-labelledby="auctions-heading">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Auction Participation</h2>
              </div>
              <Link
                href="/auctions"
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <Gavel className="w-3 h-3 shrink-0" aria-hidden="true" />
                Bid
              </Link>
            </div>
            {auctionParticipation?.length === 0 ? (
              <EmptyState message="You haven't participated in any auctions yet." />
            ) : (
              <div className="space-y-4">
                {auctionParticipation?.map((auction) => (
                  <div key={auction.auctionId} className="border border-border-light dark:border-border-dark">
                    {/* Auction header */}
                    <div className="px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark">
                            {auction.auctionTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill status={auction.auctionStatus} />
                          {auction.auctionEndDate && (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                              {auction.auctionStatus === 'active' ? 'Ends' : 'Ended'} {formatDate(auction.auctionEndDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      {auction.winningBidderPaymentLink && (
                        <div className="mt-2 pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-between gap-3">
                          {auction.winningBidPaymentStatus === 'PAID' ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-green-500 shrink-0" aria-hidden="true" />
                              <p className="text-[10px] font-mono tracking-widest uppercase text-green-500">Payment Complete</p>
                              {auction.paidOn && (
                                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">· {formatDate(auction.paidOn, true)}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">Payment required to claim your items</p>
                          )}
                          <Link
                            href={auction.winningBidderPaymentLink}
                            className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                              auction.winningBidPaymentStatus === 'PAID'
                                ? 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
                                : 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
                            }`}
                          >
                            {auction.winningBidPaymentStatus === 'PAID' ? (
                              <>
                                <Receipt className="w-3 h-3 shrink-0" aria-hidden="true" />
                                View Receipt
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3 h-3 shrink-0" aria-hidden="true" />
                                Complete Payment
                              </>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-light dark:bg-border-dark" role="list">
                      {auction.bids.map((bid) => (
                        <li key={bid.id} className="bg-bg-light dark:bg-bg-dark flex gap-4 p-4 sm:p-5">
                          {/* Item image */}
                          <div className="w-14 h-14 shrink-0 overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                            {bid.itemImage ? (
                              <Picture priority={false} src={bid.itemImage} alt={bid.itemName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                              <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-snug">{bid.itemName}</p>
                              {bid.isWinner && (
                                <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark shrink-0">
                                  Won
                                </span>
                              )}
                            </div>
                            <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark">
                              {formatMoney(bid.bidAmount)}
                              <span className="text-[10px] font-mono font-normal text-muted-light dark:text-muted-dark ml-1">your bid</span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          <AnimatePresence>
            {shippedOrderId && <ShippedCelebration key={shippedOrderId} orderId={shippedOrderId} onClose={() => setShippedOrderId(null)} />}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
