import { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  Modules,
} from '@medusajs/framework/utils'

const WINTER_TSHIRT_HANDLE = 'winter-t-shirt'

export default async function fixWinterTshirtShippingProfile({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle'],
    filters: { handle: WINTER_TSHIRT_HANDLE },
  })

  const product = products?.[0]
  if (!product) {
    throw new Error(`Product not found: ${WINTER_TSHIRT_HANDLE}`)
  }

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'name', 'type'],
  })

  const defaultProfile =
    shippingProfiles?.find((p) => p.type === 'default') ?? shippingProfiles?.[0]

  if (!defaultProfile) {
    throw new Error('No shipping profile found')
  }

  const { data: existingLinks } = await query.graph({
    entity: 'product',
    fields: ['id', 'shipping_profile.id'],
    filters: { id: product.id },
  })

  if (existingLinks?.[0]?.shipping_profile?.id === defaultProfile.id) {
    logger.info('Winter T-shirt already has the correct shipping profile')
    return
  }

  await link.create({
    [Modules.PRODUCT]: { product_id: product.id },
    [Modules.FULFILLMENT]: { shipping_profile_id: defaultProfile.id },
  })

  logger.info(
    `Linked "${WINTER_TSHIRT_HANDLE}" to shipping profile ${defaultProfile.name ?? defaultProfile.id}`
  )
}
