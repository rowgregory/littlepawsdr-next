'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GoogleButton } from 'app/components/login/GoogleButton'
import { MagicLink } from 'app/components/login/MagicLink'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main
      id="main-content"
      className="min-h-dvh bg-bg-light dark:bg-bg-dark flex flex-col px-4 py-10 xs:py-14 xs:items-center xs:justify-center relative overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.055]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        {/* Accent bars */}
        <div className="absolute top-0 left-0 w-px h-full bg-border-light dark:bg-border-dark" />
        <div className="absolute top-0 right-0 w-px h-full bg-border-light dark:bg-border-dark" />
        <div className="absolute top-0 left-0 w-1 h-32 bg-primary-light dark:bg-primary-dark" />
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-primary-light dark:bg-primary-dark" />
        {/* Glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary-light/8 dark:bg-primary-dark/6 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm xs:mx-auto flex flex-col justify-between min-h-[calc(100dvh-5rem)] xs:min-h-0">
        <div>
          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 xs:mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-5 xs:mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              aria-label="Little Paws Dachshund Rescue — Home"
            >
              <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary-light dark:text-primary-dark">
                Little Paws
              </span>
              <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            </Link>

            <h1 className="font-quicksand font-black text-[28px] xs:text-[32px] text-text-light dark:text-text-dark leading-none mb-2 tracking-tight">
              Welcome back.
            </h1>
            <p className="text-[11px] xs:text-xs font-mono text-muted-light dark:text-muted-dark tracking-widest">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-surface-dark relative overflow-hidden"
          >
            {/* Card top accent */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 bg-primary-light dark:bg-primary-dark"
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              {sent ? (
                /* ── Success ── */
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 xs:p-8 flex flex-col items-center gap-5 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="w-14 h-14 border-2 border-primary-light dark:border-primary-dark flex items-center justify-center bg-primary-light/5 dark:bg-primary-dark/5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-primary-light dark:text-primary-dark"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="square"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <div>
                    <p className="font-quicksand font-black text-xl text-text-light dark:text-text-dark mb-1">
                      Check your email
                    </p>
                    <p className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                      Magic link sent to
                    </p>
                    <p className="text-[12px] font-mono text-primary-light dark:text-primary-dark font-bold mt-0.5 truncate px-2">
                      {email}
                    </p>
                  </div>

                  <div className="w-full border border-border-light dark:border-border-dark bg-surface-light dark:bg-bg-dark px-4 py-3">
                    <p className="text-[11px] font-nunito text-text-light dark:text-text-dark leading-relaxed">
                      Click the link in your email to sign in. It expires in <strong>24 hours</strong>.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSent(false)
                      setEmail('')
                    }}
                    className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Try a different email
                  </button>

                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    Didn&apos;t receive it? Check your spam folder.
                  </p>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 xs:p-8 flex flex-col gap-5"
                >
                  {/* Google */}
                  <GoogleButton redirectTo="/auth/login" />

                  {/* Divider */}
                  <div className="flex items-center gap-3" aria-hidden="true">
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                      or
                    </span>
                    <span className="flex-1 h-px bg-border-light dark:bg-border-dark" />
                  </div>

                  {/* Email */}
                  <MagicLink email={email} redirectTo="/auth/login" setEmail={setEmail} setSent={setSent} />

                  {/* Footer note */}
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark text-center leading-relaxed border-t border-border-light dark:border-border-dark pt-4">
                    New to Little Paws?{' '}
                    <Link
                      href="/adopt"
                      className="text-primary-light dark:text-primary-dark hover:underline underline-offset-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-light"
                    >
                      Start your adoption journey
                    </Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Bottom stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 xs:mt-10 grid grid-cols-3 border border-border-light dark:border-border-dark divide-x divide-border-light dark:divide-border-dark"
          aria-label="Little Paws by the numbers"
        >
          {[
            { value: '1,500+', label: 'Rescued' },
            { value: '1,200+', label: 'Adopted' },
            { value: '300+', label: 'Volunteers' }
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 py-3">
              <span className="font-quicksand font-black text-[15px] xs:text-[17px] text-primary-light dark:text-primary-dark tabular-nums leading-none">
                {value}
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Privacy ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] font-mono text-muted-light dark:text-muted-dark mt-5 leading-relaxed"
        >
          By signing in you agree to our{' '}
          <Link
            href="/privacy-policy"
            className="text-primary-light dark:text-primary-dark hover:underline underline-offset-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Privacy Policy
          </Link>
        </motion.p>
      </div>
    </main>
  )
}
