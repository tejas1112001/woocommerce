import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { enrichLineItems } from '@lib/data/cart'
import { retrieveOrder } from '@lib/data/orders'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import InvoiceActions from './invoice-actions'

type Props = {
  params: Promise<{ id: string }>
}

async function getOrder(id: string) {
  const order = await retrieveOrder(id)

  if (!order) {
    return null
  }

  const enrichedItems = await enrichLineItems(order.items, order.region_id!)

  return {
    ...order,
    items: enrichedItems,
  } as unknown as HttpTypes.StoreOrder
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await getOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Invoice #${order.display_id}`,
    description: `Invoice for order #${order.display_id}`,
  }
}

export default async function InvoicePage(props: Props) {
  const params = await props.params
  const order = await getOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  const getAmount = (amount?: number | null) => {
    if (amount === undefined || amount === null) return '—'
    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  const paymentProvider =
    order.payment_collections?.[0]?.payments?.[0]?.provider_id
      ? order.payment_collections[0].payments[0].provider_id
          .replace('pp_', '')
          .replace(/_/g, ' ')
      : 'Standard Payment'

  const shippingMethodName =
    order.shipping_methods?.[0]?.name || 'Standard Shipping'

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 py-6 sm:py-10 px-4 sm:px-6 print:p-0 print:bg-white font-sans text-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-4xl">
        {/* Top Header Actions (hidden in print) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 print:hidden">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Order Invoice #{order.display_id}
            </h1>
            <p className="text-xs text-neutral-500">
              Generated on {formattedDate}
            </p>
          </div>
          <InvoiceActions />
        </div>

        {/* Printable Invoice Card Container */}
        <div className="bg-white text-neutral-900 rounded-2xl shadow-xl border border-neutral-200/80 p-6 sm:p-10 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
          {/* Invoice Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                {process.env.NEXT_PUBLIC_SHOP_NAME || 'Swami Om Enterprises'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                Thank you for your purchase!
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 bg-neutral-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-none border-neutral-200/60">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white mb-1">
                Invoice
              </span>
              <p className="text-xs sm:text-sm text-neutral-600">
                Invoice No:{' '}
                <span className="font-bold text-neutral-900">
                  INV-{order.display_id}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                Order ID:{' '}
                <span className="font-semibold text-neutral-900">
                  #{order.display_id}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-neutral-600">
                Date: <span className="font-medium">{formattedDate}</span>
              </p>
            </div>
          </div>

          {/* Customer & Address Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Shipping Address Card */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-2">
                Shipping Address
              </h3>
              {order.shipping_address ? (
                <div className="text-neutral-700 leading-relaxed space-y-0.5 pt-1">
                  <p className="font-bold text-neutral-900 text-sm">
                    {order.shipping_address.first_name}{' '}
                    {order.shipping_address.last_name}
                  </p>
                  {order.shipping_address.company && (
                    <p className="font-medium text-neutral-800">
                      {order.shipping_address.company}
                    </p>
                  )}
                  <p>{order.shipping_address.address_1}</p>
                  {order.shipping_address.address_2 && (
                    <p>{order.shipping_address.address_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}
                    {order.shipping_address.province
                      ? `, ${order.shipping_address.province}`
                      : ''}
                    {order.shipping_address.postal_code
                      ? ` ${order.shipping_address.postal_code}`
                      : ''}
                  </p>
                  <p className="font-medium">{order.shipping_address.country_code?.toUpperCase()}</p>
                  {order.shipping_address.phone && (
                    <p className="text-neutral-600 pt-1">
                      Phone: <span className="font-medium">{order.shipping_address.phone}</span>
                    </p>
                  )}
                  <p className="text-neutral-600">
                    Email: <span className="font-medium">{order.email}</span>
                  </p>
                </div>
              ) : (
                <p className="text-neutral-500 italic pt-1">No shipping address provided</p>
              )}
            </div>

            {/* Billing Address Card */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 pb-2">
                Billing Address
              </h3>
              {order.billing_address ? (
                <div className="text-neutral-700 leading-relaxed space-y-0.5 pt-1">
                  <p className="font-bold text-neutral-900 text-sm">
                    {order.billing_address.first_name}{' '}
                    {order.billing_address.last_name}
                  </p>
                  {order.billing_address.company && (
                    <p className="font-medium text-neutral-800">
                      {order.billing_address.company}
                    </p>
                  )}
                  <p>{order.billing_address.address_1}</p>
                  {order.billing_address.address_2 && (
                    <p>{order.billing_address.address_2}</p>
                  )}
                  <p>
                    {order.billing_address.city}
                    {order.billing_address.province
                      ? `, ${order.billing_address.province}`
                      : ''}
                    {order.billing_address.postal_code
                      ? ` ${order.billing_address.postal_code}`
                      : ''}
                  </p>
                  <p className="font-medium">{order.billing_address.country_code?.toUpperCase()}</p>
                  {order.billing_address.phone && (
                    <p className="text-neutral-600 pt-1">
                      Phone: <span className="font-medium">{order.billing_address.phone}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-neutral-500 italic pt-1">Same as shipping address</p>
              )}
            </div>
          </div>

          {/* Payment & Shipping Details Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-neutral-100/70 border border-neutral-200/80 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-neutral-500">
                Payment:
              </span>
              <span className="font-semibold text-neutral-900 capitalize">
                {paymentProvider}
              </span>
              {order.payment_status && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
                  {order.payment_status}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-neutral-500">
                Shipping:
              </span>
              <span className="font-semibold text-neutral-900">
                {shippingMethodName}
              </span>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="overflow-x-auto mb-8 rounded-xl border border-neutral-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Item</th>
                  <th className="py-3 px-4 text-center font-bold uppercase tracking-wider">Qty</th>
                  <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Unit Price</th>
                  <th className="py-3 px-4 text-right font-bold uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{item.title}</div>
                      {item.variant?.title && item.variant.title !== 'Default Variant' && (
                        <div className="text-xs text-neutral-500 font-medium mt-0.5">
                          Variant: {item.variant.title}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-700">
                      {getAmount(item.unit_price)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                      {getAmount(item.unit_price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals Card */}
          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-80 rounded-xl bg-neutral-50 border border-neutral-200 p-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">{getAmount(order.item_total)}</span>
              </div>

              {(order.discount_total ?? 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span className="font-medium">- {getAmount(order.discount_total)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-neutral-900">{getAmount(order.shipping_total)}</span>
              </div>

              {(order.tax_total ?? 0) > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span className="font-medium text-neutral-900">{getAmount(order.tax_total)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-base text-neutral-900">
                <span>Total</span>
                <span>{getAmount(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-neutral-400 border-t border-neutral-200 pt-6 space-y-1">
            <p>If you have any questions regarding this invoice, please contact support.</p>
            <p>
              &copy; {new Date().getFullYear()}{' '}
              {process.env.NEXT_PUBLIC_SHOP_NAME || 'Swami Om Enterprises'}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
