import type { Metadata } from 'next'
import ReduxWrapper from './redux-wrapper'
import { Quicksand, Work_Sans } from 'next/font/google'
import './globals.css'
import './fonts.css'

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

export const metadata: Metadata = {
  title: 'Little Paws Dachshund Rescue',
  description:
    'We specialize in finding permanent homes for dachshund and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness and education.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${workSans.variable}`}>
        <ReduxWrapper data={{}}>{children}</ReduxWrapper>
      </body>
    </html>
  )
}
