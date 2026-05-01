import createNewsletter from 'app/lib/actions/createNewsletter'
import { mainNavigationLinks } from 'app/lib/constants/navigation'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { setCloseMobileNavigation, setOpenMobileNavigation } from 'app/lib/store/slices/uiSlice'
import { store, useUiSelector } from 'app/lib/store/store'
import { EMAIL_REGEX } from 'app/utils/regex'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, LayoutDashboard, User, ShoppingCart, Gavel, ArrowRight, Mail } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoogleIcon } from '../ui/icons/GoogleIcon'

const NavigationDrawer = ({ auction }) => {
  const { mobileNavigation } = useUiSelector()
  const pathname = usePathname()
  const session = useSession()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [magicLinkEmail, setMagicLinkEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClose = () => store.dispatch(setCloseMobileNavigation())
  const isAuctionDraft = auction?.status === 'DRAFT'
  const isAuctionActive = auction?.status === 'ACTIVE'

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!EMAIL_REGEX.test(email)) {
      store.dispatch(showToast({ message: 'Error, please try again', type: 'error' }))
      return
    }
    setLoading(true)
    await createNewsletter(email)
    store.dispatch(showToast({ message: 'Email submitted for newsletter', type: 'success' }))
    setEmail('')
    setLoading(false)
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auth') === 'success') {
      store.dispatch(setOpenMobileNavigation())
    }
  }, [searchParams])

  const isLinkActive = (link: string) => pathname === link

  const coreGradient = {
    background: 'linear-gradient(90deg, #0e7490, #0891b2, #06b6d4, #0891b2, #0e7490)',
    backgroundSize: '200% 100%',
    animation: 'stripScroll 4s linear infinite'
  }

  async function handleMagicLink() {
    if (!email || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await signIn('email', { email: magicLinkEmail, redirect: false, redirectTo: `${pathname}?auth=success` })
      if (res?.error) throw new Error(res.error)
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { redirect: true, redirectTo: `${pathname}?auth=success` })
  }

  return (
    <AnimatePresence>
      {mobileNavigation && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-120"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed left-0 top-0 h-screen w-full sm:w-96 bg-bg-light dark:bg-bg-dark border-r border-border-light dark:border-border-dark z-130 overflow-y-auto"
            initial={{ x: -500 }}
            animate={{ x: 0 }}
            exit={{ x: -500 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <span className="font-changa text-f10 uppercase tracking-[0.25em] text-primary-light dark:text-primary-dark">Little Paws</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
              {/* ── Auction banner ── */}
              {auction?.status && (isAuctionActive || isAuctionDraft) && (
                <div
                  style={{
                    background: isAuctionActive
                      ? 'linear-gradient(90deg, #7c3aed, #db2777, #ea580c, #db2777, #7c3aed)'
                      : 'linear-gradient(90deg, #0e7490, #0891b2, #06b6d4, #0891b2, #0e7490)',
                    backgroundSize: '200% 100%',
                    animation: 'stripScroll 4s linear infinite'
                  }}
                >
                  <Link
                    href={`/auctions/${auction?.customAuctionLink}`}
                    onClick={onClose}
                    className="relative overflow-hidden flex items-start gap-3 p-4 backdrop-blur-sm bg-white/10 border-y border-white/20 transition-colors hover:bg-white/20"
                  >
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Gavel className="w-4 h-4 text-white shrink-0 mt-0.5" aria-hidden="true" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-changa text-xs uppercase tracking-wide text-white leading-snug">
                        {isAuctionActive ? `${auction?.title} — Live Now` : `${auction?.title} — Coming Soon`}
                      </p>
                      <p className="font-lato text-f10 text-white/70 mt-0.5">{isAuctionActive ? 'Bid now on amazing items' : 'Get ready to bid'}</p>
                    </div>
                    {isAuctionActive && (
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white text-sm shrink-0"
                        aria-hidden="true"
                      >
                        →
                      </motion.span>
                    )}
                  </Link>
                </div>
              )}

              {/* ── User / auth ── */}
              <div className="px-4 py-4 space-y-1">
                {session.data?.user ? (
                  <>
                    {session.data.user.role === 'ADMIN' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="font-changa text-xs uppercase tracking-[0.15em]">Dashboard</span>
                      </Link>
                    )}
                    <Link
                      href="/supporter/profile"
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        isLinkActive('/profile')
                          ? 'text-primary-light dark:text-primary-dark bg-surface-light dark:bg-surface-dark'
                          : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="font-changa text-xs uppercase tracking-[0.15em]">Profile</span>
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-4 space-y-3 border-l-2 border-primary-light dark:border-primary-dark">
                    <div>
                      <p className="font-changa text-xs uppercase tracking-[0.25em] text-text-light dark:text-text-dark">Sign In</p>
                      <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-1 leading-relaxed">
                        Sign in to view your profile, orders, and more.
                      </p>
                    </div>

                    {/* Google */}
                    <button
                      onClick={handleGoogle}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-bg-light dark:hover:bg-bg-dark text-text-light dark:text-text-dark transition-colors focus-visible:outline-none"
                    >
                      <GoogleIcon />
                      <span className="font-changa text-xs uppercase tracking-[0.15em]">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                      <span className="font-lato text-f10 text-muted-light dark:text-muted-dark">or</span>
                      <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                    </div>

                    {/* Magic link */}
                    {!sent ? (
                      <div className="space-y-2">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={magicLinkEmail ?? ''}
                          onChange={(e) => setMagicLinkEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
                          className="w-full px-3.5 py-2.5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
                        />
                        {error && <p className="font-lato text-xs text-red-500">{error}</p>}
                        <button
                          onClick={handleMagicLink}
                          disabled={!magicLinkEmail || loading}
                          className="w-full py-2.5 px-4 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-changa text-f10 uppercase tracking-[0.25em] transition-colors focus-visible:outline-none"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white"
                                aria-hidden="true"
                              />
                              Sending...
                            </span>
                          ) : (
                            'Send Magic Link'
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                        <Mail className="w-4 h-4 text-primary-light dark:text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-changa text-xs uppercase tracking-[0.15em] text-text-light dark:text-text-dark">Check your inbox</p>
                          <p className="font-lato text-xs text-muted-light dark:text-muted-dark mt-0.5 leading-relaxed">
                            Magic link sent to <span className="text-text-light dark:text-text-dark">{email}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mx-4 border-t border-border-light/50 dark:border-border-dark" />

              <Link
                href="/cart"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isLinkActive('/cart')
                    ? 'text-primary-light dark:text-primary-dark bg-surface-light dark:bg-surface-dark'
                    : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                }`}
              >
                <ShoppingCart className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-changa text-xs uppercase tracking-[0.15em]">Cart</span>
              </Link>

              <div className="mx-4 border-t border-border-light/50 dark:border-border-dark" />

              {/* ── Newsletter ── */}
              <div className="px-4 py-5">
                <p className="font-changa text-f10 uppercase tracking-[0.25em] text-muted-light dark:text-muted-dark mb-1">Stay Updated</p>
                <p className="font-lato text-xs text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
                  Subscribe to our newsletter for rescues, events, and adoption opportunities!
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark font-lato text-sm focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed text-white font-changa text-f10 uppercase tracking-[0.25em] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    style={coreGradient}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-3.5 h-3.5 border-2 border-white/30 border-t-white"
                          aria-hidden="true"
                        />
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
                <Link
                  href="/newsletter-issues"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 mt-4 font-changa text-f10 uppercase tracking-[0.25em] text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors"
                >
                  View Newsletters
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.div>
                </Link>
              </div>

              <div className="mx-4 border-t border-border-light dark:border-border-dark" />

              {/* ── Nav links ── */}
              <nav className="px-4 py-4 space-y-0.5" aria-label="Mobile navigation">
                {mainNavigationLinks.map((navLink, idx) => (
                  <div key={idx}>
                    {navLink.linkKey ? (
                      <Link
                        href={navLink.linkKey}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          isLinkActive(navLink.linkKey)
                            ? 'text-primary-light dark:text-primary-dark bg-surface-light dark:bg-surface-dark border-l-2 border-primary-light dark:border-primary-dark'
                            : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                        }`}
                      >
                        <navLink.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="font-changa text-xs uppercase tracking-[0.15em]">{navLink.title}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSection(navLink.title)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus-visible:outline-none"
                      >
                        <navLink.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="font-changa text-xs uppercase tracking-[0.15em] flex-1 text-left">{navLink.title}</span>
                        <motion.div animate={{ rotate: expandedSections.includes(navLink.title) ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </motion.div>
                      </button>
                    )}

                    <AnimatePresence>
                      {navLink.links && expandedSections.includes(navLink.title) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-10 space-y-0.5"
                        >
                          {navLink.links.map((subLink, subIdx) => (
                            <motion.div
                              key={subIdx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: subIdx * 0.04 }}
                            >
                              <Link
                                href={subLink.linkKey}
                                onClick={onClose}
                                className={`block px-4 py-2 font-lato text-xs transition-colors ${
                                  isLinkActive(subLink.linkKey)
                                    ? 'text-primary-light dark:text-primary-dark font-semibold'
                                    : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
                                }`}
                              >
                                {subLink.linkText}
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NavigationDrawer
