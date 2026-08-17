import dotenv from 'dotenv'
import path from 'path'
// Load env files before importing any project files
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

console.log("NEXT_PUBLIC_MEDUSA_BACKEND_URL:", process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)
console.log("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)

async function run() {
  // Dynamically import after env is loaded
  const { getRegion, listRegions } = await import('../src/lib/data/regions')
  const { getProductByHandle } = await import('../src/lib/data/products')

  try {
    console.log("\n--- Testing listRegions() ---")
    try {
      const regions = await listRegions()
      console.log("listRegions() returned:", regions ? `${regions.length} regions` : "null/undefined")
      if (regions) {
        console.log("Regions details:", JSON.stringify(regions.map(r => ({ id: r.id, name: r.name, countries: r.countries?.map(c => c.iso_2) })), null, 2))
      }
    } catch (e: any) {
      console.error("listRegions() failed with error:", e.message, e.stack)
    }

    console.log("\n--- Testing getRegion('in') ---")
    const region = await getRegion('in')
    console.log("getRegion('in') result:", region ? JSON.stringify({ id: region.id, name: region.name }, null, 2) : "null")
    
    if (region) {
      console.log(`\n--- Testing getProductByHandle('t-shirt', '${region.id}') ---`)
      const product = await getProductByHandle('t-shirt', region.id)
      console.log("Product result:", product ? JSON.stringify({ id: product.id, title: product.title }, null, 2) : "null")
    }
  } catch (error) {
    console.error("Unexpected error in run:", error)
  }
}
run()
