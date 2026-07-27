import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, ModuleRegistrationName } from '@medusajs/framework/utils'

export default async function createDefaultShippingProfile({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentService = container.resolve(ModuleRegistrationName.FULFILLMENT)

  logger.info('Checking shipping profiles...')
  
  const profiles = await fulfillmentService.listShippingProfiles()
  logger.info(`Found ${profiles.length} profiles`)

  if (profiles.length === 0) {
    logger.info('Creating default shipping profile...')
    const profile = await fulfillmentService.createShippingProfiles({
      name: 'Default Shipping Profile',
      type: 'default'
    })
    logger.info(`Created default shipping profile: ${profile.id}`)
  } else {
    logger.info('Shipping profile already exists')
  }
}
