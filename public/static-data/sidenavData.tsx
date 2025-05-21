import { faAddressCard, faDog, faDollar, faGift, faHandshake, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'

export interface Link {
  linkKey: string
  linkText: string
}

export interface SideLinkSection {
  title: string
  icon: ReactNode
  links: Link[]
}

export const sideLinkData: SideLinkSection[] = [
  {
    title: 'Dachshunds',
    icon: <FontAwesomeIcon icon={faDog} className="mr-2" />,
    links: [
      {
        linkKey: '/available',
        linkText: 'Available'
      },
      {
        linkKey: '/about/hold',
        linkText: 'Not Available For Adoption Yet'
      },
      {
        linkKey: '/surrender',
        linkText: 'Surrender'
      }
    ]
  },
  {
    title: 'Donate',
    icon: <FontAwesomeIcon icon={faDollar} className="mr-2" />,
    links: [
      {
        linkKey: '/donate',
        linkText: 'One-Time/Monthly'
      },
      {
        linkKey: '/welcome-wieners',
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
    icon: <FontAwesomeIcon icon={faHeart} className="mr-2" />,
    links: [
      {
        linkKey: '/adopt',
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
    icon: <FontAwesomeIcon icon={faHandshake} className="mr-2" />,
    links: [
      {
        linkKey: '/volunteer/volunteer-application',
        linkText: 'Application'
      },
      {
        linkKey: '/volunteer/foster-application',
        linkText: 'Foster Application'
      },
      {
        linkKey: '/adopt/transport-application',
        linkText: 'Transport Application'
      }
    ]
  }
]

export const singleLinkData = [
  {
    linkKey: '/merch',
    linkText: 'Merch',
    icon: <FontAwesomeIcon icon={faGift} className="mr-2" />
  },

  {
    linkKey: '/ecards',
    linkText: 'Ecards',
    icon: <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
  }
]
