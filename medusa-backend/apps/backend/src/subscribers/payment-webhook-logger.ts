import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules, PaymentWebhookEvents } from "@medusajs/framework/utils"

export default async function paymentWebhookLogger({ event, container }: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const paymentService = container.resolve(Modules.PAYMENT)

  const timestamp = new Date().toISOString()
  logger.info(`[Payment Webhook Debug][${timestamp}] >>> Event received: ${event.name}`)
  logger.info(`[Payment Webhook Debug][${timestamp}] Provider: ${event.data?.provider}`)
  logger.info(`[Payment Webhook Debug][${timestamp}] Headers: ${JSON.stringify(event.data?.payload?.headers || {})}`)
  logger.info(`[Payment Webhook Debug][${timestamp}] Payload Data: ${JSON.stringify(event.data?.payload?.data || {})}`)

  try {
    const input = event.data
    if (input.payload?.rawData?.type === "Buffer") {
      input.payload.rawData = Buffer.from(input.payload.rawData.data)
    }
    const processedEvent = await paymentService.getWebhookActionAndData(input)
    logger.info(`[Payment Webhook Debug][${timestamp}] getWebhookActionAndData result: ${JSON.stringify(processedEvent)}`)
  } catch (err: any) {
    logger.error(`[Payment Webhook Debug][${timestamp}] Error during getWebhookActionAndData: ${err.message}`, err)
  }
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-logger",
  },
}
