/**
 * Seed script: creates the "Swami T-shirt" product with:
 *   - 3 colors (Navy, White, Black) × 4 sizes (S, M, L, XL) = 12 variants
 *   - Variant-specific images stored in variant metadata (key: "images")
 *   - Variant-specific color swatch hex stored in metadata (key: "color_hex")
 *   - Variant-specific pricing (Navy ₹899, White ₹799, Black ₹849)
 *   - Inventory: 10 units per variant at the first stock location
 *
 * Run with:
 *   npx medusa exec src/scripts/seed-swami-tshirt.ts
 */

import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils'
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  updateInventoryLevelsWorkflow,
} from '@medusajs/medusa/core-flows'

const HANDLE = 'swami-t-shirt'

// Color definitions — hex for swatch, images for gallery
const COLORS = [
  {
    name: 'Navy',
    hex: '#1B2A4A',
    prices: { inr: 89900, usd: 1099, eur: 999 }, // amounts in smallest unit (paise / cents)
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    ],
  },
  {
    name: 'White',
    hex: '#FFFFFF',
    prices: { inr: 79900, usd: 999, eur: 899 },
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80',
    ],
  },
  {
    name: 'Black',
    hex: '#1A1A1A',
    prices: { inr: 84900, usd: 1049, eur: 949 },
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=800&q=80',
    ],
  },
]

const SIZES = ['S', 'M', 'L', 'XL']
const STOCK_PER_VARIANT = 10

export default async function seedSwamiTshirt({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // ── 0. Check if product already exists ──────────────────────────────────
  const { data: existing } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle'],
    filters: { handle: HANDLE },
  })

  if (existing?.length > 0) {
    logger.info(`"${HANDLE}" already exists (id: ${existing[0].id}) — skipping`)
    return
  }

  // ── 1. Resolve dependencies ─────────────────────────────────────────────
  const { data: salesChannels } = await query.graph({
    entity: 'sales_channel',
    fields: ['id', 'name'],
  })
  const defaultChannel = salesChannels?.[0]
  if (!defaultChannel) throw new Error('No sales channel found')

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'type'],
  })
  const shippingProfile =
    shippingProfiles?.find((p) => p.type === 'default') ?? shippingProfiles?.[0]
  if (!shippingProfile) throw new Error('No shipping profile found')

  const { data: categories } = await query.graph({
    entity: 'product_category',
    fields: ['id', 'name'],
    filters: { name: 'Shirts' },
  })
  const shirtCategory = categories?.[0]

  // ── 2. Build variants ────────────────────────────────────────────────────
  const variants = COLORS.flatMap((color) =>
    SIZES.map((size) => ({
      title: `${size} / ${color.name}`,
      sku: `SWAMI-${size.toUpperCase()}-${color.name.toUpperCase()}`,
      options: {
        Size: size,
        Color: color.name,
      },
      prices: [
        { amount: color.prices.inr, currency_code: 'inr' },
        { amount: color.prices.usd, currency_code: 'usd' },
        { amount: color.prices.eur, currency_code: 'eur' },
      ],
      // Store color swatch hex + variant images in metadata for the frontend
      metadata: {
        color_hex: color.hex,
        images: color.images,
      },
    }))
  )

  // ── 3. Create product ────────────────────────────────────────────────────
  logger.info(`Creating "${HANDLE}" with ${variants.length} variants…`)

  const {
    result: [product],
  } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Swami T-shirt',
          handle: HANDLE,
          description:
            'A premium everyday T-shirt inspired by the spirit of Swami Vivekananda — bold, purposeful, and enduring. Made from 100% organic cotton with a relaxed fit.',
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          ...(shirtCategory ? { category_ids: [shirtCategory.id] } : {}),
          // Product-level thumbnail shown on listing cards
          thumbnail:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
          // All product images shown in the gallery as fallback
          images: [
            { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80' },
            { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
          ],
          options: [
            { title: 'Color', values: COLORS.map((c) => c.name) },
            { title: 'Size', values: SIZES },
          ],
          variants,
          sales_channels: [{ id: defaultChannel.id }],
        },
      ],
    },
  })

  logger.info(`Created product "${product.title}" (id: ${product.id})`)

  // ── 4. Set inventory for each variant ────────────────────────────────────
  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
  })
  const stockLocation = stockLocations?.[0]
  if (!stockLocation) {
    logger.warn('No stock location found — skipping inventory setup')
    return
  }

  // Fetch the inventory items linked to the newly created variants
  const { data: variantInventory } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'inventory_items.inventory_item_id'],
    filters: { product_id: product.id },
  })

  const inventoryLevelsToCreate: Array<{
    inventory_item_id: string
    location_id: string
    stocked_quantity: number
  }> = []

  for (const variant of variantInventory ?? []) {
    const inventoryItemId = variant.inventory_items?.[0]?.inventory_item_id
    if (!inventoryItemId) {
      logger.warn(`Variant ${variant.sku} has no inventory item — skipping`)
      continue
    }

    // Check if a level already exists
    const { data: existingLevels } = await query.graph({
      entity: 'inventory_level',
      fields: ['id'],
      filters: {
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id,
      },
    })

    if (existingLevels?.length > 0) {
      await updateInventoryLevelsWorkflow(container).run({
        input: {
          updates: [
            {
              id: existingLevels[0].id,
              inventory_item_id: inventoryItemId,
              location_id: stockLocation.id,
              stocked_quantity: STOCK_PER_VARIANT,
            },
          ],
        },
      })
    } else {
      inventoryLevelsToCreate.push({
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id,
        stocked_quantity: STOCK_PER_VARIANT,
      })
    }
  }

  if (inventoryLevelsToCreate.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevelsToCreate },
    })
  }

  logger.info(
    `Inventory set to ${STOCK_PER_VARIANT} units per variant at "${stockLocation.name}"`
  )
  logger.info('✅ Swami T-shirt seeding complete!')
}
