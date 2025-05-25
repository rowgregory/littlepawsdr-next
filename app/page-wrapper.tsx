'use client'

import React, { FC, useEffect } from 'react'
import { useAppDispatch } from '@redux/store'
import { Elements } from '@stripe/react-stripe-js'
import NavigationDrawer from './components/NavigationDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import { stripePromise } from './stripe/stripe'
import { ClientPageProps } from './types/common.types'
import { setAuthState } from '@redux/features/authSlice'
import { shouldExcludePath } from '@public/static-data/string.functions'
import useCustomPathname from '@hooks/useCustomPathname'
import InitExpFromCookie from './components/InitExpFromCookie'

const options = {
  clientSecret: process.env.STRIPE_SECRET_KEY
} as const

const PageWrapper: FC<ClientPageProps> = ({ children, data }) => {
  const dispatch = useAppDispatch()
  const path = useCustomPathname()

  useEffect(() => {
    if (data) {
      dispatch(setAuthState({ isAdmin: data?.isAdmin, isAuthenticated: data?.isAuthenticated, userId: data?.userId, role: data?.role }))
    }
  }, [dispatch, data])

  return (
    <Elements stripe={stripePromise} options={options}>
      <InitExpFromCookie />
      {!shouldExcludePath(path) && <Header />}
      <NavigationDrawer />
      <main>{children}</main>
      {!shouldExcludePath(path) && <Footer />}
    </Elements>
  )
}

export default PageWrapper
