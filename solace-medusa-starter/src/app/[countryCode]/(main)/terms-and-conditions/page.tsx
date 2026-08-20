import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Swami Om Enterprises',
  description:
    'Read the official Terms and Conditions for Swami Om Enterprises. Guidelines for purchasing devotional products, pricing, delivery, and wholesale orders.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms & Conditions | Swami Om Enterprises',
    description:
      'Terms and Conditions for Swami Om Enterprises Akkalkot store. Ordering guidelines, wholesale terms, and delivery policies.',
    url: 'https://swamiomenterprises.in/terms-and-conditions',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1 bg-amber-100/80 rounded-full border border-amber-300/80 mb-3">
              ✦ Official Document
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: August 20, 2026 | Swami Om Enterprises, Akkalkot
            </p>
          </div>

          <div className="prose prose-amber max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed font-normal">
            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing or purchasing from <strong>Swami Om Enterprises</strong> (&quot;swamiomenterprises.in&quot;), you agree to be bound by these Terms and Conditions. Our store provides authentic Shree Swami Samarth devotional apparel, idol accessories, metal frames, readymade dhotis, and bulk devotional items.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                2. Product Descriptions & Pricing
              </h2>
              <p className="mt-3">
                We make every effort to display accurate product details, fabric materials, sizing ranges, and high-resolution images.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>All prices are listed in Indian Rupees (INR) and include applicable taxes (GST).</li>
                <li>Wholesale slab rates apply for bulk orders (temples, mandals, resellers) as specified in direct quotes or our wholesale hub.</li>
                <li>Product dimensions, prints, and color swatches are rendered as accurately as possible. Slight variations may occur due to hand-screen printing or screen displays.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                3. Order Placement & Payments
              </h2>
              <p className="mt-3">
                Orders are processed upon full payment authorization via Razorpay (UPI, Debit/Credit Card, Netbanking). Once an order is confirmed, you will receive an order confirmation via email/SMS. We reserve the right to cancel orders in case of stock unavailability or pricing errors, in which case full refunds are issued immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                4. Intellectual Property
              </h2>
              <p className="mt-3">
                All content, text, imagery, logos, and custom devotional designs on swamiomenterprises.in are protected intellectual property of Swami Om Enterprises. Unauthorized reproduction or commercial misuse without explicit consent is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                5. Governing Law & Jurisdiction
              </h2>
              <p className="mt-3">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms or transactions shall be subject to the exclusive jurisdiction of the courts in Solapur / Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                6. Contact & Support
              </h2>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 mt-3 text-sm space-y-1">
                <p className="font-bold text-gray-900">Swami Om Enterprises</p>
                <p>Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra - 413216</p>
                <p>Helpline: +91 73856 77447 | +91 91752 53282</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
