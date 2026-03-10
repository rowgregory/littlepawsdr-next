import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Little Paws Dachshund Rescue',
  description: 'The page you were looking for could not be found.'
}

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0891b2 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-primary-light/8 dark:bg-primary-dark/6 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-75 h-50 bg-secondary-light/6 dark:bg-secondary-dark/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* ── 404 number ── */}
        <div className="relative mb-6 select-none" aria-hidden="true">
          <span className="block font-quicksand font-black leading-none text-[clamp(96px,25vw,180px)] text-border-light dark:text-border-dark">
            404
          </span>
          {/* Overlay centered text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" />
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary-light dark:text-primary-dark">Not Found</p>
              <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" />
            </div>
          </div>
        </div>

        {/* ── Heading ── */}
        <h1 className="font-quicksand font-black text-2xl xs:text-3xl text-text-light dark:text-text-dark leading-tight mb-3">This page ran away</h1>
        <p className="text-sm text-muted-light dark:text-on-dark leading-relaxed max-w-sm mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on the right trail.
        </p>

        {/* ── Actions ── */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono font-black tracking-[0.25em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-light dark:focus-visible:ring-offset-bg-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Go Home
          </Link>

          <Link
            href="/dachshunds"
            className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 hover:text-primary-light dark:hover:text-primary-dark text-[10px] font-mono tracking-[0.25em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Meet the Dogs
          </Link>
        </div>

        {/* ── Help link ── */}
        <p className="mt-10 text-[10px] font-mono text-muted-light dark:text-muted-dark">
          Need help?{' '}
          <Link
            href="/contact"
            className="text-primary-light dark:text-primary-dark hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Contact us
          </Link>
        </p>
      </div>
    </main>
  )
}
