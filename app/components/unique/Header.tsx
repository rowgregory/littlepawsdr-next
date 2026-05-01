import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Menu, ShoppingBasket } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { store, useCartSelector, useUiSelector } from 'app/lib/store/store'
import GoogleTranslate from './GoogleTranslate'
import { useIsAtTop } from '@hooks/useIsAtTop'
import { setOpenContactModal, setOpenMobileNavigation } from 'app/lib/store/slices/uiSlice'
import Picture from '../common/Picture'
import { NavDropdown } from '../header/NavDropdown'
import { mainNavigationLinks } from 'app/lib/constants/navigation'
import AuctionAnnouncementStrip from './AuctionAnnouncementStrip'

export default function Header({ auction }) {
  const { data, status } = useSession()
  const router = useRouter()
  const isAtTop = useIsAtTop()
  const { mobileNavigation } = useUiSelector()
  const { items } = useCartSelector()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const getLaunchPath = () => {
    if (status !== 'authenticated') return '/auth/login'
    return ['ADMIN', 'SUPERUSER'].includes(data?.user?.role ?? '') ? '/admin/dashboard' : '/member/portal'
  }

  const handleLaunchApp = () => router.push(getLaunchPath())

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-primary-light dark:focus:bg-primary-dark focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Bar */}
      <header role="banner" className={`pr-6 1336:pr-0 w-full mx-auto bg-topbar-light dark:bg-topbar-dark relative z-100 h-11`}>
        <div className={`max-w-334 mx-auto flex items-center justify-between h-11`}>
          <div className="flex items-center space-x-4 lg:space-x-10">
            <GoogleTranslate />
            <address className="hidden sm:flex items-center space-x-4 lg:space-x-6 not-italic" aria-label="Contact and organizational information">
              <button
                onClick={() => store.dispatch(setOpenContactModal())}
                aria-label="Email us at lpdr@littlepawsdr.org"
                className="text-on-dark text-[10px] font-mono tracking-[0.15em] uppercase hover:text-primary-light dark:hover:text-primary-dark transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
              >
                lpdr@littlepawsdr.org
              </button>
              <span
                className="hidden md:inline text-on-dark text-[10px] font-mono tracking-[0.15em] uppercase"
                aria-label="Mailing address: P.O. Box 108, Brookfield, CT 06804"
              >
                P.O. Box 108 · Brookfield, CT 06804
              </span>
              <span
                className="hidden lg:inline text-on-dark text-[10px] font-mono tracking-[0.15em] uppercase"
                aria-label="Tax ID number: 46-3079501"
              >
                EIN 46-3079501
              </span>
            </address>
          </div>

          {/* Utility actions */}
          <nav aria-label="Utility navigation">
            <ul className={`flex items-center space-x-6 list-none`}>
              <li>
                <Link
                  href="/cart"
                  aria-label={`View shopping cart${totalItems > 0 ? ` — ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ''}`}
                  className="relative inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded p-1"
                >
                  <ShoppingBasket
                    className="w-4 h-4 text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                    aria-hidden="true"
                  />
                  {totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary-light dark:bg-primary-dark text-white text-[9px] font-mono font-bold rounded-full"
                      aria-hidden="true"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLaunchApp}
                  type="button"
                  aria-label="Launch the member app"
                  className="text-on-dark hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
                >
                  Launch App
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Nav */}
      <motion.nav
        className={`px-6 w-full mx-auto sticky top-0 bg-navbar-light dark:bg-navbar-dark z-110 flex flex-col justify-center`}
        animate={{ height: isAtTop ? '124.5px' : '84.5px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-334 mx-auto w-full flex items-center justify-between relative">
          <div className="flex items-center gap-x-10">
            <Link
              href="/"
              aria-label="Little Paws Dachshund Rescue - Home"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <motion.div
                className="flex items-center space-x-3"
                initial={{ scale: 1 }}
                animate={{ scale: isAtTop ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="overflow-hidden flex items-center justify-center"
                  initial={{ height: '80px' }}
                  animate={{ height: isAtTop ? '80px' : '48px' }}
                  transition={{ duration: 0.3 }}
                >
                  <Picture
                    src="/images/logos/logo.png"
                    alt="Little Paws Dachshund Rescue"
                    className="block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                    priority
                  />
                </motion.div>
              </motion.div>
            </Link>
            <button
              onClick={() => store.dispatch(setOpenMobileNavigation())}
              className="block xl:hidden text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavigation}
              aria-controls="mobile-navigation"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Main navigation">
            <ul className="flex items-center space-x-6 list-none">
              {mainNavigationLinks.map((section) => (
                <NavDropdown key={section.title} section={section} />
              ))}
            </ul>
          </nav>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} animate={{ scale: isAtTop ? 1 : 0.9 }} transition={{ duration: 0.3 }}>
            <Link
              href="/donate"
              aria-label="Donate to Little Paws Dachshund Rescue today"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light dark:focus-visible:ring-offset-primary-dark"
            >
              Donate
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <div className={`w-full mx-auto bg-topbar-light dark:bg-topbar-dark relative z-100`}>
        <div className={`mx-auto flex items-center justify-between`}>
          <AuctionAnnouncementStrip auction={auction} />
        </div>
      </div>
    </>
  )
}
