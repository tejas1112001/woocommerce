import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Swami Om Enterprises',
  description:
    'Read the Privacy Policy for Swami Om Enterprises. Learn how we handle customer data, payment security via Razorpay, and data protection for our devotional store.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Swami Om Enterprises',
    description:
      'Privacy Policy for Swami Om Enterprises. Information on data collection, security, and customer privacy.',
    url: 'https://swamiomenterprises.in/privacy-policy',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-amber-200/60 shadow-sm space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1 bg-amber-100/80 rounded-full border border-amber-300/80 mb-3">
              ✦ Official Document
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: August 20, 2026 | Swami Om Enterprises, Akkalkot
            </p>
          </div>

          <div className="prose prose-amber max-w-none text-gray-700 space-y-6 text-sm sm:text-base leading-relaxed font-normal">
            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                1. Overview
              </h2>
              <p className="mt-3">
                Swami Om Enterprises (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operating from Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Solapur, Maharashtra, values your trust. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit and purchase from our store at <strong className="text-orange-700">swamiomenterprises.in</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                To fulfill your retail and wholesale orders for authentic Shree Swami Samarth devotional products, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <td><strong>Contact & Delivery Details:</strong> Full Name, shipping address, PIN code, mobile number, and email address.</td>
                <td><strong>Order & Billing Information:</strong> Items purchased, quantities, invoice preference, and payment confirmation tokens.</td>
                <td><strong>Technical Data:</strong> IP address, device type, browser information, and browsing activity on our store for performance optimization.</td>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                3. Payment Security & Processing
              </h2>
              <p className="mt-3">
                All online transactions are securely processed through <strong>Razorpay</strong> using 256-bit SSL encryption. We do not store or process payment card numbers, UPI PINs, or bank passwords on our servers. Payment authentication is handled entirely by financial networks and certified payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                4. How We Use Your Data
              </h2>
              <p className="mt-3">
                We use collected information strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Process and deliver orders across Maharashtra and Pan-India.</li>
                <li>Send order confirmations, shipping updates, and tracking details via SMS or WhatsApp.</li>
                <li>Provide customer support and process wholesale inquiries.</li>
                <li>Ensure site security and prevent fraudulent transactions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                5. Third-Party Sharing
              </h2>
              <p className="mt-3">
                We never sell, rent, or trade customer data. Information is shared only with verified service providers necessary to operate our business: courier partners for parcel delivery, payment gateway providers (Razorpay), and legal authorities when required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 border-b border-amber-200 pb-2">
                6. Contact Us
              </h2>
              <p className="mt-3">
                If you have questions or concerns regarding your privacy or data protection, please contact us at:
              </p>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80 mt-3 text-sm space-y-1">
                <p className="font-bold text-gray-900">Swami Om Enterprises</p>
                <p>Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot, Dist. Solapur, Maharashtra - 413216</p>
                <p>Phone: +91 73856 77447 | +91 91752 53282 | +91 93258 83564</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
