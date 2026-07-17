'use client'

import { motion } from 'framer-motion'
import { TABS } from 'app/lib/constants/my-pack.constants'
import { useRouter } from 'next/navigation'
import { MyPackTab } from 'types/_my-pack.types'

export function MyPackNav({ active }: { active: MyPackTab }) {
  const router = useRouter()

  const navigate = (tab: MyPackTab) => {
    router.push(`/my-pack?tab=${tab}`, { scroll: false })
  }

  return (
    <>
      {/* ── Desktop horizontal tab bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex items-center border-b border-border-light dark:border-border-dark"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`relative flex items-center gap-2 px-5 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                isActive
                  ? 'text-primary-light dark:text-primary-dark'
                  : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {label}
              {isActive && (
                <motion.span
                  layoutId="desktop-nav-underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute bottom-0 left-0 right-0 h-px bg-primary-light dark:bg-primary-dark"
                />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* ── Mobile floating bottom bar — liquid glass ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        role="navigation"
        aria-label="My Pack navigation"
        style={{ x: '-50%' }}
      >
        <div
          className="flex items-center px-2 py-2 gap-1"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow:
              '0 8px 32px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset, 0 0 0 0.5px rgba(0,0,0,0.08)'
          }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-1 px-5 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)'
                    }}
                  />
                )}
                <Icon
                  className="relative w-5 h-5 shrink-0 transition-colors"
                  style={{
                    color: isActive ? 'var(--color-primary-light)' : 'rgba(0,0,0,0.4)'
                  }}
                  aria-hidden="true"
                />
                <span
                  className="relative text-[9px] font-mono tracking-[0.15em] uppercase transition-colors"
                  style={{
                    color: isActive ? 'var(--color-primary-light)' : 'rgba(0,0,0,0.4)'
                  }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}
