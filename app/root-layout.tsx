'use client'

import { FC, ReactNode, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from './lib/store/store'
import { Elements } from '@stripe/react-stripe-js'
import { Confetti3D } from './components/unique/Confetti3D'
import { Toast } from './components/common/Toast'
import Header from './components/unique/Header'
import Footer from './components/unique/Footer'
import { ThemeProvider } from './lib/providers/ThemeProvider'
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation'
import AuctionEndedModal from './components/modals/AuctionEndedModal'
import AuctionStartedModal from './components/modals/AuctionStartedModal'
import AuctionBidModal from './components/modals/AuctionBidModal'
import { stripePromise } from './lib/stripe-promise'
import { CartBar } from './components/unique/CartBar'
import { CartToast } from './components/unique/CartToast'
import { AdoptionFeeWelcomeModal } from './components/modals/AdoptionFeeModal'
import PublicContactModal from './components/modals/PublicContactModal'
import { pusherClient } from './lib/pusher-client'
import { setOpenAuctionStartedModal } from './lib/store/slices/uiSlice'

export const RootLayoutWrapper: FC<{ children: ReactNode; auction: any }> = ({ children, auction }) => {
  const segments = useSelectedLayoutSegments()
  const isNotFound = segments[0] === '__DEFAULT__' || segments.includes('/_not-found')

  const pathname = usePathname()
  const isHidden = HIDDEN_PATHS.some((path) => pathname.startsWith(path)) || isNotFound

  const router = useRouter()
  const routerRef = useRef(router)

  const activeAuctionId = auction?.id ?? null

  useEffect(() => {
    if (!activeAuctionId) return

    const channel = pusherClient.subscribe(`auction-${activeAuctionId}`)

    channel.bind('auction-started', (data) => {
      routerRef.current.refresh()
      store.dispatch(setOpenAuctionStartedModal(data))
    })
    channel.bind('auction-ended', () => routerRef.current.refresh())
    channel.bind('auction-updated', () => routerRef.current.refresh())

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`auction-${activeAuctionId}`)
    }
  }, [activeAuctionId])

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Elements stripe={stripePromise}>
          <Toast />
          <Confetti3D />
          <AuctionEndedModal />
          <AuctionStartedModal />
          <AuctionBidModal />
          <CartBar />
          <CartToast />
          <AdoptionFeeWelcomeModal />
          <PublicContactModal />

          {!isHidden && <Header auction={auction} />}

          {children}
          {!isHidden && <Footer />}
        </Elements>
      </ThemeProvider>
    </Provider>
  )
}
