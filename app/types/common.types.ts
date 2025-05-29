import { ReactNode } from 'react'

export interface PageWrapperProps {
  children: ReactNode
}

export interface LayoutProps {
  children: ReactNode
}

export interface ClientPageProps {
  children: ReactNode
  data: any
}
