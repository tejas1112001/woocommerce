import {
  BoxIcon,
  DashboardIcon,
  HeartIcon,
  HeadphonesIcon,
  LogoutIcon,
  RefreshIcon,
  SettingsIcon,
  ShippingIcon,
} from '@modules/common/icons'

export const profileNavItemsGroups = [
  [
    {
      href: '/account',
      icon: <DashboardIcon className="h-5 w-5" />,
      label: 'Dashboard',
      type: 'link',
    },
    {
      href: '/account/orders',
      icon: <BoxIcon className="h-5 w-5" />,
      label: 'Order history',
      type: 'link',
    },
    {
      href: '/account/returns',
      icon: <RefreshIcon className="h-5 w-5" />,
      label: 'Returns',
      type: 'link',
    },
  ],
  [
    {
      href: '/account/addresses',
      icon: <ShippingIcon className="h-5 w-5" />,
      label: 'Shipping details',
      type: 'link',
    },
    {
      href: '/account/profile',
      icon: <SettingsIcon className="h-5 w-5" />,
      label: 'Account settings',
      type: 'link',
    },
    {
      href: '/account/wishlist',
      icon: <HeartIcon className="h-5 w-5" />,
      label: 'Wishlist',
      type: 'link',
    },
    {
      href: '#',
      icon: <HeadphonesIcon className="h-5 w-5" />,
      label: 'Support center',
      type: 'link',
    },
  ],
  [
    {
      href: '',
      type: 'logout',
      icon: <LogoutIcon className="h-5 w-5" />,
      label: 'Log out',
    },
  ],
]

