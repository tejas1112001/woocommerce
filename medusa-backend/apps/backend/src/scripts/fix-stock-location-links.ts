import { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  Modules,
} from '@medusajs/framework/utils'

export default async function fixStockLocationLinks({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info('Checking stock location to fulfillment set links...')

  // Get Main Warehouse
  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
  })

  const mainWarehouse = stockLocations?.find((loc) =>
    loc.name?.toLowerCase().includes('main warehouse')
  )

  if (!mainWarehouse) {
    throw new Error('Main Warehouse stock location not found')
  }

  logger.info(`Found Main Warehouse: ${mainWarehouse.id}`)

  // Get the shipping fulfillment set for Main Warehouse
  const { data: fulfillmentSets } = await query.graph({
    entity: 'fulfillment_set',
    fields: ['id', 'name', 'type', 'service_zones.id', 'service_zones.geo_zones.country_code'],
  })

  const mainShippingSet = fulfillmentSets?.find(
    (set) =>
      set.type === 'shipping' &&
      set.name?.toLowerCase().includes('main warehouse') &&
      set.service_zones?.some((zone: any) =>
        zone.geo_zones?.some((geo: any) => geo.country_code === 'in')
      )
  )

  if (!mainShippingSet) {
    throw new Error('Main Warehouse shipping fulfillment set not found')
  }

  logger.info(`Found fulfillment set: ${mainShippingSet.name} (${mainShippingSet.id})`)

  // Check if link exists
  const { data: existingLinks } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name', 'fulfillment_sets.id'],
    filters: { id: mainWarehouse.id },
  })

  const linkedSetIds = existingLinks?.[0]?.fulfillment_sets?.map((set: any) => set.id) || []
  
  if (linkedSetIds.includes(mainShippingSet.id)) {
    logger.info('Stock location is already linked to fulfillment set')
    return
  }

  // Create link
  logger.info('Creating link between stock location and fulfillment set...')
  
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: mainWarehouse.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: mainShippingSet.id,
    },
  })

  logger.info('✅ Link created successfully!')

  // Also link to manual fulfillment provider
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: mainWarehouse.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: 'manual_manual',
    },
  })

  logger.info('✅ Linked to manual fulfillment provider!')
}
