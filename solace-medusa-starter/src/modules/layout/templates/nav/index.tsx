import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'
import { Container } from '@modules/common/components/container'

import NavActions from './nav-actions'
import NavContent from './nav-content'
import NavScrollWrapper from './nav-scroll-wrapper'

export default async function NavWrapper(props: any) {
  const [productCategories, { collections }, { products }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
    getProductsList({
      pageParam: 0,
      queryParams: { limit: 4 },
      countryCode: props.countryCode,
    }).then(({ response }) => response),
  ])

  return (
    // `relative` is REQUIRED here so that the mega menu (position:absolute + top-full)
    // anchors to the bottom of the nav bar instead of the viewport.
    <NavScrollWrapper>
      <Container
        as="nav"
        className="relative mx-0 max-w-full border-b border-basic-primary bg-primary !py-0 medium:!px-14"
      >
        <Container className="flex items-center !p-0">
          <NavContent
            productCategories={productCategories}
            collections={collections}
            countryCode={props.countryCode}
            products={products}
          />
          <NavActions />
        </Container>
      </Container>
    </NavScrollWrapper>
  )
}
