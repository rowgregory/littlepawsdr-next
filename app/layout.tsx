import type { Metadata } from 'next'
import { Bebas_Neue, Nunito, Quicksand, Work_Sans } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from './lib/auth'
import { RootLayoutWrapper } from './root-layout'
import getDraftOrActiveAuction from './lib/actions/getDraftOrActiveAuction'

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
  variable: '--font-work-sans'
})
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
  variable: '--font-quicksand'
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: false,
  variable: '--font-nunito'
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
  variable: '--font-bebas'
})

export const metadata: Metadata = {
  title: 'Little Paws Dachshund Rescue',
  description:
    'We specialize in finding permanent homes for dachshund and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness and education.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const result = await getDraftOrActiveAuction()
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${workSans.variable} ${bebas.variable} ${nunito.variable} `}>
        <SessionProvider session={session}>
          <RootLayoutWrapper auction={result.data}>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
