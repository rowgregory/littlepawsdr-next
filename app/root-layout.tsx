'use client'

import { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './lib/store/store'
import { Elements } from '@stripe/react-stripe-js'
import { Confetti3D } from './components/unique/Confetti3D'
import { Toast } from './components/common/Toast'
import Header from './components/unique/Header'
import Footer from './components/unique/Footer'
import { ThemeProvider } from './lib/providers/ThemeProvider'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { HIDDEN_PATHS } from './lib/constants/navigation'
import AuctionEndedModal from './components/modals/AuctionEndedModal'
import AuctionStartedModal from './components/modals/AuctionStartedModal'
import AuctionBidModal from './components/modals/AuctionBidModal'
import { stripePromise } from './lib/stripe-promise'
import { CartBar } from './components/unique/CartBar'
import { CartToast } from './components/unique/CartToast'

export const RootLayoutWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const segments = useSelectedLayoutSegments()
  const isNotFound = segments[0] === '__DEFAULT__' || segments.includes('/_not-found')

  const pathname = usePathname()
  const isHidden = HIDDEN_PATHS.some((path) => pathname.startsWith(path)) || isNotFound

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
          {!isHidden && <Header />}
          {children}
          {!isHidden && <Footer />}
        </Elements>
      </ThemeProvider>
    </Provider>
  )
}
