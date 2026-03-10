import Link from 'next/link'
import Picture from '../common/Picture'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Adopt', href: '/adopt' },
  { label: 'Foster', href: '/foster' },
  { label: 'Donate', href: '/donate' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/LittlePawsDachshundRescue',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/littlepawsdr/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }
]

export default function Footer() {
  return (
    <footer className="bg-navbar-light dark:bg-navbar-dark text-text-dark" aria-label="Site footer">
      <div className="max-w-180 1000:max-w-240 1200:max-w-300 mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12">
          {/* Col 1 — Brand */}
          <div className="xs:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Little Paws Dachshund Rescue - Footer"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <Picture
                src="/images/logos/logo.png"
                alt="Little Paws Dachshund Rescue"
                className="block w-auto h-28 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </Link>

            <address className="not-italic mt-6 space-y-2 text-sm text-on-dark">
              <p>
                <span className="font-semibold text-white">Email: </span>

                <a
                  href="mailto:info@littlepawsdr.org"
                  className="hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
                >
                  info@littlepawsdr.org
                </a>
              </p>
            </address>

            {/* Socials */}
            <nav aria-label="Social media links" className="mt-6">
              <ul className="flex items-center gap-4" role="list">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in new tab)`}
                      className="text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 2 — Hours */}
          <div>
            <h2 className="text-white font-quicksand font-bold text-base mb-5">Hours</h2>
            <dl className="space-y-2 text-sm">
              {[
                { day: 'Monday', hours: '9:00am – 5:00pm' },
                { day: 'Tuesday', hours: '9:00am – 5:00pm' },
                { day: 'Wednesday', hours: '9:00am – 5:00pm' },
                { day: 'Thursday', hours: '9:00am – 5:00pm' },
                { day: 'Friday', hours: '9:00am – 5:00pm' },
                { day: 'Saturday', hours: '10:00am – 3:00pm' },
                { day: 'Sunday', hours: 'Closed' }
              ].map(({ day, hours }) => (
                <div key={day} className="flex justify-between gap-4">
                  <dt className="text-on-dark flex-1">{day}</dt>
                  <div className="flex flex-col justify-start w-full flex-2">
                    <dd className={hours === 'Closed' ? 'text-muted-dark' : 'text-primary-light dark:text-primary-dark font-medium'}>{hours}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Col 3 — Nav */}
          <div>
            <h2 className="text-white font-quicksand font-bold text-base mb-5">Quick Links</h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2.5" role="list">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h2 className="text-white font-quicksand font-bold text-base mb-5">Newsletter</h2>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup" className="space-y-3">
              <div>
                <label htmlFor="footer-name" className="sr-only">
                  Your name
                </label>
                <input
                  id="footer-name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder:text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
                />
              </div>
              <div>
                <label htmlFor="footer-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  autoComplete="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder:text-on-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-primary-light dark:border-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col xs:flex-row items-center justify-between gap-3 text-xs text-on-dark">
          <div className="flex items-center gap-3 flex-wrap justify-center xs:justify-start">
            <Link
              href="/privacy-policy"
              className="hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true">|</span>
            <Link
              href="/terms"
              className="hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
            >
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="text-center xs:text-right">
            Built &amp; designed by{' '}
            <a
              href="https://sqysh.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light dark:text-primary-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded"
            >
              Sqysh
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
