const PUBLISHABLE_KEY = 'pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf'
const BACKEND_URL = 'http://localhost:9000'

async function testRegions() {
  console.log('🧪 Testing Regions Endpoint\n')
  
  try {
    console.log('Testing /store/regions endpoint...')
    console.log('URL:', `${BACKEND_URL}/store/regions`)
    console.log('API Key:', PUBLISHABLE_KEY)
    
    const response = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { 
        'x-publishable-api-key': PUBLISHABLE_KEY 
      }
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log('Response body:', text)
    
    if (response.ok) {
      const data = JSON.parse(text)
      console.log('Parsed data:', JSON.stringify(data, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  }
}

testRegions()
