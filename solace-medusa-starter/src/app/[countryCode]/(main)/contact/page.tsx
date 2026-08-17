import { Metadata } from 'next'

import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import { JsonLd } from '@modules/common/components/json-ld'
import { Text } from '@modules/common/components/text'

import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact Swami Om Enterprises | Akkalkot, Maharashtra',
  description:
    'Contact Swami Om Enterprises in Akkalkot, Solapur. Call +91 73856 77447 for retail & wholesale Shree Swami Samarth devotional product queries.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/contact',
  },
  openGraph: {
    title: 'Contact Swami Om Enterprises | Akkalkot, Solapur',
    description:
      'Reach out to Swami Om Enterprises for orders, wholesale pricing, or product queries. Located at Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot.',
    url: 'https://swamiomenterprises.in/contact',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Contact Swami Om Enterprises Akkalkot',
      },
    ],
  },
}

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Swami Om Enterprises',
    url: 'https://swamiomenterprises.in/contact',
    mainEntity: {
      '@type': 'Store',
      name: 'Swami Om Enterprises',
      telephone: ['+91-7385677447', '+91-9325883564'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shri Swami Samarth Annachhatra Mandal Premises',
        addressLocality: 'Akkalkot',
        addressRegion: 'Maharashtra',
        postalCode: '413216',
        addressCountry: 'IN',
      },
    },
  }

  return (
    <>
      <JsonLd id="jsonld-contact" data={contactSchema} />
      <Container maxWidth="md" className="flex flex-col gap-10 !py-12">
        {/* Header */}
        <Box className="flex flex-col gap-3">
          <Text size="sm" className="font-medium uppercase tracking-widest text-orange-600">
            Get in Touch
          </Text>
          <Heading
            as="h1"
            className="text-4xl font-extrabold leading-tight text-gray-900 small:text-5xl"
          >
            Contact Swami Om Enterprises
          </Heading>
          <Text size="lg" className="text-gray-600">
            Have a question about a product, want to place a bulk wholesale order, or need help choosing the right item? Reach out to us — we&apos;re happy to help.
          </Text>
        </Box>

        {/* Store Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Numbers */}
          <div className="bg-orange-50/60 border border-orange-100 p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              📞 Phone / WhatsApp
            </h2>
            <div className="space-y-1 text-gray-800 font-medium">
              <p>
                <a href="tel:+917385677447" className="hover:text-orange-600 transition-colors">
                  +91 73856 77447
                </a>
              </p>
              <p>
                <a href="tel:+919325883564" className="hover:text-orange-600 transition-colors">
                  +91 93258 83564
                </a>
              </p>
            </div>
            <p className="text-xs text-gray-500">Available for calls and WhatsApp inquiries daily.</p>
          </div>

          {/* Shipping & Hours */}
          <div className="bg-orange-50/60 border border-orange-100 p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🚚 Shipping & Orders
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We deliver across India, with dedicated fast service across Maharashtra for retail and bulk orders.
            </p>
          </div>
        </div>

        {/* Store Address Block */}
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📍 Store Address (Akkalkot)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="font-bold text-gray-900 mb-1">English Address:</p>
              <p>Swami Om Enterprises</p>
              <p>Shri Swami Samarth Annachhatra Mandal Premises,</p>
              <p>Akkalkot, Dist. Solapur,</p>
              <p>Maharashtra, India</p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <p className="font-bold text-gray-900 mb-1">मराठी पत्ता:</p>
              <p>श्री स्वामी समर्थ अन्नछत्र मंडळ प्रांगण,</p>
              <p>अक्कलकोट, जि. सोलापूर,</p>
              <p>महाराष्ट्र</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gray-200" />

        {/* Contact Form Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Send Us a Message
          </h2>
          <ContactForm />
        </div>
      </Container>
    </>
  )
}

