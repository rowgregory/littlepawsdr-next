import {
  faDashboard,
  faGear,
  faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';

export interface DropDownLinkProps {
  icon: any;
  href: string;
  text: string;
  className?: string;
  requiresAdmin?: boolean;
}

const dropDownLinkData: DropDownLinkProps[] = [
  {
    icon: faShoppingBag,
    href: '/my-orders',
    text: 'My Orders',
    className: 'rounded-tl-[30px] rounded-tr-[30px]',
  },
  {
    icon: faGear,
    href: '/settings/profile',
    text: 'Settings',
  },
  {
    icon: faDashboard,
    href: '/admin',
    text: 'Dashboard',
    requiresAdmin: true,
  },
];

export default dropDownLinkData;
