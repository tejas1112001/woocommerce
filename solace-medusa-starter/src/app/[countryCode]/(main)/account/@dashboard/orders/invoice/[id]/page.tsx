import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { enrichLineItems } from '@lib/data/cart'
import { retrieveOrder } from '@lib/data/orders'
import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { TejasLogo } from '@modules/common/icons'
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
    title: `SwamiOmEnterprises_Invoice_INV_${order.display_id}`,
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
    if (amount === undefined || amount === null) return '-'
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

  return (
    <div className="min-h-screen bg-neutral-100/60 dark:bg-neutral-950 py-6 sm:py-10 px-4 sm:px-6 print:p-0 print:m-0 print:bg-white print:min-h-0 font-sans text-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-4xl print:max-w-none print:w-full">
        {/* Top Header Actions (hidden in print) */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 print:hidden">
          <div>
            <h1 className="!text-lg sm:!text-xl !font-bold tracking-tight text-neutral-900 dark:text-white">
              Order Invoice #{order.display_id}
            </h1>
            <p className="text-xs text-neutral-500">
              Generated on {formattedDate}
            </p>
          </div>
          <InvoiceActions displayId={order.display_id} />
        </div>

        {/* Printable Invoice Card Container */}
        <div className="printable-invoice-card bg-white text-neutral-900 rounded-2xl shadow-xl border border-neutral-200/80 p-4 sm:p-8 md:p-10 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none">
          {/* Invoice Header: Brand + Document Meta */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 sm:pb-5 print:pb-4 border-b border-neutral-200 gap-3.5 print-avoid-break">
            {/* Brand Logo & Name */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <TejasLogo className="h-10 sm:h-14 print:h-12 w-auto flex-shrink-0" />
                <div className="border-l border-neutral-200 pl-2.5 sm:pl-3.5 py-0.5">
                  <h2 className="text-sm sm:text-lg print:text-lg font-black tracking-tight text-neutral-900 uppercase leading-snug">
                    {process.env.NEXT_PUBLIC_SHOP_NAME || 'Swami Om Enterprises'}
                  </h2>
                  <p className="text-[11px] sm:text-xs print:text-[11px] text-neutral-500 font-medium">
                    Tax Invoice / Order Receipt
                  </p>
                </div>
              </div>
              <span className="sm:hidden px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white flex-shrink-0">
                Invoice
              </span>
            </div>

            {/* Document Metadata */}
            <div className="flex flex-wrap sm:flex-col justify-between sm:justify-start sm:text-right bg-neutral-50/80 sm:bg-transparent rounded-lg p-2 sm:p-0 border sm:border-0 border-neutral-200/70 text-[11px] sm:text-xs print:text-[11px] text-neutral-600 gap-y-1 gap-x-3">
              <span className="hidden sm:inline-block self-end px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white print:bg-neutral-900 print:text-white mb-1">
                Invoice
              </span>
              <p>
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px] sm:text-[10px]">Invoice:</span>{' '}
                <span className="font-bold text-neutral-900">INV-{order.display_id}</span>
              </p>
              <p>
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px] sm:text-[10px]">Order:</span>{' '}
                <span className="font-bold text-neutral-900">#{order.display_id}</span>
              </p>
              <p>
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px] sm:text-[10px]">Date:</span>{' '}
                <span className="font-medium text-neutral-900">{formattedDate}</span>
              </p>
            </div>
          </div>

          {/* Shipping & Delivery Address Card (Billing address hidden as requested) */}
          <div className="my-5 print:my-4 print-avoid-break">
            <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/60 print:bg-white p-3.5 sm:p-5 print:p-3">
              <div className="border-b border-neutral-200 pb-1.5 mb-2.5">
                <h3 className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500">
                  Shipping & Delivery Address
                </h3>
              </div>
              {order.shipping_address ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-xs print:text-[11px] text-neutral-700">
                  <div className="space-y-0.5">
                    <p className="font-bold text-neutral-900 text-sm print:text-xs">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
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
                      {order.shipping_address.province ? `, ${order.shipping_address.province}` : ''}
                      {order.shipping_address.postal_code ? ` ${order.shipping_address.postal_code}` : ''}
                    </p>
                    <p className="font-semibold text-neutral-900 uppercase">
                      {order.shipping_address.country_code?.toUpperCase()}
                    </p>
                  </div>
                  <div className="space-y-1 sm:border-l sm:border-neutral-200 sm:pl-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                    <p className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      Contact Information
                    </p>
                    {order.shipping_address.phone && (
                      <p className="text-neutral-600">
                        Phone: <span className="font-medium text-neutral-900">{order.shipping_address.phone}</span>
                      </p>
                    )}
                    <p className="text-neutral-600">
                      Email: <span className="font-medium text-neutral-900">{order.email}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-400 italic pt-1 text-xs">No shipping address provided</p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="overflow-x-auto mb-5 print:mb-4 rounded-xl border border-neutral-200 print-avoid-break">
            <table className="w-full text-left border-collapse text-xs print:text-[11px] min-w-[480px] sm:min-w-0">
              <thead>
                <tr className="bg-neutral-100 print:bg-neutral-100/90 border-b border-neutral-200 text-neutral-700">
                  <th className="py-2.5 px-3 print:py-2 print:px-2.5 font-bold text-[10px] uppercase tracking-wider w-12 text-center text-neutral-500">#</th>
                  <th className="py-2.5 px-3 print:py-2 print:px-2.5 font-bold text-[10px] uppercase tracking-wider text-neutral-700">Item Description</th>
                  <th className="py-2.5 px-3 print:py-2 print:px-2.5 text-center font-bold text-[10px] uppercase tracking-wider text-neutral-700 w-16">Qty</th>
                  <th className="py-2.5 px-3 print:py-2 print:px-2.5 text-right font-bold text-[10px] uppercase tracking-wider text-neutral-700 w-28">Unit Price</th>
                  <th className="py-2.5 px-3 print:py-2 print:px-2.5 text-right font-bold text-[10px] uppercase tracking-wider text-neutral-700 w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80">
                {order.items?.map((item: any, index: number) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors print:bg-transparent">
                    <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-center text-neutral-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 print:py-2 print:px-2.5">
                      <div className="font-bold text-neutral-900">{item.title}</div>
                      {item.variant?.title && item.variant.title !== 'Default Variant' && (
                        <div className="text-[11px] print:text-[10px] text-neutral-500 font-medium mt-0.5">
                          Variant: {item.variant.title}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-center font-semibold text-neutral-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-right text-neutral-700 font-mono">
                      {getAmount(item.unit_price)}
                    </td>
                    <td className="py-2.5 px-3 print:py-2 print:px-2.5 text-right font-bold text-neutral-900 font-mono">
                      {getAmount(item.unit_price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals Card */}
          <div className="flex justify-end mb-6 print:mb-4 print-avoid-break">
            <div className="w-full sm:w-80 print:w-72 rounded-xl bg-neutral-50 print:bg-white border border-neutral-200 p-4 print:p-3 space-y-2 text-xs print:text-[11px]">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 font-mono">{getAmount(order.item_total)}</span>
              </div>

              {(order.discount_total ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span className="font-semibold font-mono">- {getAmount(order.discount_total)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-semibold text-neutral-900 font-mono">{getAmount(order.shipping_total)}</span>
              </div>

              {(order.tax_total ?? 0) > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span className="font-semibold text-neutral-900 font-mono">{getAmount(order.tax_total)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-200/90 flex justify-between font-extrabold text-sm print:text-xs text-neutral-900">
                <span>Total Amount</span>
                <span className="text-neutral-900 font-mono">{getAmount(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] print:text-[10px] text-neutral-400 border-t border-neutral-200 pt-4 print:pt-3 space-y-0.5 print-avoid-break">
            <p className="font-medium text-neutral-500">Thank you for your business!</p>
            <p>If you have any questions regarding this invoice, please contact our support team.</p>
            <p className="text-neutral-400 pt-0.5">
              &copy; {new Date().getFullYear()}{' '}
              {process.env.NEXT_PUBLIC_SHOP_NAME || 'Swami Om Enterprises'}. All rights reserved. &bull; Computer Generated Document
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

