import { Metadata } from 'next'

import { Container } from '@modules/common/components/container'

export const metadata: Metadata = {
  title: 'About Swami Om Enterprises | Akkalkot Devotional Store',
  description:
    'Learn about Swami Om Enterprises, your trusted online store for Shree Swami Samarth devotional products — kurtas, dhotis, shawls, T-shirts, topis, frames and more, delivered across India.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/about',
  },
  openGraph: {
    title: 'About Swami Om Enterprises | Shree Swami Samarth Devotional Store',
    description:
      'Discover Swami Om Enterprises in Akkalkot, Solapur. Providing authentic Shree Swami Samarth devotional kurtas, dhotis, topis, frames & T-shirts nationwide.',
    url: 'https://swamiomenterprises.in/about',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Swami Om Enterprises - Akkalkot Devotional Store',
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <div className="container mx-auto px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="w-full space-y-6">
              {/* Badge */}
              <div className="text-center md:text-left">
                <span className="inline-block text-orange-700 text-xs font-bold tracking-widest uppercase px-4 py-2 bg-white rounded-full shadow-sm border border-orange-200">
                  ✦ स्वामी ओम एन्टरप्रायझेस — अक्कलकोट ✦
                </span>
              </div>

              {/* Heading Hierarchy */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                  About Swami Om Enterprises
                </h1>
                <p className="text-xl md:text-2xl font-bold text-orange-600">
                  Your Trusted Shree Swami Samarth Devotional Store
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="text-gray-700 text-lg leading-relaxed">
                Swami Om Enterprises is a devotional products store built around one simple idea — making it easy for devotees of Shree Swami Samarth to find quality items for worship, festivals and everyday wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <Container maxWidth="md" className="flex flex-col gap-10 !py-12">
        {/* Divider */}
        <div className="h-1 w-20 bg-orange-600 rounded-full" />

        <div className="flex flex-col gap-10">
          {/* Section 1: Connection & Story */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Devotional Mission & Connection to Akkalkot
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Our collection includes printed kurtas, readymade dhotis, shawls, printed T-shirts, deity topis, metal photo frames and car dashboard napkins, all inspired by the teachings and image of Akkalkot Maharaj. We work with both individual customers and businesses, offering wholesale pricing for shops, mandals, trusts and event organisers, along with retail pricing for personal purchases.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              We ship our products across India, with a strong focus on serving devotees throughout Maharashtra. Every order, whether it&apos;s a single T-shirt or a bulk order for a temple event, is handled with the same care and attention.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium text-orange-950 bg-orange-50/70 p-4 rounded-xl border border-orange-100">
              Our aim is simple: to help every devotee celebrate their faith with products that are comfortable, well-made and reasonably priced — whether that&apos;s for daily puja at home, a festival celebration, or a thoughtful gift for a fellow devotee.
            </p>
          </section>

          {/* Section 2: What We Offer */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Printed Kurtas</h3>
                <p className="text-gray-600 text-sm">Comfortable, breathable apparel suitable for daily wear, temple visits, and festival occasions.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Readymade Dhotis</h3>
                <p className="text-gray-600 text-sm">Traditional readymade dhotis ideal for puja, festivals, and sacred ceremonies.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Devotional Shawls</h3>
                <p className="text-gray-600 text-sm">Shree Swami Samarth printed shawls for daily worship, satsangs, and festive gatherings.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Printed Cotton T-Shirts</h3>
                <p className="text-gray-600 text-sm">Fade-resistant printed cotton T-shirts available in multiple colors and sizes (Kids S to 4XL).</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Deity Topis (Idol Caps)</h3>
                <p className="text-gray-600 text-sm">Orange velvet caps adorned with zari embroidery and pearl work for idol decoration.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Metal Photo Frames & Napkins</h3>
                <p className="text-gray-600 text-sm">Durable metal frames for altars and spiritual car dashboard napkins for daily travel.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Wholesale & Retail */}
          <section className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-8 rounded-3xl border border-orange-100 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Wholesale & Retail Services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We supply both single pieces for personal use and bulk quantities for shops, mandals, trusts, and religious events. Located near Shri Swami Samarth Annachhatra Mandal in Akkalkot, Solapur, we fulfill orders across Maharashtra and Pan-India.
            </p>
            <div className="pt-2">
              <a
                href="/contact"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Contact Us for Wholesale Queries →
              </a>
            </div>
          </section>
        </div>
      </Container>
    </>
  )
}

