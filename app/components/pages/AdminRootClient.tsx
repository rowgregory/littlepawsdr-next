'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'
import { Dog, Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from 'app/lib/constants/navigation'

// ─── Nav items ────────────────────────────────────────────────────────────────

// ─── Nav Link ─────────────────────────────────────────────────────────────────
function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick
}: {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wide transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
        ${
          active
            ? 'text-primary-light dark:text-primary-dark bg-primary-light/8 dark:bg-primary-dark/10'
            : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-light dark:bg-primary-dark"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          aria-hidden="true"
        />
      )}
      <Icon size={14} aria-hidden="true" className="shrink-0" />
      <span>{label}</span>
      {active && <ChevronRight size={10} className="ml-auto opacity-50" aria-hidden="true" />}
    </Link>
  )
}

// ─── Sidebar content ──────────────────────────────────────────────────────────
function SidebarContent({ pathname, onNavClick }: { pathname: string; onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border-light dark:border-border-dark shrink-0">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <div className="w-7 h-7 bg-primary-light dark:bg-primary-dark flex items-center justify-center shrink-0">
            <Dog size={14} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-none">Little Paws</p>
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-0.5">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto py-4 px-2">
        {ADMIN_NAV_ITEMS.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-3 mb-1.5 text-[9px] font-mono tracking-[0.25em] uppercase text-muted-light/60 dark:text-muted-dark/60">{group.label}</p>
            <ul role="list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} onClick={onNavClick} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border-light dark:border-border-dark p-3">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 text-xs font-mono text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <ChevronRight size={14} className="rotate-180 shrink-0" aria-hidden="true" />
          <span>View Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-mono text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <LogOut size={14} className="shrink-0" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminRootClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Derive page title from nav items
  const activeItem = ADMIN_NAV_ITEMS.flatMap((g) => g.items).find((i) => i.href === pathname)

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark flex">
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden 1000:flex flex-col w-56 shrink-0 border-r border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark fixed top-0 left-0 bottom-0 z-30"
        aria-label="Admin sidebar"
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm 1000:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-bg-light dark:bg-bg-dark border-r border-border-light dark:border-border-dark 1000:hidden"
              aria-label="Admin navigation"
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute top-4 right-4 p-1.5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={16} aria-hidden="true" />
              </button>
              <SidebarContent pathname={pathname} onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 1000:ml-56">
        {/* Mobile topbar */}
        <header className="1000:hidden flex items-center gap-3 px-4 py-3.5 border-b border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="p-1.5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <Menu size={18} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-primary-light dark:bg-primary-dark flex items-center justify-center shrink-0">
              <Dog size={11} className="text-white" aria-hidden="true" />
            </div>
            <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">{activeItem?.label ?? 'Admin'}</p>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
