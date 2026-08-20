import { Metadata } from 'next'

import { Container } from '@modules/common/components/container'

export const metadata: Metadata = {
  title: 'About Swami Om Enterprises | Akkalkot Devotional Store',
  description:
    'Learn about Swami Om Enterprises, your trusted online store for Shree Swami Samarth devotional products: kurtas, dhotis, shawls, T-shirts, topis, frames and more, delivered across India.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/about',
  },
  openGraph: {
    title: 'About Swami Om Enterprises | Shree Swami Samarth Devotional Store',
    description:
      'Discover Swami Om Enterprises in Akkalkot, Solapur. Providing authentic Shree Swami Samarth devotional kurtas, dhotis, topis, frames and T-shirts nationwide.',
    url: 'https://swamiomenterprises.in/about',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Swami Om Enterprises | Akkalkot Devotional Store',
      },
    ],
  },
}

const offerings = [
  {
    title: 'Printed Kurtas',
    description:
      'Comfortable, breathable cotton apparel suitable for daily wear, temple visits and festival occasions.',
    icon: '👕',
  },
  {
    title: 'Readymade Dhotis',
    description:
      'Traditional readymade dhotis ideal for puja rituals, festivals and sacred ceremonies.',
    icon: '🥻',
  },
  {
    title: 'Devotional Shawls',
    description:
      'Shree Swami Samarth printed shawls for daily worship, satsangs and festive gatherings.',
    icon: '🧣',
  },
  {
    title: 'Printed Cotton T-Shirts',
    description:
      'Fade resistant printed cotton T-shirts available in multiple colors and sizes (Kids S to 4XL).',
    icon: '👔',
  },
  {
    title: 'Deity Topis (Idol Caps)',
    description:
      'Orange velvet caps adorned with zari embroidery and pearl work for idol decoration.',
    icon: '👑',
  },
  {
    title: 'Metal Photo Frames & Napkins',
    description:
      'Durable metal frames for altars and spiritual car dashboard napkins for daily travel.',
    icon: '🖼️',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-amber-50/80 border-b border-amber-200/50 py-10 sm:py-16">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/20 via-orange-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/* Devotional Badge */}
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-4 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
              <span className="text-amber-500 font-semibold text-xs">✦</span>
              स्वामी ओम एन्टरप्रायझेस, अक्कलकोट
              <span className="text-amber-500 font-semibold text-xs">✦</span>
            </span>

            {/* Heading Hierarchy */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
              About{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                Swami Om Enterprises
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-bold text-amber-950">
              Your Trusted Shree Swami Samarth Devotional Store in Akkalkot
            </p>

            {/* Intro Lead */}
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal pt-2">
              Swami Om Enterprises is built around one clear purpose: making it easy for devotees of Shree Swami Samarth to access high quality, authentic devotional apparel, accessories and altar sacred items for personal worship, festivals and wholesale requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <Container maxWidth="md" className="flex flex-col gap-10">
          {/* Devotional Mission Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Our Mission and Akkalkot Heritage
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Located at Shri Swami Samarth Annachhatra Mandal Premises in Akkalkot, Dist. Solapur, Maharashtra, India, we take immense pride in offering items inspired by the sacred grace of Akkalkot Maharaj. Our range spans printed kurtas, readymade dhotis, shawls, cotton T-shirts, idol topis, metal photo frames and car dashboard napkins.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              We cater to individual devotees as well as shops, mandals, mathas and religious trusts, providing transparent pricing for both wholesale bulk orders and retail purchases across Maharashtra and nationwide.
            </p>
            <div className="bg-amber-50/80 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-amber-200/80">
              <p className="text-amber-950 text-xs sm:text-sm font-semibold leading-relaxed">
                Our commitment is simple: to serve every devotee with well crafted, durable and affordable products that honor faith, whether for daily home puja, festive occasions or thoughtful spiritual gifts.
              </p>
            </div>
          </div>

          {/* What We Offer Grid */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                What We Offer
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Curated devotional wear and spiritual accessories crafted with care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {offerings.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/90 hover:bg-white p-5 rounded-2xl border border-amber-200/70 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-gray-900 text-base mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale & Retail Banner Card */}
          <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
            <div className="space-y-2">
              <span className="inline-block bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Wholesale & Bulk Orders
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Serving Shops, Mandals and Event Organisers
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
                We fulfill single piece orders as well as large bulk requirements for temples, mandals, festival events and retail stores across India.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-orange-900 hover:bg-amber-50 font-bold rounded-xl px-6 py-3 text-xs sm:text-sm shadow-md transition-all"
              >
                <span>Contact Us for Wholesale Inquiries</span>
                <span className="ml-1.5">↗</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
