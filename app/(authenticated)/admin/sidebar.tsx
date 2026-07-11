'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Home,
  LayoutDashboard,
  Gavel,
  Receipt,
  Package,
  Dog,
  DollarSign,
  Users,
  Mail,
  User,
  LogOut,
  PawPrint
} from 'lucide-react'

type NavItem = {
  label: string
  icon: typeof Home
  href: string
}

type NavGroup = {
  heading: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' }]
  },
  {
    heading: 'Fundraising',
    items: [
      { label: 'Orders', icon: Receipt, href: '/admin/orders' },
      { label: 'Auctions', icon: Gavel, href: '/admin/auctions' },
      { label: 'Products', icon: Package, href: '/admin/products' },
      { label: 'Welcome Wieners', icon: Dog, href: '/admin/welcome-wieners' }
    ]
  },
  {
    heading: 'Adoptions',
    items: [
      { label: 'Dachshunds', icon: PawPrint, href: '/admin/dachshunds' },
      { label: 'Adoption Fees', icon: DollarSign, href: '/admin/adoption-fees' }
    ]
  },
  {
    heading: 'People',
    items: [
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Newsletter', icon: Mail, href: '/admin/newsletter' },
      { label: 'Profile', icon: User, href: '/member/portal' }
    ]
  }
]

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(`${href}/`)

  const rowClass = (active: boolean) =>
    `relative w-full flex items-center gap-3 px-4 py-2 transition-colors ${
      active
        ? 'text-text-light dark:text-text-dark bg-primary-light/10 dark:bg-primary-dark/10'
        : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark'
    }`

  return (
    <nav
      aria-label="Admin sections"
      className="flex w-52 shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-col py-4 h-screen sticky top-0"
    >
      {/* Brand */}
      <Link href="/" aria-label="Little Paws admin home" className="flex items-center gap-2.5 px-4 mb-6">
        <span className="w-9 h-9 flex items-center justify-center bg-primary-light dark:bg-primary-dark text-bg-light dark:text-bg-dark font-quicksand font-black text-sm tracking-tight">
          LP
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-light dark:text-text-dark">
          Little Paws
        </span>
      </Link>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 min-h-0">
        {navGroups.map((group) => (
          <div key={group.heading} className="flex flex-col">
            <p className="px-4 mb-1.5 font-mono text-[9px] tracking-[0.25em] uppercase text-muted-light/70 dark:text-muted-dark/70">
              {group.heading}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={rowClass(active)}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-light dark:bg-primary-dark"
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[11px] tracking-widest uppercase">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Logout — pinned to bottom */}
      <div className="pt-4 border-t border-border-light dark:border-border-dark shrink-0">
        <button
          type="button"
          onClick={() => signOut({ redirectTo: '/' })}
          className="w-full flex items-center gap-3 px-4 py-2 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] tracking-widest uppercase">Logout</span>
        </button>
      </div>
    </nav>
  )
}
