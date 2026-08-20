import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wholesale & Bulk Orders | Swami Om Enterprises Akkalkot',
  description:
    'Wholesale Shree Swami Samarth devotional products direct from Akkalkot. Slab pricing, custom printing, and bulk orders for mandals, temples, and resellers.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/wholesale',
  },
  openGraph: {
    title: 'Wholesale & Bulk Devotional Orders | Swami Om Enterprises',
    description:
      'Direct manufacturer and bulk supplier for Swami Samarth kurtas, dhotis, topis, shawls, metal frames, and napkins in Akkalkot.',
    url: 'https://swamiomenterprises.in/wholesale',
    siteName: 'Swami Om Enterprises',
    type: 'website',
  },
}

export default function WholesalePage() {
  return (
    <div className="bg-amber-50/30 min-h-screen py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-4 py-1.5 bg-amber-100 rounded-full border border-amber-300">
            ✦ घाऊक आणि मोठ्या प्रमाणात ऑर्डर (Wholesale & Bulk Orders) ✦
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Wholesale Devotional Goods from Akkalkot
          </h1>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Supplying temples, mandals, utsav committees, stall owners, and spiritual retailers with authentic Shree Swami Samarth devotional items at direct slab pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-3">
            <div className="text-3xl">🏬</div>
            <h3 className="text-lg font-bold text-gray-900">Direct Akkalkot Dispatch</h3>
            <p className="text-sm text-gray-600">
              Shipped straight from Shri Swami Samarth Annachhatra Mandal Premises, Akkalkot.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-3">
            <div className="text-3xl">📦</div>
            <h3 className="text-lg font-bold text-gray-900">Attractive Bulk Slabs</h3>
            <p className="text-sm text-gray-600">
              Discounts available for orders starting at 25, 50, 100+ pieces across apparel & accessories.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-3">
            <div className="text-3xl">📑</div>
            <h3 className="text-lg font-bold text-gray-900">GST Invoice & Transport</h3>
            <p className="text-sm text-gray-600">
              Official GST invoices for mandals & companies with custom transport logistics.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-900 via-amber-900 to-orange-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-orange-500/30 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-200">
            Interested in Bulk Purchases or Reselling?
          </h2>
          <p className="text-amber-100 max-w-2xl mx-auto text-sm sm:text-base">
            Call or WhatsApp our Akkalkot wholesale desk directly for rate cards, sample inquiries, and festival bulk bookings.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://wa.me/917385677447?text=Hello%20Swami%20Om%20Enterprises,%20I%20am%20interested%20in%20a%20wholesale%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md"
            >
              <span>💬 WhatsApp Wholesale Enquiry</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-sm border border-white/30 transition-all"
            >
              <span>Contact Address & Details</span>
            </Link>
          </div>
          <div className="pt-4 text-xs text-amber-200/80">
            Helplines: +91 73856 77447 | +91 91752 53282 | +91 93258 83564
          </div>
        </div>
      </div>
    </div>
  )
}
