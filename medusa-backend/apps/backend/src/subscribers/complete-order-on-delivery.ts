import { completeOrderWorkflow } from "@medusajs/core-flows"
import {
  type SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Automatically marks an order as "completed" when all of its fulfillments
 * have been delivered.
 *
 * Triggered by: POST /admin/orders/:id/fulfillments/:id/mark-as-delivered
 * Event:        delivery.created  (FulfillmentWorkflowEvents.DELIVERY_CREATED)
 * Payload:      { id: fulfillmentId }
 */
export default async function completeOrderOnDelivery({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const fulfillmentId = data.id

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // 1. Traverse the fulfillment → order link to get the associated order ID
  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    filters: { id: fulfillmentId },
    fields: ["id", "order.id"],
  })

  const orderId = (fulfillments as any)?.[0]?.order?.id
  if (!orderId) {
    // Not linked to an order (e.g. a standalone return fulfillment)
    return
  }

  // 2. Query root order entity so Medusa correctly calculates fulfillment_status
  const { data: orders } = await query.graph({
    entity: "order",
    filters: { id: orderId },
    fields: ["id", "status", "fulfillment_status"],
  })

  const order = (orders as any)?.[0]
  if (!order) {
    return
  }

  // Skip if the order is already in a terminal state
  if (order.status !== "pending") {
    return
  }

  // Only complete when every fulfillment on the order is delivered
  if (order.fulfillment_status !== "delivered") {
    return
  }

  await completeOrderWorkflow(container).run({
    input: { orderIds: [order.id] },
  })
}

export const config: SubscriberConfig = {
  event: "delivery.created",
}
