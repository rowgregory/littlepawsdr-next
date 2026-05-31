'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ShoppingBag, Heart, Gavel, Shirt, Mail, PawPrint } from 'lucide-react'

const NAV = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag }
    ]
  },
  {
    group: 'Rescue',
    items: [{ label: 'Dachshunds', href: '/admin/dachshunds', icon: PawPrint }]
  },
  {
    group: 'Commerce',
    items: [
      { label: 'Auctions', href: '/admin/auctions', icon: Gavel },
      { label: 'Welcome Wieners', href: '/admin/welcome-wieners', icon: Heart },
      { label: 'Products', href: '/admin/products', icon: Shirt }
    ]
  },
  {
    group: 'Content',
    items: [{ label: 'Newsletter', href: '/admin/newsletter', icon: Mail }]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark h-full overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border-light dark:border-border-dark">
        <div className="w-8 h-8 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 shrink-0">
          <PawPrint size={14} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-none truncate">Little Paws</p>
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mt-0.5">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-4" aria-label="Admin navigation">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-muted-light dark:text-muted-dark px-4 mb-1">{section.group}</p>
            {section.items.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3 px-4 py-2 font-mono text-[10px] tracking-[0.15em] uppercase
                    transition-colors duration-100 focus:outline-none focus-visible:ring-1
                    focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                    ${
                      active
                        ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                        : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-border-light/50 dark:hover:bg-border-dark/30'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={13} aria-hidden="true" className="shrink-0" />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
