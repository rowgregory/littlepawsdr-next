'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { store } from 'app/lib/store/store'
import { setOpenMobileNavigation } from 'app/lib/store/slices/uiSlice'

export function AuthRedirectWatcher() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('ref') === 'navdrawer') {
      store.dispatch(setOpenMobileNavigation())
    }
  }, [searchParams])

  return null
}
