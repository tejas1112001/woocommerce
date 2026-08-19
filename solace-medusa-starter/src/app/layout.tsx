import { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { getBaseURL } from '@lib/util/env'
import { JsonLd } from '@modules/common/components/json-ld'
import { ProgressBar } from '@modules/common/components/progress-bar'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from 'sonner'

import 'styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: 'Shree Swami Samarth Products | Swami Om Enterprises',
    template: '%s | Swami Om Enterprises',
  },
  description:
    'Shop authentic Shree Swami Samarth devotional products from Akkalkot. Kurtas, dhotis, shawls, T-shirts, topis & frames. Wholesale & retail Pan-India.',
  icons: {
    icon: [
      { url: '/favicon/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.png',
    apple: '/favicon/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://swamiomenterprises.in',
    siteName: 'Swami Om Enterprises',
    title: 'Shree Swami Samarth Products | Swami Om Enterprises',
    description:
      'Shop authentic Shree Swami Samarth devotional products from Akkalkot. Kurtas, dhotis, shawls, T-shirts, topis & frames. Wholesale & retail Pan-India.',
    images: [
      {
        url: 'https://swamiomenterprises.in/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Swami Om Enterprises - Shree Swami Samarth Devotional Store Akkalkot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shree Swami Samarth Products | Swami Om Enterprises',
    description:
      'Shop authentic Shree Swami Samarth devotional products from Akkalkot. Kurtas, dhotis, shawls, T-shirts, topis & frames.',
    images: ['https://swamiomenterprises.in/logo/logo.png'],
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Swami Om Enterprises',
    url: 'https://swamiomenterprises.in',
    logo: 'https://swamiomenterprises.in/logo/logo.png',
    description:
      'Store for Shree Swami Samarth devotional products from Akkalkot, Solapur, Maharashtra.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shri Swami Samarth Annachhatra Mandal Premises',
      addressLocality: 'Akkalkot',
      addressRegion: 'Maharashtra',
      postalCode: '413216',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-7385677447',
        contactType: 'customer service',
        availableLanguage: ['en', 'mr', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-9325883564',
        contactType: 'sales / wholesale',
        availableLanguage: ['en', 'mr', 'hi'],
      },
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Swami Om Enterprises',
    url: 'https://swamiomenterprises.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://swamiomenterprises.in/results?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={`${poppins.className} font-sans text-basic-primary`}>
        <JsonLd id="jsonld-organization-website" data={[organizationSchema, websiteSchema]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <ProgressBar />
          <Toaster position="bottom-right" offset={65} closeButton />
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

