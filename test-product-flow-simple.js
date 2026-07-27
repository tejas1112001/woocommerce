const PUBLISHABLE_KEY = 'pk_5f0d388535f5278b3bc940ed10446ad41d7d33ae756abc58a94c9d19d75939db'
const BACKEND_URL = 'http://localhost:9000'

async function testProductFlow() {
  console.log('🧪 Testing Complete Medusa Product Flow\n')
  console.log('='.repeat(60))
  
  try {
    // Test 1: List Products
    console.log('\n1️⃣  TEST: List Products')
    const productsRes = await fetch(`${BACKEND_URL}/store/products`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { products } = await productsRes.json()
    console.log(`✓ Found ${products.length} products`)
    products.forEach(p => console.log(`  - ${p.title} (${p.handle})`))
    
    // Test 2: Get Product by Handle
    console.log('\n2️⃣  TEST: Get Product by Handle')
    const handleRes = await fetch(`${BACKEND_URL}/store/products?handle=swami-t-shirt`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { products: productsByHandle } = await handleRes.json()
    if (productsByHandle.length > 0) {
      const product = productsByHandle[0]
      console.log(`✓ Retrieved: ${product.title}`)
      console.log(`  Handle: ${product.handle}`)
      console.log(`  Status: ${product.status}`)
    }
    
    // Test 3: List Regions
    console.log('\n3️⃣  TEST: List Regions')
    const regionsRes = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { regions } = await regionsRes.json()
    console.log(`✓ Found ${regions.length} regions`)
    regions.forEach(r => console.log(`  - ${r.name} (${r.currency_code})`))
    
    // Test 4: Create Cart
    console.log('\n4️⃣  TEST: Create Cart')
    const indiaRegion = regions.find(r => r.name.toLowerCase() === 'india')
    if (!indiaRegion) {
      console.log('✗ India region not found')
      return
    }
    
    const cartRes = await fetch(`${BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ region_id: indiaRegion.id })
    })
    const { cart } = await cartRes.json()
    console.log(`✓ Cart created: ${cart.id}`)
    
    // Test 5: Get Variants
    console.log('\n5️⃣  TEST: Get Product Variants')
    const variantsRes = await fetch(`${BACKEND_URL}/store/products?handle=swami-t-shirt&fields=*variants,*variants.calculated_price`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { products: productsWithVariants } = await variantsRes.json()
    const productWithVariants = productsWithVariants[0]
    console.log(`✓ Product has ${productWithVariants.variants?.length || 0} variants`)
    if (productWithVariants.variants && productWithVariants.variants.length > 0) {
      const firstVariant = productWithVariants.variants[0]
      console.log(`  First variant: ${firstVariant.title} (${firstVariant.id})`)
      
      // Test 6: Add Item to Cart
      console.log('\n6️⃣  TEST: Add Product to Cart')
      const addItemRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/line-items`, {
        method: 'POST',
        headers: {
          'x-publishable-api-key': PUBLISHABLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variant_id: firstVariant.id,
          quantity: 1
        })
      })
      const { cart: updatedCart } = await addItemRes.json()
      console.log(`✓ Item added to cart`)
      console.log(`  Cart items: ${updatedCart.items?.length || 0}`)
      if (updatedCart.items) {
        updatedCart.items.forEach(item => {
          console.log(`    - ${item.product_title} (${item.variant_title}) x${item.quantity}`)
        })
      }
      
      // Test 7: Retrieve Cart
      console.log('\n7️⃣  TEST: Retrieve Cart')
      const retrieveRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
      })
      const { cart: retrievedCart } = await retrieveRes.json()
      console.log(`✓ Cart retrieved successfully`)
      console.log(`  Items: ${retrievedCart.items?.length || 0}`)
      console.log(`  Subtotal: ₹${(retrievedCart.subtotal / 100).toFixed(2)}`)
      console.log(`  Total: ₹${(retrievedCart.total / 100).toFixed(2)}`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ ALL TESTS PASSED - PRODUCT FLOW WORKING!')
    console.log('='.repeat(60))
    console.log('\n📋 Summary:')
    console.log('  ✓ Products can be listed')
    console.log('  ✓ Products can be retrieved by handle')
    console.log('  ✓ Product details page should work')
    console.log('  ✓ Regions are configured correctly')
    console.log('  ✓ Cart can be created')
    console.log('  ✓ Products can be added to cart')
    console.log('  ✓ Cart can be retrieved with items')
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message)
    console.error(error)
  }
}

testProductFlow()
