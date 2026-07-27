import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ModuleRegistrationName } from '@medusajs/framework/utils'

export default async function fixIndiaGeoZones({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentService = container.resolve(ModuleRegistrationName.FULFILLMENT)

  logger.info('Checking for duplicate India geo zones...')

  const { data: geoZones } = await query.graph({
    entity: 'geo_zone',
    fields: ['id', 'country_code', 'type', 'service_zone_id'],
  })

  const indiaGeoZones = geoZones?.filter((gz: any) => gz.country_code === 'in')
  logger.info(`Found ${indiaGeoZones?.length || 0} geo zones for India:`)
  
  for (const gz of indiaGeoZones || []) {
    // Get service zone details
    const { data: serviceZones } = await query.graph({
      entity: 'service_zone',
      fields: ['id', 'name', 'fulfillment_set_id', 'fulfillment_set.type'],
      filters: { id: gz.service_zone_id },
    })
    
    const serviceZone = serviceZones?.[0]
    logger.info(`  - Geo Zone ${gz.id}: Service Zone "${serviceZone?.name}" (${serviceZone?.fulfillment_set?.type})`)
  }

  // Find pickup geo zone
  const pickupGeoZoneIds: string[] = []
  
  for (const gz of indiaGeoZones || []) {
    const { data: serviceZones } = await query.graph({
      entity: 'service_zone',
      fields: ['id', 'name', 'fulfillment_set.type'],
      filters: { id: gz.service_zone_id },
    })
    
    const serviceZone = serviceZones?.[0]
    if (serviceZone?.fulfillment_set?.type === 'pickup') {
      pickupGeoZoneIds.push(gz.id)
    }
  }

  if (pickupGeoZoneIds.length === 0) {
    logger.info('✅ No problematic pickup geo zones found - configuration is correct')
    return
  }

  logger.info(`\nFound ${pickupGeoZoneIds.length} pickup geo zone(s) to delete:`)
  pickupGeoZoneIds.forEach(id => logger.info(`  - ${id}`))

  // Delete the problematic geo zones
  logger.info('\nDeleting pickup geo zones...')
  await fulfillmentService.deleteGeoZones(pickupGeoZoneIds)

  logger.info('✅ Deleted pickup geo zones for India')
  logger.info('Shipping options should now work correctly!')
}
