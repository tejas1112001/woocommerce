'use client'

import { FC } from 'react'

interface Review {
  id: string
  name: string
  location: string
  rating: number
  date: string
  comment: string
  verified: boolean
  purchasedItem: string
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Ramesh Kulkarni',
    location: 'Pune, Maharashtra',
    rating: 5,
    date: 'August 2026',
    comment:
      'The printed Swami Samarth kurta and dhoti set exceeded my expectations. Quality of cloth is super fine and fitting is spot on. Delivered quickly to Pune with great care.',
    verified: true,
    purchasedItem: 'Devotional Kurta & Dhoti Set',
  },
  {
    id: '2',
    name: 'Priya Shinde',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: 'July 2026',
    comment:
      'Ordered the metal photo frame and shawl for our home temple. The finish is stunning and divine. Fast shipping, beautiful packaging, genuine Akkalkot product.',
    verified: true,
    purchasedItem: 'Swami Samarth Frame & Shawl',
  },
  {
    id: '3',
    name: 'Amit Deshmukh',
    location: 'Solapur, Maharashtra',
    rating: 5,
    date: 'August 2026',
    comment:
      'We place wholesale orders for our mandal every year from Swami Om Enterprises. Always transparent pricing, top fabric quality, dependable service in Akkalkot.',
    verified: true,
    purchasedItem: 'Wholesale Mandal Orders',
  },
]

export const CustomerReviews: FC = () => {
  return (
    <section
      id="customer-reviews"
      aria-label="Customer Reviews and Testimonials"
      className="relative py-10 sm:py-14 bg-white border-t border-amber-200/50"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with Ratings Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1.5 bg-amber-50 rounded-full border border-amber-300/80">
              <span className="text-amber-500 font-semibold text-xs">✦</span>
              भक्तांचे अनुभव
              <span className="text-amber-500 font-semibold text-xs">✦</span>
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              What Devotees Say About Us
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Real feedback from thousands of Shree Swami Samarth followers across India.
            </p>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-xs self-start md:self-auto">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-amber-950">4.9</div>
              <div className="flex text-amber-500 text-xs">
                {'★'.repeat(5)}
              </div>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div className="text-xs text-gray-700 leading-tight">
              <div className="font-bold text-gray-900">1,200+ Reviews</div>
              <div className="text-gray-600">Verified Buyers</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 border border-amber-200/70 hover:border-amber-300 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-sm"
            >
              <div>
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 text-sm">
                    {'★'.repeat(review.rating)}
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">
                    {review.date}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-800 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div>
                {/* Purchased Item Tag */}
                <div className="mb-4">
                  <span className="inline-block bg-white text-amber-950 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-200/80">
                    Item: {review.purchasedItem}
                  </span>
                </div>

                {/* Reviewer Details */}
                <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      {review.location}
                    </p>
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span>✓</span> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerReviews
