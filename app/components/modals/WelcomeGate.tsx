'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { store } from 'app/lib/store/store'
import { setShowConfetti } from 'app/lib/store/slices/uiSlice'
import { markWelcomeSeen } from 'app/lib/actions/user/markWelcomeSeen'
import { TalkingDachshund } from '../unique/TalkingDachshund'

export function WelcomeGate({ show, userName }: { show: boolean; userName: string | null }) {
  const [open, setOpen] = useState(show)

  useEffect(() => {
    if (!show) return
    store.dispatch(setShowConfetti())
    markWelcomeSeen()
  }, [show])

  const firstName = userName?.split(' ')[0]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-heading"
        >
          <motion.div
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-6 py-10 sm:px-8 sm:py-12 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mascot — front and center, large */}
            <div className="mb-8">
              <TalkingDachshund
                message={firstName ? `Hi ${firstName}! Welcome to the pack!` : 'Welcome to the pack!'}
                bubbleSide="top"
                size={200}
                typeSpeed={45}
                startDelay={500}
              />
            </div>

            {/* One-line explainer */}
            <h2
              id="welcome-heading"
              className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-8 max-w-xs"
            >
              This is your <strong className="text-text-light dark:text-text-dark">Member Portal</strong> — your home
              base for everything Little Paws.
            </h2>

            {/* Single close button */}
            <button
              onClick={() => setOpen(false)}
              className="w-full bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono font-black tracking-[0.25em] uppercase py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              Let&apos;s go
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
