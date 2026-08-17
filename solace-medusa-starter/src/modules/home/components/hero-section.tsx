'use client'

import { FC } from 'react'

interface Props {
  className?: string
}

const features = [
  'Wide range of Shree Swami Samarth devotional items',
  'Wholesale & Retail pricing available',
  'Pan-India shipping (Fast delivery across Maharashtra)',
  'Suited for daily puja, festivals, mandals & gifting',
]

const SectionHero2: FC<Props> = ({ className = '' }) => {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 ${className}`}>
      <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Content */}
          <div className="w-full space-y-6 md:space-y-8">
            {/* Badge */}
            <div className="text-center md:text-left">
              <span className="inline-block text-orange-700 text-xs font-bold tracking-widest uppercase px-4 py-2 bg-white rounded-full shadow-sm border border-orange-200">
                ✦ स्वामी ओम एन्टरप्रायझेस — अक्कलकोट ✦
              </span>
            </div>

            {/* Heading Hierarchy */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
                Shree Swami Samarth Devotional Store
              </h1>
              <p className="text-xl md:text-2xl font-bold text-orange-600">
                Bring home the blessings of Akkalkot Maharaj
              </p>
            </div>

            {/* Devotional Intro Paragraph */}
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Swami Om Enterprises brings you a wide range of Shree Swami Samarth devotional products for your home, temple and daily worship. From printed kurtas and readymade dhotis to shawls, metal photo frames, printed T-shirts, deity topis and car dashboard napkins, every product is chosen with devotees of Akkalkot Maharaj in mind.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-100"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/shop"
                className="block text-center bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl px-8 py-4 text-base shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Explore All Products →
              </a>
              
              <a
                href="/about"
                className="block text-center bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl px-8 py-4 text-base border-2 border-gray-200 transition-colors"
              >
                About Our Akkalkot Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionHero2
