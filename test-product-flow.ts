import Medusa from '@medusajs/js-sdk'

const PUBLISHABLE_KEY = 'pk_5f0d388535f5278b3bc940ed10446ad41d7d33ae756abc58a94c9d19d75939db'
const BACKEND_URL = 'http://localhost:9000'

const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
})

async function testProductFlow() {
  console.log('🧪 Testing Complete Medusa Product Flow\n')
  console.log('='.repeat(60))
  
  try {
    // Test 1: List Products
    console.log('\n1️⃣  TEST: List Products')
    const { products } = await sdk.store.product.list({}, {})
    console.log(`✓ Found ${products.length} products`)
    products.forEach((p: any) => {
      console.log(`  - ${p.title} (${p.handle})`)
    })
    
    // Test 2: Get Product by Handle
    console.log('\n2️⃣  TEST: Get Product by Handle')
    const { products: productsByHandle } = await sdk.store.product.list(
      { handle: 'swami-t-shirt' },
      {}
    )
    if (productsByHandle.length > 0) {
      const product = productsByHandle[0]
      console.log(`✓ Retrieved: ${product.title}`)
      console.log(`  Handle: ${product.handle}`)
      console.log(`  Variants: ${product.variants?.length || 0}`)
    } else {
      console.log('✗ No product found with handle "swami-t-shirt"')
    }
    
    // Test 3: List Regions
    console.log('\n3️⃣  TEST: List Regions')
    const { regions } = await sdk.store.region.list({}, {})
    console.log(`✓ Found ${regions.length} regions`)
    regions.forEach((r: any) => {
      console.log(`  - ${r.name} (${r.currency_code}) - Countries: ${r.countries?.length || 0}`)
    })
    
    // Test 4: Create Cart
    console.log('\n4️⃣  TEST: Create Cart')
    const indiaRegion = regions.find((r: any) => r.name.toLowerCase() === 'india')
    if (!indiaRegion) {
      console.log('✗ India region not found')
      return
    }
    
    const { cart } = await sdk.store.cart.create(
      { region_id: indiaRegion.id },
      {},
      {}
    )
    console.log(`✓ Cart created: ${cart.id}`)
    console.log(`  Region: ${cart.region_id}`)
    
    // Test 5: Add Item to Cart
    console.log('\n5️⃣  TEST: Add Product to Cart')
    const product = productsByHandle[0]
    if (!product || !product.variants || product.variants.length === 0) {
      console.log('✗ No variants available')
      return
    }
    
    const firstVariant = product.variants[0]
    console.log(`  Adding variant: ${firstVariant.title} (${firstVariant.id})`)
    
    const { cart: updatedCart } = await sdk.store.cart.addLineItem(
      cart.id,
      {
        variant_id: firstVariant.id,
        quantity: 1,
      },
      {},
      {}
    )
    console.log(`✓ Item added to cart`)
    console.log(`  Cart items: ${updatedCart.items?.length || 0}`)
    if (updatedCart.items && updatedCart.items.length > 0) {
      updatedCart.items.forEach((item: any) => {
        console.log(`    - ${item.product_title} (${item.variant_title}) x${item.quantity}`)
      })
    }
    
    // Test 6: Retrieve Cart
    console.log('\n6️⃣  TEST: Retrieve Cart')
    const { cart: retrievedCart } = await sdk.store.cart.retrieve(
      cart.id,
      {},
      {}
    )
    console.log(`✓ Cart retrieved successfully`)
    console.log(`  Items: ${retrievedCart.items?.length || 0}`)
    console.log(`  Total: ${retrievedCart.total} ${retrievedCart.currency_code?.toUpperCase()}`)
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ ALL TESTS PASSED!')
    console.log('='.repeat(60))
    
  } catch (error: any) {
    console.error('\n❌ TEST FAILED:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

testProductFlow()
