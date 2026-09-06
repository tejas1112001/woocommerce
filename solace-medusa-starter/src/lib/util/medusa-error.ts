export default function medusaError(error: any): never {
  if (error.response) {
    try {
      const u = new URL(error.config?.url || '', error.config?.baseURL || 'http://localhost')
      console.error('Resource:', u.toString())
    } catch {}
    console.error('Response data:', error.response.data)
    console.error('Status code:', error.response.status)
    console.error('Headers:', error.response.headers)

    let message = ''
    const data = error.response.data

    if (typeof data === 'string') {
      message = data
    } else if (data && typeof data === 'object') {
      message = data.message || data.error || data.details || JSON.stringify(data)
    } else {
      message = String(data || 'An error occurred with Medusa request')
    }

    if (typeof message !== 'string') {
      message = String(message)
    }

    const formattedMessage = message.length > 0
      ? message.charAt(0).toUpperCase() + message.slice(1) + '.'
      : 'An error occurred during checkout.'

    throw new Error(formattedMessage)
  } else if (error.request) {
    throw new Error('No response received from server.')
  } else {
    throw new Error(error.message || 'Error setting up the request.')
  }
}

