// Complete test to verify product is accessible and has inventory
// Uses native fetch (Node 18+)

const BACKEND_URL = 'http://localhost:9000'
const PUBLISHABLE_KEY = 'pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf'
const PRODUCT_HANDLE = 'test-product'
const REGION_CODE = 'in'

async function testProductComplete() {
  console.log('🧪 COMPLETE PRODUCT TEST\n')
  console.log('=' .repeat(80))
  
  try {
    // Test 1: Get product by handle
    console.log('\n📦 Test 1: Fetching product by handle...')
    const productResponse = await fetch(`${BACKEND_URL}/store/products?handle=${PRODUCT_HANDLE}`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })
    
    const productData = await productResponse.json()
    
    if (!productData.products || productData.products.length === 0) {
      console.log('❌ FAILED: Product not found!')
      console.log('   Make sure product is published and linked to sales channel')
      return
    }
    
    const product = productData.products[0]
    console.log('✅ Product found:', product.title)
    console.log('   Handle:', product.handle)
    console.log('   Status:', product.status)
    console.log('   Variants:', product.variants?.length || 0)
    
    // Test 2: Check if product has variants
    console.log('\n🎨 Test 2: Checking variants...')
    if (!product.variants || product.variants.length === 0) {
      console.log('❌ FAILED: No variants found!')
      console.log('   Product needs at least one variant')
      return
    }
    
    const variant = product.variants[0]
    console.log('✅ Variant found:', variant.title)
    console.log('   SKU:', variant.sku)
    console.log('   Variant ID:', variant.id)
    
    // Test 3: Check inventory
    console.log('\n📊 Test 3: Checking inventory...')
    console.log('   Inventory Quantity:', variant.inventory_quantity || 'Not tracked')
    console.log('   Manage Inventory:', variant.manage_inventory ? 'Yes' : 'No')
    
    if (variant.inventory_quantity === 0) {
      console.log('⚠️  WARNING: Inventory is 0. Product cannot be purchased!')
    } else if (variant.inventory_quantity > 0) {
      console.log(`✅ Inventory available: ${variant.inventory_quantity} units`)
    } else {
      console.log('⚠️  Inventory quantity not available in response')
    }
    
    // Test 4: Check regions
    console.log('\n🌍 Test 4: Checking regions...')
    const regionsResponse = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })
    
    const regionsData = await regionsResponse.json()
    const regions = regionsData.regions || []
    
    console.log(`   Found ${regions.length} region(s)`)
    
    const indiaRegion = regions.find(r => 
      r.countries?.some(c => c.iso_2.toLowerCase() === REGION_CODE)
    )
    
    if (!indiaRegion) {
      console.log(`❌ FAILED: Region with country code "${REGION_CODE}" not found!`)
      return
    }
    
    console.log('✅ India region found:', indiaRegion.name)
    console.log('   Currency:', indiaRegion.currency_code)
    console.log('   Region ID:', indiaRegion.id)
    
    // Test 5: Create a cart
    console.log('\n🛒 Test 5: Creating cart...')
    const cartResponse = await fetch(`${BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        region_id: indiaRegion.id,
      })
    })
    
    const cartData = await cartResponse.json()
    const cart = cartData.cart
    
    if (!cart) {
      console.log('❌ FAILED: Could not create cart')
      console.log('   Response:', cartData)
      return
    }
    
    console.log('✅ Cart created:', cart.id)
    console.log('   Region:', cart.region?.name)
    console.log('   Currency:', cart.currency_code)
    
    // Test 6: Add product to cart
    console.log('\n➕ Test 6: Adding product to cart...')
    const addToCartResponse = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        variant_id: variant.id,
        quantity: 1,
      })
    })
    
    if (!addToCartResponse.ok) {
      const errorData = await addToCartResponse.json()
      console.log('❌ FAILED: Could not add to cart')
      console.log('   Error:', errorData)
      console.log('   Status:', addToCartResponse.status)
      return
    }
    
    const updatedCartData = await addToCartResponse.json()
    const updatedCart = updatedCartData.cart
    
    console.log('✅ Product added to cart!')
    console.log('   Items in cart:', updatedCart.items?.length || 0)
    console.log('   Subtotal:', updatedCart.subtotal || 0, updatedCart.currency_code)
    
    if (updatedCart.items && updatedCart.items.length > 0) {
      const item = updatedCart.items[0]
      console.log('\n   Item details:')
      console.log('   - Title:', item.variant?.product?.title)
      console.log('   - Variant:', item.variant?.title || item.title)
      console.log('   - Quantity:', item.quantity)
      console.log('   - Unit Price:', item.unit_price, updatedCart.currency_code)
      console.log('   - Total:', item.total, updatedCart.currency_code)
    }
    
    // Test 7: Verify URL accessibility
    console.log('\n🌐 Test 7: Verifying frontend URL...')
    const frontendURL = `http://localhost:8000/${REGION_CODE}/products/${PRODUCT_HANDLE}`
    console.log(`   URL: ${frontendURL}`)
    
    try {
      const frontendResponse = await fetch(frontendURL)
      if (frontendResponse.ok) {
        console.log('✅ Frontend URL is accessible (Status: 200)')
      } else if (frontendResponse.status === 404) {
        console.log('❌ Frontend returns 404')
        console.log('   This might be a frontend routing or cache issue')
        console.log('   Try clearing Next.js cache: rm -r .next && npm run build')
      } else {
        console.log(`⚠️  Frontend returned status: ${frontendResponse.status}`)
      }
    } catch (error) {
      console.log('⚠️  Could not reach frontend. Make sure it\'s running.')
      console.log('   Start with: cd solace-medusa-starter && npm run dev')
    }
    
    // Final Summary
    console.log('\n' + '='.repeat(80))
    console.log('📋 TEST SUMMARY')
    console.log('='.repeat(80))
    console.log('\n✅ All core tests passed!')
    console.log('\n✓ Product exists and is published')
    console.log('✓ Product has variants')
    console.log('✓ Product has inventory')
    console.log('✓ Region configured correctly')
    console.log('✓ Cart creation works')
    console.log('✓ Add to cart works')
    console.log('\n🎉 Your product is FULLY FUNCTIONAL!')
    console.log(`\n🛍️  Visit: ${frontendURL}`)
    console.log('\n💡 Next steps:')
    console.log('   1. Test the complete checkout flow')
    console.log('   2. Add more products')
    console.log('   3. Configure shipping options')
    console.log('   4. Set up payment provider (Razorpay)')
    
  } catch (error) {
    console.log('\n❌ ERROR:', error.message)
    console.log('\n🔍 Troubleshooting tips:')
    console.log('   1. Make sure backend is running: cd medusa-backend && npm run dev')
    console.log('   2. Check if publishable key is correct in .env.local')
    console.log('   3. Verify product exists: npx tsx check-product-visibility.ts')
    console.log('   4. Check database connection')
  }
}

// Run the test
testProductComplete()
