'use client'

import { useEffect, ReactNode } from 'react'
import { store } from '../store/store'
import { setIsDark } from '../store/slices/uiSlice'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const dark = mediaQuery.matches
      document.documentElement.classList.toggle('dark', dark)
      store.dispatch(setIsDark(dark))
    }

    applyTheme()
    mediaQuery.addEventListener('change', applyTheme)
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [])

  return <>{children}</>
}
