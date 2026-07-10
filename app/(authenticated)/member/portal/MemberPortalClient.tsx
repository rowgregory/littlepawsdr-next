'use client'

import { AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { store } from 'app/lib/store/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MemberPortalClientProps } from 'types/member-portal.types'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { updateUserName } from 'app/lib/actions/user/updateUserName'
import { pusherClient } from 'app/lib/pusher/pusher-client'
import { TopBar } from 'app/components/member/portal/TopBar'
import { Header } from 'app/components/member/portal/Header'
import { MerchAndWienerGifts } from 'app/components/member/portal/MerchAndWienerGifts'
import { ShippingAddress } from 'app/components/member/portal/ShippingAddress'
import { PaymentMethods } from 'app/components/member/portal/PaymentMethods'
import { AdoptionFees } from 'app/components/member/portal/AdoptionFees'
import { Subscriptions } from 'app/components/member/portal/Subscriptions'
import { OneTimeDonations } from 'app/components/member/portal/OneTimeDonations'
import { Auctions } from 'app/components/member/portal/Auctions'
import { ShippedCelebration } from 'app/components/member/portal/ShippedCelebration'
import { setDefaultPaymentMethod } from 'app/lib/actions/_stripe/setDefaultPaymentMethod'
import { deletePaymentMethod } from 'app/lib/actions/_stripe/deletePaymentMethod'
import { WelcomeGate } from 'app/components/modals/WelcomeGate'

export default function MemberPortalClient({
  user,
  donations,
  subscriptions,
  auctionParticipation,
  paymentMethods,
  adoptionFees,
  merchAndWWOrders,
  showWelcome
}: MemberPortalClientProps) {
  const router = useRouter()
  const session = useSession()

  const [shippedOrderId, setShippedOrderId] = useState<string | null>(null)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [setDefaultSuccess, setSetDefaultSuccess] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<Record<string, string>>({})
  const [editingName, setEditingName] = useState(false)
  const [firstNameInput, setFirstNameInput] = useState(user.firstName ?? '')
  const [lastNameInput, setLastNameInput] = useState(user.lastName ?? '')
  const [nameLoading, setNameLoading] = useState(false)

  const isAuthed = session.status === 'authenticated'

  const totalGiven = [
    ...(donations ?? []).map((d) => Number(d.amount)),
    ...(subscriptions ?? []).map((s) => Number(s.amount)),
    ...(auctionParticipation ?? []).flatMap((a) => a.items.filter((i) => i.isWinner).map((i) => i.myHighestBid)),
    ...(adoptionFees ?? []).map((a) => Number(a.feeAmount)),
    ...(merchAndWWOrders ?? []).map((o) => Number(o.totalAmount))
  ].reduce((sum, n) => sum + n, 0)

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

  const handleUpdateName = async (e: { preventDefault: () => void }) => {
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
      store.dispatch(
        showToast({ message: err instanceof Error ? err.message : 'Failed to update name', type: 'error' })
      )
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
  }, [isAuthed, router, session.data?.user?.id])

  return (
    <>
      <WelcomeGate show={showWelcome} userName={user?.firstName ?? null} />
      <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
          {/* ── TopBar ──  */}
          <TopBar />

          {/* ── Header ── */}
          <Header
            auctionParticipation={auctionParticipation}
            editingName={editingName}
            firstNameInput={firstNameInput}
            handleUpdateName={handleUpdateName}
            lastNameInput={lastNameInput}
            merchAndWWOrders={merchAndWWOrders}
            nameLoading={nameLoading}
            setEditingName={setEditingName}
            setFirstNameInput={setFirstNameInput}
            setLastNameInput={setLastNameInput}
            subscriptions={subscriptions}
            totalGiven={totalGiven}
            user={user}
          />

          {/* ── Sections ── */}
          <div className="flex flex-col gap-14 sm:gap-16">
            {/* ── Payment Methods ── */}
            <PaymentMethods
              deleteError={deleteError}
              handleDeletePaymentMethod={handleDeletePaymentMethod}
              handleSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
              paymentMethods={paymentMethods}
              setDefaultSuccess={setDefaultSuccess}
            />

            {/* ── Shipping Address ── */}
            <ShippingAddress
              addressModalOpen={addressModalOpen}
              setAddressModalOpen={setAddressModalOpen}
              user={user}
            />

            {/* ── Merch & Wiener Gifts ── */}
            <MerchAndWienerGifts merchAndWWOrders={merchAndWWOrders} />

            {/* ── Adoption Fees ── */}
            <AdoptionFees adoptionFees={adoptionFees} />

            {/* ── Subscriptions ── */}
            <Subscriptions subscriptions={subscriptions} />

            {/* ── One-time donations ── */}
            <OneTimeDonations donations={donations} />

            {/* ── Auctions ── */}
            <Auctions auctionParticipation={auctionParticipation} />

            <AnimatePresence>
              {shippedOrderId && (
                <ShippedCelebration
                  key={shippedOrderId}
                  orderId={shippedOrderId}
                  onClose={() => setShippedOrderId(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  )
}
