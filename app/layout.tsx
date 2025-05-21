import type { Metadata } from 'next'
import ReduxWrapper from './redux-wrapper'
import { Inter, Rubik } from 'next/font/google'
import './globals.css'
import './fonts.css'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
  preload: false
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
  preload: false
})

export const metadata: Metadata = {
  title: 'Little Paws Dachshund Rescue',
  description:
    'We specialize in finding permanent homes for dachshund and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness and education.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${rubik.className}`}>
        <ReduxWrapper data={{}}>{children}</ReduxWrapper>
      </body>
    </html>
  )
}
