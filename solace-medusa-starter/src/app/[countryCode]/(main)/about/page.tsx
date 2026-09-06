import { Metadata } from 'next'

import { Container } from '@modules/common/components/container'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export const metadata: Metadata = {
  title: 'About Swami Om Enterprises | Akkalkot Devotional Store',
  description:
    'Learn about Swami Om Enterprises, your trusted online store for Shree Swami Samarth devotional products: kurtas, dhotis, shawls, T-shirts, topis, frames and more, delivered across India.',
  robots: {
    index: true,
    follow: true,
  },
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
        url: 'https://swamiomenterprises.in/og_image/og-image.png',
        width: 1200,
        height: 630,
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

const values = [
  {
    title: 'Authenticity',
    description: 'Every product reflects genuine devotional values and Akkalkot heritage.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Quality',
    description: 'Premium materials and craftsmanship ensure durability and comfort.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Affordability',
    description: 'Fair pricing for both retail devotees and wholesale bulk orders.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Nationwide Reach',
    description: 'Reliable delivery across India for orders big and small.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const stats = [
  { label: 'Years of Service', value: '10+' },
  { label: 'Products', value: '50+' },
  { label: 'Happy Devotees', value: '5000+' },
  { label: 'Pan India Delivery', value: '100%' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-white border-b border-amber-200/50 py-12 sm:py-20 lg:py-24">
        {/* Decorative background elements */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-300/20 via-orange-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Devotional Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 text-orange-950 text-xs sm:text-sm font-bold tracking-wide px-5 py-2 bg-white/95 rounded-full shadow-md border border-amber-300/80 backdrop-blur-md">
                <span className="text-amber-500 font-semibold">✦</span>
                स्वामी ओम एन्टरप्रायझेस, अक्कलकोट
                <span className="text-amber-500 font-semibold">✦</span>
              </span>
            </div>

            {/* Heading Hierarchy */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 tracking-tight">
              About{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                Swami Om Enterprises
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-950">
              Your Trusted Shree Swami Samarth Devotional Store in Akkalkot
            </p>

            {/* Intro Lead */}
            <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal pt-2 max-w-3xl mx-auto">
              Swami Om Enterprises is built around one clear purpose: making it easy for devotees of Shree Swami Samarth to access high quality, authentic devotional apparel, accessories and altar sacred items for personal worship, festivals and wholesale requirements.
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-200/60 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <Container maxWidth="lg" className="flex flex-col gap-12 sm:gap-16">
          {/* Devotional Mission Card */}
          <div className="bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-md rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-200/80 shadow-lg space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Our Mission & Akkalkot Heritage
              </h2>
            </div>
            
            <div className="space-y-5">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Located at <span className="font-semibold text-orange-700">Shri Swami Samarth Annachhatra Mandal Premises</span> in Akkalkot, Dist. Solapur, Maharashtra, India, we take immense pride in offering items inspired by the sacred grace of Akkalkot Maharaj. Our range spans printed kurtas, readymade dhotis, shawls, cotton T-shirts, idol topis, metal photo frames and car dashboard napkins.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                We cater to individual devotees as well as shops, mandals, mathas and religious trusts, providing transparent pricing for both wholesale bulk orders and retail purchases across Maharashtra and nationwide.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 sm:p-7 rounded-2xl border border-amber-300/60 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-amber-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-amber-950 text-sm sm:text-base font-semibold leading-relaxed">
                  Our commitment is simple: to serve every devotee with well crafted, durable and affordable products that honor faith, whether for daily home puja, festive occasions or thoughtful spiritual gifts.
                </p>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Our Core Values
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                The principles that guide everything we do at Swami Om Enterprises
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50/40 p-6 sm:p-7 rounded-2xl border border-amber-200/70 hover:border-amber-400/80 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-amber-600 group-hover:text-orange-600 mb-4 transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What We Offer Grid */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                What We Offer
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Curated devotional wear and spiritual accessories crafted with care for your worship needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {offerings.map((item, index) => (
                <div
                  key={item.title}
                  className="group bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50/40 p-6 sm:p-7 rounded-2xl border border-amber-200/70 hover:border-amber-400/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-200/50">
                    <span className="text-xs font-semibold text-amber-700 group-hover:text-orange-700 transition-colors">
                      Available Now →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale & Retail Banner Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#6B0014] via-orange-700 to-amber-700 rounded-3xl p-8 sm:p-10 lg:p-12 text-white shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl" />
            
            <div className="relative space-y-6">
              <div className="space-y-4">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                  Wholesale & Bulk Orders
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Serving Shops, Mandals and Event Organisers
                </h2>
                <p className="text-amber-50 text-base sm:text-lg leading-relaxed max-w-3xl">
                  We fulfill single piece orders as well as large bulk requirements for temples, mandals, festival events and retail stores across India. Get special wholesale pricing and dedicated support.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <LocalizedClientLink
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-900 hover:bg-amber-50 font-bold rounded-xl px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <span>Contact Us for Wholesale</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </LocalizedClientLink>
                
                <LocalizedClientLink
                  href="/store"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/30 hover:border-white/50 font-bold rounded-xl px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base transition-all duration-300"
                >
                  <span>Browse Products</span>
                </LocalizedClientLink>
              </div>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-3xl p-6 sm:p-10 border border-amber-200/60 shadow-md">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Visit Us</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    <span className="font-semibold">Shri Swami Samarth Annachhatra Mandal Premises</span><br />
                    Akkalkot, Dist. Solapur<br />
                    Maharashtra, India
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We're Here</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-semibold">Business Hours:</span><br />
                    Open 7 days a week<br />
                    Ready to serve devotees nationwide
                  </p>
                  <LocalizedClientLink
                    href="/contact"
                    className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-800 font-semibold text-sm group"
                  >
                    <span>Get in touch</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
