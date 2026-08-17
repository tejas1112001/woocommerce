import { Metadata } from 'next'

import StoreTemplate from '@modules/store/templates'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Shree Swami Samarth Devotional Store | Swami Om Enterprises',
    description:
      'Browse our complete collection of Shree Swami Samarth devotional items. High quality kurtas, dhotis, topis, frames & accessories with shipping across India.',
    alternates: {
      canonical: 'https://swamiomenterprises.in/shop',
    },
    openGraph: {
      title: 'Shree Swami Samarth Devotional Store | Swami Om Enterprises',
      description:
        'Explore all devotional products including printed T-shirts, topis, kurtas, dhotis, and metal photo frames from Akkalkot.',
      url: 'https://swamiomenterprises.in/shop',
      siteName: 'Swami Om Enterprises',
      type: 'website',
      images: [
        {
          url: 'https://swamiomenterprises.in/logo/logo.png',
          width: 800,
          height: 600,
          alt: 'Swami Om Enterprises - Shree Swami Samarth Devotional Store',
        },
      ],
    },
  }
}

export default StoreTemplate

