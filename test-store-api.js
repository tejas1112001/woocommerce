const PUBLISHABLE_KEY = 'pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf'
const BACKEND_URL = 'http://localhost:9000'

async function test() {
  try {
    // 1. List regions to check region ID
    const regionsRes = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { regions } = await regionsRes.json()
    console.log('REGIONS:', regions.map(r => ({ id: r.id, name: r.name, currency_code: r.currency_code })))

    // 2. Fetch products list
    const productsRes = await fetch(`${BACKEND_URL}/store/products`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const { products } = await productsRes.json()
    console.log('ALL PRODUCTS IN STORE:', products.map(p => ({ id: p.id, title: p.title, handle: p.handle })))

    // 3. Fetch product t-shirt specifically
    const handleRes = await fetch(`${BACKEND_URL}/store/products?handle=t-shirt`, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    })
    const handleData = await handleRes.json()
    console.log('T-SHIRT HANDLE DIRECT FETCH:', handleData.products)

    // 4. Fetch product t-shirt with region_id filter
    if (regions.length > 0) {
      const regionId = regions[0].id
      console.log(`\nFetching with region_id=${regionId}`)
      const regRes = await fetch(`${BACKEND_URL}/store/products?handle=t-shirt&region_id=${regionId}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
      })
      const regData = await regRes.json()
      console.log('T-SHIRT WITH REGION FETCH:', regData.products)
    }

  } catch (e) {
    console.error(e)
  }
}

test()
