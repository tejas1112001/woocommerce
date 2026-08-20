import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | Pan-India Delivery | Swami Om Enterprises',
  description:
    'Read the Shipping Policy for Swami Om Enterprises Akkalkot store. Pan-India shipping, fast delivery across Maharashtra, packaging details and order tracking.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/shipping-policy',
  },
  openGraph: {
    title: 'Shipping Policy | Swami Om Enterprises',
    description:
      'Pan-India delivery details and shipping policy for Swami Om Enterprises devotional products from Akkalkot.',
    url: 'https://swamiomenterprises.in/shipping-policy',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function ShippingPolicyPage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1 bg-amber-100/80 rounded-full border border-amber-300/80 mb-3">
              ✦ Delivery Information
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Shipping & Delivery Policy
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Pan-India Express Shipping | Direct Dispatch from Akkalkot, Solapur
            </p>
          </div>

          <div className="prose prose-amber max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed font-normal">
            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                1. Order Dispatch & Processing Time
              </h2>
              <p className="mt-3">
                All retail and wholesale orders are packed with care at our Akkalkot storefront premises. Orders placed before 2:00 PM (Monday through Saturday) are typically dispatched on the same or next business day.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                2. Delivery Timelines
              </h2>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <td><strong>Maharashtra & Nearby Regions:</strong> 2 to 4 business days.</td>
                <td><strong>Rest of India (Pan-India):</strong> 4 to 7 business days depending on destination PIN code.</td>
                <td><strong>Wholesale / Bulk Orders:</strong> Special logistics or transport arrangements are coordinated directly with buyers for large mandal/temple orders.</td>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                3. Shipping Charges & Tracking
              </h2>
              <p className="mt-3">
                Shipping fees are calculated at checkout based on order weight and destination. Upon dispatch, a tracking link and AWB number are shared via SMS/Email so you can follow your devotional package in real-time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                4. Safe & Sacred Packaging
              </h2>
              <p className="mt-3">
                Devotional items—including printed kurtas, readymade dhotis, deity topis, metal photo frames, and shawls—are packed in protective, moisture-resistant packaging to ensure they reach your altar or home in pristine condition.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                5. Need Help with Delivery?
              </h2>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 mt-3 text-sm space-y-1">
                <p className="font-bold text-gray-900">Customer Logistics Support</p>
                <p>Call / WhatsApp: +91 73856 77447 | +91 91752 53282</p>
                <p>Location: Akkalkot, Solapur, Maharashtra - 413216</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
