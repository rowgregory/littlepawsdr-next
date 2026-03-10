import type { Metadata } from 'next'
import { Nunito, Quicksand, Work_Sans } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from './lib/auth'
import { RootLayoutWrapper } from './root-layout'

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

export const metadata: Metadata = {
  title: 'Little Paws Dachshund Rescue',
  description:
    'We specialize in finding permanent homes for dachshund and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness and education.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${workSans.variable} ${nunito.variable}`}>
        <SessionProvider session={session}>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
