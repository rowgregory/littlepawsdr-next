'use client'

import React, { FC, useEffect } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '@redux/store'
import { Elements } from '@stripe/react-stripe-js'
import NavigationDrawer from './components/NavigationDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import { stripePromise } from './lib/stripe/stripe'
import { ClientPageProps } from './types/common.types'
import { setAuthState } from '@redux/features/authSlice'
import { shouldExcludePath } from '@public/static-data/string.functions'
import useCustomPathname from '@hooks/useCustomPathname'
import InitExpFromCookie from './components/InitExpFromCookie'
import Pusher from 'pusher-js'
import { useRouter } from 'next/navigation'
import { Confetti3D } from './components/Confetti3D'
import { setShowConfetti } from '@redux/features/stripeSlice'

const options = {
  clientSecret: process.env.STRIPE_SECRET_KEY
} as const

interface DataSuccessProps {
  paymentIntentId: string
  orderId: string
  email: string
  hasAdoptFee: boolean
}

const PageWrapper: FC<ClientPageProps> = ({ children, data }) => {
  const dispatch = useAppDispatch()
  const path = useCustomPathname()
  const { push } = useRouter()
  const { confetti } = useAppSelector((state: RootState) => state.stripe)

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    })

    const channel = pusher.subscribe('payment-status')

    const handlePaymentSuccess = async (data: DataSuccessProps) => {
      if (!data.hasAdoptFee) return // 🚫 Skip if no adopt fee

      try {
        const res = await fetch(`/api/stripe/post-process/set-adopt-fee-token?paymentIntentId=${data.paymentIntentId}`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!res.ok) {
          console.error('Failed to set adopt fee token')
        }

        dispatch(setShowConfetti())
        push('/adopt/application/step4')
      } catch (err) {
        console.error('Error setting adopt fee token:', err)
      }
    }

    channel.bind('payment_succeeded', handlePaymentSuccess)

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [dispatch, push])

  useEffect(() => {
    if (data) {
      dispatch(setAuthState({ isAdmin: data?.isAdmin, isAuthenticated: data?.isAuthenticated, userId: data?.userId, role: data?.role }))
    }
  }, [dispatch, data])

  return (
    <Elements stripe={stripePromise} options={options}>
      <Confetti3D trigger={confetti} duration={3000} />
      <InitExpFromCookie />
      {!shouldExcludePath(path) && <Header />}
      <NavigationDrawer />
      <main>{children}</main>
      {!shouldExcludePath(path) && <Footer />}
    </Elements>
  )
}

export default PageWrapper
