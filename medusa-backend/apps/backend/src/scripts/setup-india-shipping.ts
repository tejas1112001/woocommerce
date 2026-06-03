import { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  Modules,
} from '@medusajs/framework/utils'
import { createShippingOptionsWorkflow } from '@medusajs/medusa/core-flows'

const INDIA_REGION_NAME = 'india'

export default async function setupIndiaShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: 'region',
    fields: ['id', 'name', 'currency_code'],
    filters: { name: INDIA_REGION_NAME },
  })

  const indiaRegion = regions?.[0]
  if (!indiaRegion) {
    throw new Error(`Region "${INDIA_REGION_NAME}" not found`)
  }

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'name'],
  })

  const shippingProfile = shippingProfiles?.[0]
  if (!shippingProfile) {
    throw new Error('No shipping profile found')
  }

  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name', 'fulfillment_sets.id', 'fulfillment_sets.service_zones.id'],
  })

  const stockLocation =
    stockLocations?.find((loc) =>
      loc.name?.toLowerCase().includes('main warehouse')
    ) ?? stockLocations?.[0]

  const serviceZoneId =
    stockLocation?.fulfillment_sets?.[0]?.service_zones?.[0]?.id

  if (!serviceZoneId) {
    throw new Error(
      'No fulfillment service zone on stock location. Configure fulfillment in Admin → Locations.'
    )
  }

  const { data: existingOptions } = await query.graph({
    entity: 'shipping_option',
    fields: ['id', 'name'],
  })

  const hasIndiaShipping = existingOptions?.some((opt) =>
    opt.name?.toLowerCase().includes('india')
  )

  if (hasIndiaShipping) {
    logger.info('India shipping options already exist — skipping')
    return
  }

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: 'India Standard Shipping',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Standard',
          description: 'Delivery in 3-5 business days',
          code: 'india_standard',
        },
        prices: [
          {
            currency_code: 'inr',
            amount: 99,
          },
          {
            region_id: indiaRegion.id,
            amount: 99,
          },
        ],
        rules: [
          {
            attribute: 'enabled_in_store',
            value: 'true',
            operator: 'eq',
          },
          {
            attribute: 'is_return',
            value: 'false',
            operator: 'eq',
          },
        ],
      },
    ],
  })

  logger.info(
    `Created India Standard Shipping for region ${indiaRegion.name} (${indiaRegion.currency_code})`
  )
}
