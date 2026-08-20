'use client'

import { FC } from 'react'
import Image from 'next/image'

interface Props {
  className?: string
}

const features = [
  '100+ Swami Samarth Products',
  'Wholesale & Retail Puja Items',
  'Pan-India Devotional Shipping',
  'Perfect For Puja, Festivals',
]

const HeroSection: FC<Props> = ({ className = '' }) => {
  return (
    <section
      id="hero"
      aria-label="Hero | Shree Swami Samarth Devotional Store"
      className={`relative bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-amber-50/80 border-b border-amber-200/50 py-8 sm:py-12 lg:py-16 ${className}`}
    >
      {/* Decorative background ambient glows (Pure CSS, pointer-events-none) */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/20 via-orange-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-gradient-to-bl from-orange-300/20 via-amber-400/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Content (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-3 sm:gap-4 text-center lg:text-left">
            {/* Devotional Pill Badge */}
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
                <span className="text-amber-500 font-semibold text-xs">✦</span>
                स्वामी ओम एन्टरप्राइझेस , अक्कलकोट
                <span className="text-amber-500 font-semibold text-xs">✦</span>
              </span>
            </div>

            {/* Headline Hierarchy */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="text-[clamp(1.75rem,3.2vw,3rem)] font-extrabold leading-[1.12] text-gray-900 tracking-tight">
                Shree Swami Samarth{' '}
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                  Devotional Store
                </span>
              </h1>
              <h2 className="text-[clamp(1rem,1.8vw,1.35rem)] font-bold text-amber-950 leading-snug">
                Authentic Blessings from Akkalkot Shree Swami Samarth Maharaj, Delivered to Your Home
              </h2>
            </div>

            {/* Devotional Intro Paragraph */}
            <p className="text-gray-800 text-[clamp(0.85rem,1.1vw,1rem)] leading-[1.5] max-w-[85%] mx-auto lg:mx-0 font-normal">
              Curated Shree Swami Samarth devotional products for home, temple & daily worship printed kurtas, dhotis, shawls, photo frames, T-shirts, topis & more. Fast Pan-India shipping.
            </p>

            {/* 4 Trust Bullets (2x2 grid on sm+, compact padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-left">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 bg-white/90 hover:bg-white rounded-lg px-3 py-2 shadow-xs border border-amber-200/70 hover:border-amber-300 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white shadow-xs">
                    <span className="font-bold text-[12px]">✓</span>
                  </div>
                  <span className="text-[13px] sm:text-xs text-gray-900 font-semibold leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
              <a
                href="/shop"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl px-7 py-3 text-sm sm:text-base shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-600/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                Explore All Products →
              </a>

              <a
                href="/about"
                className="inline-flex items-center justify-center bg-white/95 hover:bg-white text-gray-900 font-semibold rounded-xl px-7 py-3 text-sm sm:text-base border border-amber-300/80 hover:border-amber-400 shadow-xs transition-all hover:shadow-sm whitespace-nowrap"
              >
                Visit Our Akkalkot Store
              </a>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase (5 cols on desktop) */}
          <div className="lg:col-span-5 flex justify-center items-center relative mt-2 lg:mt-0 w-full">
            {/* Background Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-orange-400/15 to-amber-200/10 rounded-full blur-2xl transform scale-90 pointer-events-none" />

            {/* Showcase Card Frame */}
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-200/80 shadow-lg shadow-amber-900/5 transition-all duration-300 hover:shadow-xl hover:border-amber-300 group mx-auto">
              {/* Product Badge Ribbon */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1 z-10 whitespace-nowrap">
                <span className="text-amber-200">✦</span> Akkalkot Devotional Wear <span className="text-amber-200">✦</span>
              </div>

              {/* Main Product Image Container */}
              <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-50/70 to-orange-50/40 p-2.5 sm:p-4 flex items-center justify-center overflow-hidden border border-amber-100/80">
                <Image
                  src="/Banner_Image/t-shirt.png"
                  alt="Yellow printed devotional kurta for Swami Samarth puja | Swami Om Enterprises Akkalkot"
                  width={450}
                  height={450}
                  priority={true}
                  fetchPriority="high"
                  className="object-contain max-h-[220px] sm:max-h-[260px] lg:max-h-[290px] w-auto drop-shadow-md transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tag below image (Unclipped) */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs text-amber-950 font-medium px-0.5 pb-0.5">
                <span className="flex items-center gap-1 font-semibold text-orange-900">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Premium Printed Apparel
                </span>
                <span className="bg-amber-100/80 text-amber-950 px-2 py-0.5 rounded-md border border-amber-200/60 font-semibold">
                  Wholesale & Retail
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection



