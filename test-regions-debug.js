const PUBLISHABLE_KEY = 'pk_1f43375a1a1b6a3ee767903198b3c5ae252965fa3937b1ea88de7f55d002fea9'
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
