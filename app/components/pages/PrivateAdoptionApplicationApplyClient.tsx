'use client'

import { fadeUp } from 'app/lib/constants/motion'
import { useUiSelector } from 'app/lib/store/store'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function useCountdown(expiresAt: Date | null) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!expiresAt) return

    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return timeLeft
}

export default function PrivateAdoptionApplicationApplyClient({ isActive, expiresAt }: { isActive: boolean; expiresAt: Date | null }) {
  const router = useRouter()
  const timeLeft = useCountdown(expiresAt)
  const { isDark } = useUiSelector()

  useEffect(() => {
    if (!isActive) {
      router.replace('/adopt/application')
    }
  }, [isActive, router])

  if (!isActive) return null

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Adoption</p>
          </div>
          <h1 className="font-changa text-4xl sm:text-5xl uppercase leading-none text-text-light dark:text-text-dark mb-5">Adoption Application</h1>
          <p className="text-base text-muted-light dark:text-muted-dark leading-relaxed">
            Thank you for taking the next step toward adopting a Little Paws dachshund. Please complete the application below. Our team will review
            your submission and be in touch within 3–5 business days.
          </p>
        </motion.div>

        {/* ── Timer ── */}
        {expiresAt && timeLeft && (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="mb-8">
            <div
              className={`flex items-center justify-between px-4 py-3 border ${
                timeLeft === 'Expired'
                  ? 'border-red-500/30 bg-red-50 dark:bg-red-500/5'
                  : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark'
              }`}
              role="timer"
              aria-label={`Application access expires in ${timeLeft}`}
            >
              <div className="flex items-center gap-2">
                <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Access Expires</p>
              </div>
              <p
                className={`font-changa text-sm uppercase tracking-wide tabular-nums ${
                  timeLeft === 'Expired' ? 'text-red-500 dark:text-red-400' : 'text-primary-light dark:text-primary-dark'
                }`}
              >
                {timeLeft}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Application iframe ── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          custom={2}
          aria-labelledby="application-heading"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <h2 id="application-heading" className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
              Application Form
            </h2>
          </div>
          <div className="border border-border-light dark:border-border-dark overflow-hidden">
            {isDark ? (
              <iframe
                title="Adoption Application"
                width="100%"
                className="h-150 sm:h-175 block"
                src="https://toolkit.rescuegroups.org/of/f?c=ZKCVRYSQ"
              ></iframe>
            ) : (
              <iframe
                title="Adoption Application"
                width="100%"
                className="h-150 sm:h-175 block"
                src="https://toolkit.rescuegroups.org/of/f?c=WHMQCBRV"
              />
            )}
          </div>
        </motion.section>
      </div>
    </main>
  )
}
