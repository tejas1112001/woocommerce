'use client'

import { FC } from 'react'

export const AkkalkotStore: FC = () => {
  // Encoded location search for Google Maps embed centered on Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra, India
  const mapEmbedUrl = `https://maps.google.com/maps?q=Shri%20Swami%20Samarth%20Annachhatra%20Mandal%20Premises%2C%20Akkalkot%2C%20Dist.%20Solapur%2C%20Maharashtra%2C%20India&t=&z=16&ie=UTF8&iwloc=&output=embed`
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=Shri+Swami+Samarth+Annachhatra+Mandal+Premises+Akkalkot+Dist+Solapur+Maharashtra+India`

  return (
    <section
      id="akkalkot-store"
      aria-label="Akkalkot Store Information and Interactive Map"
      className="relative py-10 sm:py-14 bg-gradient-to-b from-white via-amber-50/40 to-amber-50/80 border-t border-amber-200/50"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
            <span className="text-amber-500 font-semibold text-xs">📍</span>
            अक्कलकोट दुकान माहिती
            <span className="text-amber-500 font-semibold text-xs">✦</span>
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Visit Our Store in{' '}
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              Akkalkot
            </span>
          </h2>

          <p className="text-gray-700 text-sm sm:text-base">
            Located in the sacred city of Akkalkot, Solapur, Maharashtra. Stop by for in-person shopping or wholesale orders.
          </p>
        </div>

        {/* 2-Column Store Info & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Store Info Card (5 cols on desktop) */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              {/* Badge Header */}
              <div className="flex flex-row items-start justify-between gap-3 border-b border-amber-100 pb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                    Swami Om Enterprises
                  </h3>
                  <p className="text-xs text-amber-900 font-semibold mt-0.5">
                    Shree Swami Samarth Products Store
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 whitespace-nowrap flex-shrink-0 self-start mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  Open Daily
                </span>
              </div>

              {/* Information Rows */}
              <div className="space-y-4 text-sm text-gray-800">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-xs">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-amber-950">
                      Store Address
                    </h4>
                    <p className="text-sm font-medium leading-snug mt-0.5">
                      Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-xs">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-amber-950">
                      Store Hours
                    </h4>
                    <p className="text-sm font-medium leading-snug mt-0.5">
                      Monday to Sunday: 8:00 AM to 9:00 PM
                    </p>
                  </div>
                </div>

                {/* Offerings */}
                <div className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-xs">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider text-amber-950">
                      Store Services
                    </h4>
                    <p className="text-sm font-medium leading-snug mt-0.5">
                      Retail Sales, Wholesale Bulk Orders, Custom Frames and Festival Apparel
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-amber-100 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl px-5 py-2.5 text-xs sm:text-sm shadow-sm transition-all"
              >
                <span>Get Directions</span>
                <span className="ml-1">↗</span>
              </a>

              <a
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-50 hover:bg-amber-100/80 text-gray-900 font-semibold rounded-xl px-5 py-2.5 text-xs sm:text-sm border border-amber-300/80 transition-all"
              >
                Contact Store
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Frame (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-200/80 shadow-md min-h-[380px] sm:min-h-[440px] flex flex-col">
            {/* Map Header Bar */}
            <div className="flex items-center justify-between px-3 py-2 mb-2 text-xs font-semibold text-amber-950 border-b border-amber-100">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Interactive Map: Akkalkot, Solapur, Maharashtra, India
              </span>
              <span className="text-[11px] text-gray-500">Live Map View</span>
            </div>

            {/* Map Container */}
            <div className="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-amber-200/60 shadow-inner bg-amber-50">
              <iframe
                title="Swami Om Enterprises Akkalkot Store Map Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AkkalkotStore
