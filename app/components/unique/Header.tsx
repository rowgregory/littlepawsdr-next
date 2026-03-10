import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, ShoppingBasket, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { store, useUiSelector } from 'app/lib/store/store'
import GoogleTranslate from './GoogleTranslate'
import { useIsAtTop } from '@hooks/useIsAtTop'
import { setOpenMobileNavigation } from 'app/lib/store/slices/uiSlice'
import Picture from '../common/Picture'
import { NavDropdown } from '../header/NavDropdown'
import { mainNavigationLinks } from 'app/lib/constants/navigation'

export default function Header() {
  const { data, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isAtTop = useIsAtTop()
  const { mobileNavigation } = useUiSelector()

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
      <header
        role="banner"
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto bg-topbar-light dark:bg-topbar-dark relative z-100 h-11`}
      >
        <div className={`${pathname !== '/' ? 'max-w-334' : ''} mx-auto flex items-center justify-between h-11`}>
          <div className="flex items-center space-x-4 lg:space-x-10">
            <GoogleTranslate />
            <address
              className="hidden sm:flex items-center space-x-4 lg:space-x-6 text-on-dark text-sm font-nunito not-italic"
              aria-label="Contact and organizational information"
            >
              <div>
                <span className="sr-only">Email: </span>

                <a
                  href="mailto:lpdr@littlepawsdr.org"
                  aria-label="Email us at lpdr@littlepawsdr.org"
                  className="text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
                >
                  <span aria-hidden="true">Email: </span>lpdr@littlepawsdr.org
                </a>
              </div>
              <div className="hidden md:block" aria-label="Mailing address: P.O. Box 108, Brookfield, CT 06804">
                <span aria-hidden="true">Address: </span>
                <span className="text-on-dark">P.O. Box 108, Brookfield, CT 06804</span>
              </div>
              <div className="hidden lg:block" aria-label="Tax ID number: 46-3079501">
                <span aria-hidden="true">Tax ID: </span>
                <span className="text-on-dark">46-3079501</span>
              </div>
            </address>
          </div>

          {/* Utility actions */}
          <nav aria-label="Utility navigation">
            <ul className={`${pathname === '/' ? 'pr-10' : ''} flex items-center space-x-6 list-none`}>
              <li>
                <Link
                  href="/cart"
                  aria-label="View shopping cart"
                  className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded p-1"
                >
                  <ShoppingBasket
                    className="w-4 h-4 text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLaunchApp}
                  className="text-on-dark hover:text-primary-light dark:hover:text-primary-dark text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded font-nunito"
                  aria-label="Launch the member app"
                  type="button"
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
        className={`${pathname === '/' ? 'max-w-334 pl-13.75 pr-7.5' : ''} w-full mx-auto sticky top-0 bg-navbar-light dark:bg-navbar-dark z-50 flex`}
        animate={{ height: isAtTop ? '124.5px' : '84.5px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-334 mx-auto w-full flex items-center justify-between relative">
          <button
            onClick={() => store.dispatch(setOpenMobileNavigation())}
            className="block 2xl:hidden text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavigation}
            aria-controls="mobile-navigation"
          >
            {mobileNavigation ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>

          <Link
            href="/"
            aria-label="Little Paws Dachshund Rescue - Home"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 2xl:relative 2xl:left-auto 2xl:translate-x-0 2xl:top-auto 2xl:translate-y-0"
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

          <nav aria-label="Main navigation">
            <ul className="hidden 2xl:flex items-center space-x-6 list-none">
              {mainNavigationLinks.map((section) => (
                <NavDropdown key={section.title} section={section} />
              ))}
            </ul>
          </nav>

          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} animate={{ scale: isAtTop ? 1 : 0.9 }} transition={{ duration: 0.3 }}>
            <Link
              href="/donate"
              aria-label="Donate to Little Paws Dachshund Rescue today"
              className="inline-flex items-center justify-center gap-2 px-15 py-5 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white font-semibold font-nunito transition-colors duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light dark:focus-visible:ring-offset-primary-dark"
            >
              Donate
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}
