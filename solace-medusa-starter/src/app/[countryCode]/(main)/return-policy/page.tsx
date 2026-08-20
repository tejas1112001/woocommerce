import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Swami Om Enterprises',
  description:
    'Read the Return and Refund Policy for Swami Om Enterprises Akkalkot store. Learn about return eligibility, exchange policy, and refund processing.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/return-policy',
  },
  openGraph: {
    title: 'Return & Refund Policy | Swami Om Enterprises',
    description:
      'Return and refund guidelines for Shree Swami Samarth devotional products from Swami Om Enterprises.',
    url: 'https://swamiomenterprises.in/return-policy',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function ReturnPolicyPage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1 bg-amber-100/80 rounded-full border border-amber-300/80 mb-3">
              ✦ Customer Care Policy
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Return & Refund Policy
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Hassle-Free Replacement for Damaged or Incorrect Devotional Items
            </p>
          </div>

          <div className="prose prose-amber max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed font-normal">
            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                1. Return & Replacement Eligibility
              </h2>
              <p className="mt-3">
                At Swami Om Enterprises, we take pride in delivering pristine devotional items to every devotee. We accept returns or exchange requests within <strong>7 days of delivery</strong> under the following conditions:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Item arrived damaged, defective, or torn in transit.</li>
                <li>Incorrect product, color variant, or size delivered compared to your invoice.</li>
                <li>Item is unused, unwashed, and retained with original tags and packaging.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                2. How to Request a Return / Exchange
              </h2>
              <p className="mt-3">
                To initiate a replacement or return request:
              </p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>Take a clear photo/video of the received package showing the damaged or incorrect item.</li>
                <li>WhatsApp us at <strong className="text-orange-700">+91 73856 77447</strong> or call our helpline with your order ID.</li>
                <li>Our Akkalkot support team will verify your request and arrange a pickup or replacement dispatch promptly.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                3. Refund Processing
              </h2>
              <p className="mt-3">
                Approved refunds are processed back to your original payment method (via Razorpay for online payments or bank transfer for UPI/offline) within <strong>5 to 7 business days</strong> after item inspection.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                4. Contact Helpline
              </h2>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 mt-3 text-sm space-y-1">
                <p className="font-bold text-gray-900">Returns & Helpline Support</p>
                <p>Call / WhatsApp: +91 73856 77447 | +91 93258 83564</p>
                <p>Address: Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Solapur, Maharashtra - 413216</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
