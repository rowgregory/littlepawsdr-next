import { slideVariants } from 'app/lib/constants/motion.constants'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

export function Step0SignIn({
  magicLinkSent,
  magicEmail,
  setMagicEmail,
  handleMagicLink,
  isSendingMagicLink,
  setMagicLinkSent
}) {
  return (
    <motion.section
      key="sign-in"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      aria-labelledby="step-sign-in-heading"
      className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-6 sm:p-8"
    >
      <h2
        id="step-sign-in-heading"
        className="font-quicksand text-2xl font-bold text-text-light dark:text-text-dark mb-2"
      >
        Sign in to continue
      </h2>
      <p className="text-sm text-muted-light dark:text-muted-dark mb-8 leading-relaxed">
        We need to verify your identity before you start your adoption application. Sign in with Google or your email —
        it only takes a moment.
      </p>

      {/* Google */}
      <button
        type="button"
        onClick={() => signIn('google', { redirectTo: '/adopt/application' })}
        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 mb-3 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark text-sm font-mono tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5" aria-hidden="true">
        <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark">
          or
        </span>
        <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
      </div>

      {/* Magic link */}
      {!magicLinkSent ? (
        <div>
          <label
            htmlFor="magic-email"
            className="block text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2"
          >
            Email Address
          </label>
          <div className="flex gap-2">
            <input
              id="magic-email"
              type="email"
              autoComplete="email"
              value={magicEmail}
              onChange={(e) => setMagicEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMagicLink()}
              placeholder="you@example.com"
              className="flex-1 px-3.5 py-3 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 text-sm font-mono focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark transition-colors"
            />
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={!magicEmail || isSendingMagicLink}
              className="px-4 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center gap-2"
            >
              {isSendingMagicLink ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : 'Send Link'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-l-2 border-primary-light dark:border-primary-dark pl-4">
          <p className="text-sm text-text-light dark:text-text-dark font-mono mb-1">Check your inbox</p>
          <p className="text-xs text-muted-light dark:text-muted-dark mb-3">
            We sent a sign in link to <strong>{magicEmail}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setMagicLinkSent(false)
              setMagicEmail('')
            }}
            className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none"
          >
            Use a different email
          </button>
        </div>
      )}
    </motion.section>
  )
}
