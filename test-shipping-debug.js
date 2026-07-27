const PUBLISHABLE_KEY = 'pk_5f0d388535f5278b3bc940ed10446ad41d7d33ae756abc58a94c9d19d75939db'
const BACKEND_URL = 'http://localhost:9000'

async function debugShipping() {
  console.log('🔍 Debugging Shipping Options Issue\n')
  console.log('='.repeat(60))
  
  try {
    // Create cart
    console.log('\n1️⃣  Creating cart with India region...')
    const cartRes = await fetch(`${BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ region_id: 'reg_01KT38FWJSGY83D449PRADX2AN' })
    })
    const { cart } = await cartRes.json()
    console.log(`✓ Cart created: ${cart.id}`)
    console.log(`  Region: ${cart.region_id}`)
    
    // Add item
    console.log('\n2️⃣  Adding product to cart...')
    const addRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variant_id: 'variant_01KWPQ2XB6S31965BRTY1NWFJJ',
        quantity: 1
      })
    })
    const { cart: cartWithItem } = await addRes.json()
    console.log(`✓ Product added`)
    console.log(`  Items: ${cartWithItem.items.length}`)
    
    // Set address
    console.log('\n3️⃣  Setting shipping address...')
    const addrRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}`, {
      method: 'POST',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shipping_address: {
          first_name: 'Test',
          last_name: 'User',
          address_1: '123 Test St',
          city: 'Pune',
          postal_code: '411001',
          country_code: 'in',
          phone: '+919876543210'
        }
      })
    })
    const { cart: cartWithAddr } = await addrRes.json()
    console.log(`✓ Address set`)
    console.log(`  Country: ${cartWithAddr.shipping_address.country_code}`)
    console.log(`  City: ${cartWithAddr.shipping_address.city}`)
    
    // Try to get shipping options
    console.log('\n4️⃣  Fetching shipping options...')
    const shipRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cart.id}`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    
    if (!shipRes.ok) {
      const error = await shipRes.json()
      console.log(`❌ Error: ${error.message}`)
      console.log(JSON.stringify(error, null, 2))
    } else {
      const { shipping_options } = await shipRes.json()
      console.log(`Result: ${shipping_options.length} shipping options`)
      
      if (shipping_options.length === 0) {
        console.log('\n⚠️  NO SHIPPING OPTIONS FOUND!')
        console.log('\nPossible causes:')
        console.log('  1. Shipping option service zone doesn\'t cover the shipping address')
        console.log('  2. Shipping option rules are filtering it out')
        console.log('  3. Stock location is not linked to fulfillment set')
        console.log('  4. Fulfillment provider is not configured')
      } else {
        shipping_options.forEach(opt => {
          console.log(`  ✓ ${opt.name}: ₹${(opt.amount / 100).toFixed(2)}`)
        })
      }
    }
    
    // Check cart fulfillment options through different endpoint
    console.log('\n5️⃣  Checking fulfillment/shipping-options...')
    try {
      const fulfillmentRes = await fetch(`${BACKEND_URL}/store/fulfillment/shipping-options?cart_id=${cart.id}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
      })
      
      if (fulfillmentRes.ok) {
        const fulfillmentData = await fulfillmentRes.json()
        console.log(`Fulfillment options: ${fulfillmentData.shipping_options?.length || 0}`)
      } else {
        console.log(`Fulfillment endpoint returned: ${fulfillmentRes.status}`)
      }
    } catch (err) {
      console.log(`Fulfillment endpoint error: ${err.message}`)
    }
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message)
    console.error(error)
  }
}

debugShipping()
