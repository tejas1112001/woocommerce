import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Thank You | Swami Om Enterprises',
  description:
    'Thank you for visiting Swami Om Enterprises, your trusted Shree Swami Samarth devotional store in Akkalkot.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/thank-you',
  },
  openGraph: {
    title: 'Thank You | Swami Om Enterprises',
    description:
      'Thank you from Swami Om Enterprises, Akkalkot.',
    url: 'https://swamiomenterprises.in/thank-you',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function ThankYouPage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-md space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 border border-orange-300 text-orange-600 text-2xl font-bold">
            ✦
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            ॥ श्री स्वामी समर्थ ॥
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-900">
            Thank You for Visiting Swami Om Enterprises
          </h2>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            We are honored to serve Swami Samarth devotees across Maharashtra and India. If you have any inquiries regarding your purchase, bulk orders, or upcoming devotional products, our Akkalkot team is always happy to assist.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-sm"
            >
              Browse All Devotional Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-6 py-3 rounded-full text-sm border border-amber-300 transition-all"
            >
              Contact Support
            </Link>
          </div>

          <div className="pt-6 border-t border-amber-100 text-xs text-gray-500">
            Swami Om Enterprises • Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Solapur
          </div>
        </div>
      </div>
    </div>
  )
}
