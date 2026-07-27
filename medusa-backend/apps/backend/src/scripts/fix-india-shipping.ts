import { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
} from '@medusajs/framework/utils'
import { createShippingOptionsWorkflow } from '@medusajs/medusa/core-flows'

export default async function fixIndiaShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Get India region
  const { data: regions } = await query.graph({
    entity: 'region',
    fields: ['id', 'name', 'currency_code'],
  })

  const indiaRegion = regions?.find(r => r.name?.toLowerCase() === 'india')
  if (!indiaRegion) {
    throw new Error('Region "india" not found')
  }

  // Get shipping profile
  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'name', 'type'],
  })

  const shippingProfile = shippingProfiles?.[0]
  if (!shippingProfile) {
    throw new Error('No shipping profile found')
  }

  // Get the Main Warehouse shipping fulfillment set (not pickup)
  const { data: fulfillmentSets } = await query.graph({
    entity: 'fulfillment_set',
    fields: ['id', 'name', 'type', 'service_zones.id', 'service_zones.name', 'service_zones.geo_zones.country_code'],
  })

  // Find the shipping (not pickup) fulfillment set that has India geo zone
  const shippingFulfillmentSet = fulfillmentSets?.find(
    (set) => set.type === 'shipping' && 
    set.service_zones?.some((zone: any) => 
      zone.geo_zones?.some((geo: any) => geo.country_code === 'in')
    )
  )

  if (!shippingFulfillmentSet) {
    throw new Error('No shipping fulfillment set found for India')
  }

  const serviceZone = shippingFulfillmentSet.service_zones?.find((zone: any) =>
    zone.geo_zones?.some((geo: any) => geo.country_code === 'in')
  )

  if (!serviceZone) {
    throw new Error('No service zone found for India')
  }

  logger.info(`Found service zone: ${serviceZone.name} (${serviceZone.id})`)

  // Check if shipping option already exists for this service zone
  const { data: existingOptions } = await query.graph({
    entity: 'shipping_option',
    fields: ['id', 'name', 'service_zone_id'],
    filters: { service_zone_id: serviceZone.id },
  })

  if (existingOptions && existingOptions.length > 0) {
    logger.info(`Shipping options already exist for service zone ${serviceZone.name}:`)
    existingOptions.forEach((opt) => logger.info(`  - ${opt.name}`))
    return
  }

  // Create shipping options
  logger.info(`Creating shipping options for service zone: ${serviceZone.name}`)

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: 'Standard Shipping',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: serviceZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Standard',
          description: 'Delivery in 5-7 business days',
          code: 'standard',
        },
        prices: [
          {
            currency_code: 'inr',
            amount: 5000, // ₹50
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
      {
        name: 'Express Shipping',
        price_type: 'flat',
        provider_id: 'manual_manual',
        service_zone_id: serviceZone.id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: 'Express',
          description: 'Delivery in 2-3 business days',
          code: 'express',
        },
        prices: [
          {
            currency_code: 'inr',
            amount: 15000, // ₹150
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

  logger.info('✅ Created shipping options for India!')
}
