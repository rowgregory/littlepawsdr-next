'use client'

import { ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from './lib/store/store'
import { Elements } from '@stripe/react-stripe-js'
import { Confetti3D } from './components/_common/Confetti3D'
import { Toast } from './components/_common/Toast'
import { ThemeProvider } from './lib/providers/theme.provider'
import { usePathname, useRouter, useSelectedLayoutSegments } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation.constants'
import AuctionEndedModal from './components/modals/AuctionEndedModal'
import { AuctionStartedModal } from './components/modals/AuctionStartedModal'
import { stripePromise } from './lib/stripe/stripe-promise'
import { CartBar } from './components/cart/CartBar'
import { CartToast } from './components/cart/CartToast'
import PublicContactModal from './components/modals/PublicContactModal'
import { pusherClient } from './lib/pusher/pusher-client'
import NavigationDrawer from './components/layout/NavigationDrawer'
import { CartPersistence } from './components/cart/CartPersistence'
import { AuctionEndedData, AuctionStartedData } from 'types/entities/auction'
import { WelcomeGate } from './components/modals/WelcomeGate'
import { Session } from 'next-auth'
import Header from './components/layout/header/Header'
import Footer from './components/layout/footer/Footer'

interface Props {
  children: ReactNode
  auction: any
  hasActiveFee: boolean
  session: Session | null
}

export function RootLayoutWrapper({ children, auction, hasActiveFee, session }: Props) {
  const segments = useSelectedLayoutSegments()
  const isNotFound = segments[0] === '__DEFAULT__' || segments.includes('/_not-found')
  const pathname = usePathname()
  const isHidden = HIDDEN_PATHS.some((path) => pathname.startsWith(path)) || isNotFound

  const router = useRouter()
  const routerRef = useRef(router)

  const activeAuctionId = auction?.id ?? null
  const userId = session?.user?.id ?? null
  const userName = session?.user?.name ?? null

  const [auctionStartedData, setAuctionStartedData] = useState<AuctionStartedData | null>(null)
  const [auctionEndedData, setAuctionEndedData] = useState<AuctionEndedData | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    routerRef.current = router
  }, [router])

  useEffect(() => {
    if (!activeAuctionId) return

    const channel = pusherClient.subscribe(`auction-${activeAuctionId}`)

    channel.bind('auction-started', (data: AuctionStartedData) => {
      routerRef.current.refresh()
      setAuctionStartedData(data)
    })
    channel.bind('auction-ended', (data: any) => {
      routerRef.current.refresh()
      setAuctionEndedData(data)
    })

    channel.bind('auction-updated', () => routerRef.current.refresh())

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`auction-${activeAuctionId}`)
    }
  }, [activeAuctionId])

  useEffect(() => {
    if (!userId) return

    const channel = pusherClient.subscribe(`user-${userId}`)

    channel.bind('migration-complete', () => {
      routerRef.current.refresh()
      setShowWelcome(true)
    })

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(`user-${userId}`)
    }
  }, [userId])

  const [burstTrigger, setBurstTrigger] = useState(0)

  // expose via context or prop — simplest is a window event
  useEffect(() => {
    const handler = () => setBurstTrigger((t) => t + 1)
    window.addEventListener('confetti-burst', handler)
    return () => window.removeEventListener('confetti-burst', handler)
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Elements stripe={stripePromise}>
          <Toast />
          <Confetti3D burstTrigger={burstTrigger} />
          <AuctionEndedModal data={auctionEndedData} onClose={() => setAuctionEndedData(null)} />
          <AuctionStartedModal data={auctionStartedData} onClose={() => setAuctionStartedData(null)} />
          <CartBar />
          <CartToast />
          <WelcomeGate show={showWelcome} userName={userName} onClose={() => setShowWelcome(false)} />
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
