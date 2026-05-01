import {
  Dog,
  DollarSign,
  FileText,
  Gavel,
  Gift,
  Handshake,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  LucideIcon,
  Mail,
  Newspaper,
  Repeat,
  Shield,
  ShoppingBag,
  Terminal,
  User,
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
  priority: number
}

export const HIDDEN_PATHS = [
  '/auth',
  '/admin',
  '/member',
  '/checkout',
  '/order-confirmation',
  '/auctions/',
  '/subscriptions',
  '/super',
  '/privacy-policy',
  '/terms'
]

export const mainNavigationLinks: Section[] = [
  {
    title: 'Home',
    icon: Home,
    linkKey: '/',
    priority: 1
  },
  {
    title: 'About',
    icon: Info,
    linkKey: '/about',
    priority: 1
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
    ],
    priority: 1
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
    ],
    priority: 1
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
    ],
    priority: 1
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
    ],
    priority: 1
  },
  {
    title: 'Merch',
    linkKey: '/merch',
    icon: Gift,
    priority: 1
  },

  {
    title: 'Subscriptions',
    linkKey: '/subscriptions',
    icon: Repeat,
    priority: 2
  },
  {
    title: 'Auctions',
    linkKey: '/auctions',
    icon: Gavel,
    priority: 3
  },
  {
    title: 'Newsletters',
    linkKey: '/newsletters',
    icon: Newspaper,
    priority: 4
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
      { href: '/admin/auctions', label: 'Auctions', icon: Gavel },
      { href: '/admin/welcome-wieners', label: 'Welcome Wieners', icon: Heart },
      { href: '/admin/merch', label: 'Merch', icon: ShoppingBag },
      { href: '/admin/auction-live', label: 'Live Auction', icon: Shield }
    ]
  },
  {
    label: 'Content',
    items: [{ href: '/admin/newsletter', label: 'Newsletter', icon: Mail }]
  },
  {
    label: 'Portal',
    items: [{ href: '/member/portal', label: 'Member Portal', icon: User }]
  },
  {
    label: 'System',
    items: [{ href: '/admin/logs', label: 'Logs', icon: Terminal }]
  }
]
