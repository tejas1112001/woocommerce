# Fix: Publishable API Key Required Error

## Problem
When creating an account, you're getting the error:
```
Publishable API key required in the request header: x-publishable-api-key
```

## Root Cause
The Next.js frontend server is running with stale environment variables or the Medusa SDK is not properly initialized with the publishable key from `.env.local`.

## Solution

### Step 1: Restart the Frontend Server
The environment variables are loaded when Next.js starts. Any changes to `.env.local` require a server restart.

**Run this command:**
```powershell
.\restart-frontend.ps1
```

This script will:
1. Stop the current Next.js server on port 8000
2. Verify the publishable key is in `.env.local`
3. Start the server with fresh environment variables

### Step 2: Verify the Fix
After restarting, try creating an account again. You should no longer see the publishable key error.

### Step 3: Test API Headers (Optional)
If the error persists, run this diagnostic script:
```powershell
.\test-api-headers.ps1
```

This will test if the publishable key is being sent correctly to the backend.

## What Was Changed

### 1. Enhanced SDK Configuration (`solace-medusa-starter/src/lib/config.ts`)
Added logging to help debug publishable key issues:
```typescript
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

if (process.env.NODE_ENV === 'development') {
  console.log('Medusa SDK Configuration:')
  console.log('- Backend URL:', MEDUSA_BACKEND_URL)
  console.log('- Publishable Key:', PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 20)}...` : 'NOT SET')
}
```

Now when you start the dev server, you'll see the configuration in the console.

### 2. Created Helper Scripts

- **`restart-frontend.ps1`**: Stops and restarts the Next.js server with fresh environment
- **`test-api-headers.ps1`**: Tests if the publishable key is being sent correctly
- **`test-sdk-config.js`**: Verifies environment variables are loaded

## Environment Configuration

Your `.env.local` already has the correct configuration:
```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_1f43375a1a1b6a3ee767903198b3c5ae252965fa3937b1ea88de7f55d002fea9
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

## How It Works

The Medusa JS SDK automatically adds the `x-publishable-api-key` header to all API requests when initialized with a publishable key:

```typescript
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: PUBLISHABLE_KEY, // This gets added as a header
})
```

## Troubleshooting

### If the error still appears after restart:

1. **Check the browser console** for the SDK configuration log:
   ```
   Medusa SDK Configuration:
   - Backend URL: http://localhost:9000
   - Publishable Key: pk_1f43375a1a1b6a3e...
   ```

2. **Verify the backend is running**:
   ```powershell
   curl http://localhost:9000/health
   ```

3. **Check the Network tab** in browser DevTools:
   - Look for the `/auth/customer/emailpass/register` request
   - Check if `x-publishable-api-key` header is present

4. **Clear browser cache and hard reload** (Ctrl + Shift + R)

## Next Steps

After restarting the server:
1. Go to http://localhost:8000/account
2. Click "Create Account"
3. Fill in the registration form
4. Submit

The publishable key error should be gone! ✅
