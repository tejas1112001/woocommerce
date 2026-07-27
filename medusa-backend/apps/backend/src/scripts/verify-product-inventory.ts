import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function verifyProductInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Checking product inventory and shipping profile setup...')

  // Check products
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'title', 'handle', 'status'],
    filters: { status: 'published' },
  })

  logger.info(`\nFound ${products?.length || 0} published products`)

  for (const product of products || []) {
    logger.info(`\nProduct: ${product.title} (${product.handle})`)
    
    // Check variants
    const { data: variants } = await query.graph({
      entity: 'product_variant',
      fields: ['id', 'title', 'sku', 'inventory_items.inventory_item_id'],
      filters: { product_id: product.id },
    })

    logger.info(`  Variants: ${variants?.length || 0}`)

    // Check inventory for first variant
    if (variants && variants.length > 0) {
      const firstVariant = variants[0]
      logger.info(`  Checking variant: ${firstVariant.title}`)
      
      const inventoryItemId = firstVariant.inventory_items?.[0]?.inventory_item_id
      
      if (!inventoryItemId) {
        logger.warn(`  ⚠️  No inventory item linked to variant!`)
        continue
      }

      // Check inventory levels
      const { data: inventoryLevels } = await query.graph({
        entity: 'inventory_level',
        fields: ['id', 'stocked_quantity', 'location_id', 'stock_location.name'],
        filters: { inventory_item_id: inventoryItemId },
      })

      if (!inventoryLevels || inventoryLevels.length === 0) {
        logger.warn(`  ⚠️  No inventory levels found!`)
      } else {
        logger.info(`  Inventory locations:`)
        inventoryLevels.forEach((level: any) => {
          logger.info(`    - ${level.stock_location?.name}: ${level.stocked_quantity} units`)
        })
      }
    }
  }

  // Check shipping options
  logger.info('\n=== Shipping Options ===')
  const { data: shippingOptions } = await query.graph({
    entity: 'shipping_option',
    fields: ['id', 'name', 'provider_id', 'service_zone_id', 'service_zone.name', 'service_zone.fulfillment_set.name'],
  })

  shippingOptions?.forEach((opt: any) => {
    logger.info(`\nOption: ${opt.name}`)
    logger.info(`  Service Zone: ${opt.service_zone?.name}`)
    logger.info(`  Fulfillment Set: ${opt.service_zone?.fulfillment_set?.name}`)
    logger.info(`  Provider: ${opt.provider_id}`)
  })

  // Check service zones and geo zones
  logger.info('\n=== Service Zones & Geo Zones ===')
  const { data: serviceZones } = await query.graph({
    entity: 'service_zone',
    fields: ['id', 'name', 'fulfillment_set.type', 'geo_zones.country_code'],
  })

  serviceZones?.forEach((zone: any) => {
    logger.info(`\nZone: ${zone.name} (${zone.fulfillment_set?.type})`)
    logger.info(`  Countries: ${zone.geo_zones?.map((gz: any) => gz.country_code).join(', ') || 'none'}`)
  })
}
