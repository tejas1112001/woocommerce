'use client'

import { FC } from 'react'

interface Feature {
  id: string
  title: string
  description: string
  icon: JSX.Element
  highlight: string
}

const features: Feature[] = [
  {
    id: 'authentic',
    title: '100% Authentic Devotional Items',
    highlight: 'Direct from Akkalkot',
    description:
      'Sourced directly from the holy town of Akkalkot. Every item carries sacred blessings for your daily puja, home altar and special rituals.',
    icon: (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    id: 'craftsmanship',
    title: 'Premium Fabrics & Craftsmanship',
    highlight: 'Handcrafted Quality',
    description:
      'From soft cotton printed kurtas and dhotis to beautifully framed Swami Samarth artwork, we prioritize durability and spiritual aesthetics.',
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    id: 'shipping',
    title: 'Fast & Secure Pan-India Shipping',
    highlight: 'Safe Delivery',
    description:
      'Carefully packed in protective packaging so your devotional apparel, shawls, frames arrive in pristine condition anywhere across India.',
    icon: (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: 'wholesale',
    title: 'Wholesale & Retail Service',
    highlight: 'Best Market Rates',
    description:
      'Whether buying a single gift for family or placing bulk orders for mandals and mathas, we offer reliable service at competitive rates.',
    icon: (
      <svg
        className="w-6 h-6 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2m-6 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2"
        />
      </svg>
    ),
  },
]

export const WhyChooseUs: FC = () => {
  return (
    <section
      id="why-choose-us"
      aria-label="Why Choose Swami Om Enterprises"
      className="relative py-10 sm:py-14 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-white"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-64 bg-amber-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
            <span className="text-amber-500 font-semibold text-xs">✦</span>
            अक्कलकोट स्वामी कार्य
            <span className="text-amber-500 font-semibold text-xs">✦</span>
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              Swami Om Enterprises
            </span>
          </h2>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Your trusted destination in Akkalkot for authentic Shree Swami Samarth devotional wear, puja accessories, wholesale orders.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative bg-white/90 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-amber-200/70 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100/80 border border-amber-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    {feature.highlight}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-orange-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="mt-5 pt-3 border-t border-amber-100/80 flex items-center text-[12px] font-medium text-orange-600 group-hover:text-orange-700">
                <span>Learn more</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
