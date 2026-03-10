'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Section } from 'app/lib/constants/navigation'

export const NavDropdown = ({ section }: { section: Section }) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const isActive = section?.linkKey === pathname || section?.links?.some((l) => l.linkKey === pathname) || false

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {/* Direct link — no dropdown */}
      {section.linkKey && !section.links ? (
        <Link
          href={section.linkKey}
          aria-current={section.linkKey === pathname ? 'page' : undefined}
          className="group flex items-center gap-1 text-[13px] font-black whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark uppercase font-nunito text-on-dark hover:text-primary-light dark:hover:text-primary-dark transition-all duration-300"
        >
          <span className={`relative py-7 ${isActive ? 'text-primary-light dark:text-primary-dark' : ''}`}>
            {section.title}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-0 h-0.75 bg-primary-light dark:bg-primary-dark transition-all duration-300 ease-out ${
                section.linkKey === pathname ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </span>
        </Link>
      ) : (
        /* Dropdown trigger */
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          className="group flex items-center gap-1 text-[13px] font-black whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark uppercase font-nunito text-on-dark hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-all duration-300"
        >
          <span className={`relative py-7 ${isActive || open ? 'text-primary-light dark:text-primary-dark' : ''}`}>
            {section.title}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-0 h-0.5 bg-primary-light dark:bg-primary-dark transition-all duration-300 ease-out ${
                isActive || open ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-flex text-on-dark" aria-hidden="true">
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </button>
      )}

      {open && <div className="absolute top-full left-0 w-full h-2" aria-hidden="true" />}

      <AnimatePresence>
        {open && section.links && (
          <motion.ul
            role="menu"
            aria-label={`${section.title} navigation`}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 min-w-48 bg-topbar-light dark:bg-topbar-dark overflow-hidden z-50 list-none p-1 px-8.75 py-7.5 space-y-4"
          >
            {section.links.map((link) => (
              <li key={link.linkKey} role="none">
                <Link
                  href={link.linkKey}
                  role="menuitem"
                  aria-current={link.linkKey === pathname ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center font-nunito text-sm transition-colors focus:outline-none group focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                    link.linkKey === pathname
                      ? 'text-primary-light dark:text-primary-dark font-semibold'
                      : 'text-on-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`}
                >
                  <span className="relative whitespace-nowrap">
                    {link.linkText}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-0.5 bg-primary-light dark:bg-primary-dark transition-all duration-300 ease-out ${
                        link.linkKey === pathname ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
