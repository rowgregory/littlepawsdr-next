import {
  Dog,
  DollarSign,
  FileText,
  Gavel,
  Gift,
  Handshake,
  Heart,
  Home,
  LayoutDashboard,
  LucideIcon,
  Mail,
  Repeat,
  ShoppingBag,
  Users
} from 'lucide-react'

export interface Link {
  linkKey: string
  linkText: string
}

export interface Section {
  title: string
  icon: LucideIcon
  links?: Link[]
  linkKey?: string
}

export const HIDDEN_PATHS = ['/auth', '/admin', '/member', '/checkout', '/order-confirmation']

export const mainNavigationLinks: Section[] = [
  {
    title: 'Home',
    icon: Home,
    linkKey: '/'
  },
  {
    title: 'Dachshunds',
    icon: Dog,
    links: [
      {
        linkKey: '/dachshunds',
        linkText: 'Available Dachshunds'
      },
      {
        linkKey: '/dachshunds/hold',
        linkText: 'Incoming Dachshunds'
      },
      {
        linkKey: '/dachshunds/surrender',
        linkText: 'Surrender'
      }
    ]
  },
  {
    title: 'Donate',
    icon: DollarSign,
    links: [
      {
        linkKey: '/donate',
        linkText: 'One-Time'
      },
      {
        linkKey: '/donate/welcome-wieners',
        linkText: 'Welcome Wieners'
      },
      {
        linkKey: '/donate/shop-to-help',
        linkText: 'Shop To Help'
      },
      {
        linkKey: '/donate/feed-a-foster',
        linkText: 'Feed a Foster'
      }
    ]
  },
  {
    title: 'Adopt',
    icon: Heart,
    links: [
      {
        linkKey: '/adopt/application',
        linkText: 'Application'
      },
      {
        linkKey: '/adopt/senior',
        linkText: 'Adopt a Senior'
      },
      {
        linkKey: '/adopt/info',
        linkText: 'Information'
      },
      {
        linkKey: '/adopt/fees',
        linkText: 'Fees'
      },
      {
        linkKey: '/adopt/faq',
        linkText: 'FAQ'
      }
    ]
  },
  {
    title: 'Volunteer',
    icon: Handshake,
    links: [
      {
        linkKey: '/volunteer/application',
        linkText: 'Application'
      },
      {
        linkKey: '/volunteer/foster',
        linkText: 'Foster Application'
      },
      {
        linkKey: '/volunteer/transport',
        linkText: 'Transport Application'
      }
    ]
  },
  {
    title: 'Merch',
    linkKey: '/merch',
    icon: Gift
  },

  {
    title: 'Subscriptions',
    linkKey: '/subscriptions',
    icon: Repeat
  }
]

export const ADMIN_NAV_ITEMS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/orders', label: 'Orders', icon: FileText }
    ]
  },
  {
    label: 'Rescue',
    items: [{ href: '/admin/dachshunds', label: 'Dachshunds', icon: Dog }]
  },
  {
    label: 'Commerce',
    items: [
      { href: '/admin/wieners', label: 'Welcome Wieners', icon: Heart },
      { href: '/admin/auctions', label: 'Auctions', icon: Gavel },
      { href: '/admin/merch', label: 'Merch', icon: ShoppingBag }
    ]
  },
  {
    label: 'Content',
    items: [{ href: '/admin/newsletter', label: 'Newsletter', icon: Mail }]
  }
]
