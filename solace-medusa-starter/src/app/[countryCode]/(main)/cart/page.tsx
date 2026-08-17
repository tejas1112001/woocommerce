import { Suspense } from 'react'
import { Metadata } from 'next'

import { enrichLineItems, retrieveCart } from '@lib/data/cart'
import { getCustomer } from '@lib/data/customer'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import CartTemplate from '@modules/cart/templates'
import { Container } from '@modules/common/components/container'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart',
}

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (!cart) {
    return null
  }

  if (cart?.items?.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems
  }

  return cart
}

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  // Fetch cart and customer in parallel — customer is needed so the cart
  // Summary component can decide whether to guard the checkout button.
  const [cart, customer] = await Promise.all([
    fetchCart(),
    getCustomer().catch(() => null),
  ])

  const [region, { products }] = await Promise.all([
    getRegion(countryCode),
    getProductsList({
      pageParam: 0,
      queryParams: { limit: 9 },
      countryCode,
    }).then(({ response }) => response),
  ])

  return (
    <Container className="max-w-full bg-secondary !p-0">
      {/* Pass customer so CartTemplate → Summary can enforce authenticated checkout */}
      <CartTemplate cart={cart} customer={customer} />
      <Suspense fallback={<SkeletonProductsCarousel />}>
        <ProductCarousel
          products={products}
          title="You may also like"
          regionId={region.id}
        />
      </Suspense>
    </Container>
  )
}
