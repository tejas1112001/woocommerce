import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/customer/check-email?email=...
 * Checks if a customer exists with the given email address.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const emailParam = req.query.email as string
  if (!emailParam) {
    return res.status(400).json({ exists: false })
  }

  const email = emailParam.toLowerCase().trim()

  try {
    const query = req.scope.resolve("query")
    const { data: customers } = await query.graph({
      entity: "customer",
      filters: { email },
      fields: ["id", "email"],
    })

    const exists = Array.isArray(customers) && customers.length > 0
    return res.status(200).json({ exists })
  } catch (error: any) {
    req.scope.resolve("logger").error(`[check-email] Error checking email: ${error.message}`)
    return res.status(500).json({ exists: false, error: error.message })
  }
}
