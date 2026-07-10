import type { Metadata } from 'next'
import { Bebas_Neue, Nunito, Quicksand, Work_Sans } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { RootLayoutWrapper } from './root-layout'
import { getCachedAuction } from './lib/actions/auction/getCachedAuction'
import { cookies } from 'next/headers'

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
  metadataBase: new URL('https://littlepawsdr.org'),

  title: {
    default: 'Little Paws Dachshund Rescue',
    template: '%s | Little Paws Dachshund Rescue'
  },
  description:
    'We specialize in finding permanent homes for dachshunds and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness, and education.',

  applicationName: 'Little Paws Dachshund Rescue',
  keywords: [
    'dachshund rescue',
    'dachshund adoption',
    'dog rescue',
    'East Coast dog rescue',
    'dachshund mixes',
    'foster dogs',
    'nonprofit dog rescue'
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://littlepawsdr.org',
    siteName: 'Little Paws Dachshund Rescue',
    title: 'Little Paws Dachshund Rescue',
    description:
      'We specialize in finding permanent homes for dachshunds and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness, and education.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/little-paws-dachshund-re-a1632.appspot.com/o/images%2Flpdr-rich-preview.png?alt=media&token=cec2408b-9d4b-4af6-ad3e-365d98a91f52',
        width: 1200,
        height: 630,
        alt: 'Little Paws Dachshund Rescue'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Little Paws Dachshund Rescue',
    description:
      'We specialize in finding permanent homes for dachshunds and dachshund mixes. We strive to make the lives of all dogs better through action, advocacy, awareness, and education.',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/little-paws-dachshund-re-a1632.appspot.com/o/images%2Flpdr-rich-preview.png?alt=media&token=cec2408b-9d4b-4af6-ad3e-365d98a91f52'
    ]
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  alternates: {
    canonical: 'https://littlepawsdr.org'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const hasActiveFee = cookieStore.get('lpdr_active_adoption_fee')?.value === '1'

  const auction = await getCachedAuction()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark')`
          }}
        />
      </head>
      <body className={`${quicksand.variable} ${workSans.variable} ${bebas.variable} ${nunito.variable} `}>
        <SessionProvider refetchOnWindowFocus={false}>
          <RootLayoutWrapper auction={auction} hasActiveFee={hasActiveFee}>
            {children}
          </RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}
