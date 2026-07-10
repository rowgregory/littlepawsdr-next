'use client'

import { FC, ReactNode, Suspense, useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from './lib/store/store'
import { Elements } from '@stripe/react-stripe-js'
import { Confetti3D } from './components/unique/Confetti3D'
import { Toast } from './components/common/Toast'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { ThemeProvider } from './lib/providers/theme.provider'
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation.constants'
import AuctionEndedModal from './components/modals/AuctionEndedModal'
import AuctionStartedModal from './components/modals/AuctionStartedModal'
import { stripePromise } from './lib/stripe/stripe-promise'
import { CartBar } from './components/cart/CartBar'
import { CartToast } from './components/cart/CartToast'
import { AdoptionFeeWelcomeModal } from './components/modals/AdoptionFeeModal'
import PublicContactModal from './components/modals/PublicContactModal'
import { pusherClient } from './lib/pusher/pusher-client'
import { setOpenAuctionStartedModal } from './lib/store/slices/uiSlice'
import NavigationDrawer from './components/drawers/NavigationDrawer'
import { CartPersistence } from './components/cart/CartPersistence'

export const RootLayoutWrapper: FC<{ children: ReactNode; auction: any; hasActiveFee: boolean }> = ({
  children,
  auction,
  hasActiveFee
}) => {
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
          <CartBar />
          <CartToast />
          <AdoptionFeeWelcomeModal />
          <PublicContactModal />
          <Suspense fallback={null}>
            <NavigationDrawer auction={auction} hasActiveFee={hasActiveFee} />
          </Suspense>
          <CartPersistence />
          {!isHidden && <Header auction={auction} hasActiveFee={hasActiveFee} />}
          {children}
          {!isHidden && <Footer />}
        </Elements>
      </ThemeProvider>
    </Provider>
  )
}
