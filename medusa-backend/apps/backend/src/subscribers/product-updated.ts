import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function productUpdatedHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storefrontUrl =
    process.env.STOREFRONT_URL ||
    (process.env.STORE_CORS ? process.env.STORE_CORS.split(",")[0] : "http://localhost:8000")
  const secret = process.env.REVALIDATE_SECRET || process.env.JWT_SECRET || "supersecret"

  try {
    const res = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tag: "products" }),
    })

    if (res.ok) {
      logger.info(`[cache-invalidation] Successfully revalidated 'products' tag in storefront for event '${event.name}'`)
    } else {
      logger.warn(`[cache-invalidation] Storefront returned ${res.status} when revalidating 'products'`)
    }
  } catch (err: any) {
    // Non-blocking: background revalidation failure should never throw
    logger.warn(`[cache-invalidation] Could not notify storefront to revalidate: ${err.message}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "inventory-level.updated",
    "inventory-item.updated",
  ],
}
