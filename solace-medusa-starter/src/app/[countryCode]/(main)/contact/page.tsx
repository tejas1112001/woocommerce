import { Metadata } from 'next'

import { ContactForm } from './contact-form'
import { JsonLd } from '@modules/common/components/json-ld'

export const metadata: Metadata = {
  title: 'Contact Swami Om Enterprises | Akkalkot, Maharashtra',
  description:
    'Contact Swami Om Enterprises in Akkalkot, Solapur. Call +91 73856 77447 for retail and wholesale Shree Swami Samarth devotional product queries.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/contact',
  },
  openGraph: {
    title: 'Contact Swami Om Enterprises | Akkalkot, Solapur',
    description:
      'Reach out to Swami Om Enterprises for orders, wholesale pricing or product queries. Located at Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra, India.',
    url: 'https://swamiomenterprises.in/contact',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/og_image/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Swami Om Enterprises Akkalkot',
      },
    ],
  },
}

export default function ContactPage() {
  const mapEmbedUrl = `https://maps.google.com/maps?q=Shri%20Swami%20Samarth%20Annachhatra%20Mandal%20Premises%2C%20Akkalkot%2C%20Dist.%20Solapur%2C%20Maharashtra%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed`
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=Shri+Swami+Samarth+Annachhatra+Mandal+Premises+Akkalkot+Dist+Solapur+Maharashtra+India`

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

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-amber-50/80 border-b border-amber-200/50 py-10 sm:py-16">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/20 via-orange-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-4 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
            <span className="text-amber-500 font-semibold text-xs">📍</span>
            संपर्क करा | अक्कलकोट दुकान
            <span className="text-amber-500 font-semibold text-xs">✦</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
            Contact{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              Swami Om Enterprises
            </span>
          </h1>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Have a question about our devotional products, want to place a bulk wholesale order or need help with sizing? Reach out to us, we are here to help.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-10">
          {/* 3 Contact Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone & WhatsApp Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                  📞
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Phone and WhatsApp
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Available daily for inquiries and orders
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 text-sm font-semibold text-gray-800">
                  <p>
                    <a
                      href="tel:+917385677447"
                      className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
                    >
                      <span>+91 73856 77447</span>
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+919325883564"
                      className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
                    >
                      <span>+91 93258 83564</span>
                    </a>
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-amber-100 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Call or Message Anytime</span>
              </div>
            </div>

            {/* Store Hours & Service Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                  ⏰
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Store Hours
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Open all days of the week
                  </p>
                </div>
                <div className="space-y-1 pt-2 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">Monday to Sunday:</p>
                  <p className="text-xs text-amber-950 font-medium">8:00 AM to 9:00 PM IST</p>
                </div>
              </div>
              <div className="pt-3 border-t border-amber-100 text-xs text-gray-600 font-medium">
                In-person retail and wholesale pickups available.
              </div>
            </div>

            {/* Shipping & Delivery Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-amber-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                  🚚
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Pan-India Shipping
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fast delivery across Maharashtra and India
                  </p>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed pt-2">
                  We supply retail single orders and bulk mandal orders with protective packaging for safe transit.
                </p>
              </div>
              <div className="pt-3 border-t border-amber-100 text-xs text-amber-900 font-semibold">
                Pan-India Delivery Options
              </div>
            </div>
          </div>

          {/* 2 Column: Store Address Card & Map Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Detailed Address */}
            <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <span>📍</span> Store Address
                  </h2>
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Akkalkot
                  </span>
                </div>

                {/* English Address */}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                    English Address
                  </p>
                  <p className="text-sm font-bold text-gray-900">Swami Om Enterprises</p>
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra, India
                  </p>
                </div>

                {/* Marathi Address */}
                <div className="space-y-1 pt-3 border-t border-amber-100">
                  <p className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                    मराठी पत्ता
                  </p>
                  <p className="text-sm font-bold text-gray-900">स्वामी ओम एन्टरप्रायझेस</p>
                  <p className="text-sm font-medium text-gray-800 leading-snug">
                    श्री स्वामी समर्थ अन्नछत्र मंडळ प्रांगण, अक्कलकोट, जि. सोलापूर, महाराष्ट्र
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl px-5 py-3 text-xs sm:text-sm shadow-sm transition-all"
                >
                  <span>Get Google Maps Directions</span>
                  <span className="ml-1.5">↗</span>
                </a>
              </div>
            </div>

            {/* Right Column: Embedded Google Map */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-200/80 shadow-md min-h-[360px] flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 mb-2 text-xs font-semibold text-amber-950 border-b border-amber-100">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  Store Location Map: Akkalkot
                </span>
                <span className="text-[11px] text-gray-500">Live View</span>
              </div>
              <div className="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-amber-200/60 shadow-inner bg-amber-50 min-h-[300px]">
                <iframe
                  title="Swami Om Enterprises Akkalkot Store Map Location"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Contact Form Container Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-md space-y-6 max-w-3xl mx-auto">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Send Us a Message
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Fill out the form below and we will respond to your query promptly.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
