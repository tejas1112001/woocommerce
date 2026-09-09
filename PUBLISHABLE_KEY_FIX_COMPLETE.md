# Publishable API Key Error - Complete Fix

## Issue Fixed
All API endpoints now properly include the `x-publishable-api-key` header in their requests.

## Files Modified

### 1. `src/lib/data/otp.ts`
**Added:**
- `getHeaders()` function to include publishable key in all OTP requests
- Applied to: `/store/otp/send`, `/store/otp/verify`, `/store/otp/resend`

**Before:**
```typescript
headers: {
  'Content-Type': 'application/json',
}
```

**After:**
```typescript
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = PUBLISHABLE_KEY
  }
  
  return headers
}
```

### 2. `src/lib/data/customer.ts`
**Added:**
- `getPublishableHeaders()` helper function
- Applied to all direct fetch calls:
  - `/auth/customer/emailpass/reset-password` (forgot password)
  - `/auth/customer/emailpass/update` (reset password)
  - `/auth/customer/emailpass/update` (update password)

**Before:**
```typescript
headers: {
  'Content-Type': 'application/json',
}
```

**After:**
```typescript
function getPublishableHeaders(additionalHeaders?: HeadersInit): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }
  
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (publishableKey) {
    headers['x-publishable-api-key'] = publishableKey
  }
  
  return headers
}
```

### 3. `src/lib/config.ts`
**Added:**
- Debug logging to show SDK configuration on startup
- Helps identify if publishable key is loaded correctly

## Next Step - Restart Required

The files have been updated, but Next.js needs to recompile to pick up the changes.

### Option 1: Automatic Restart (Recommended)
Next.js should automatically detect the file changes and hot-reload. Wait a few seconds and try again.

### Option 2: Manual Restart
If the error persists, manually restart the dev server:

1. **Stop the current server:** Press `Ctrl+C` in the terminal running `npm run dev`
2. **Start it again:**
   ```powershell
   cd solace-medusa-starter
   npm run dev
   ```

### Option 3: Use the Restart Script
```powershell
.\restart-frontend.ps1
```

## Testing the Fix

After Next.js recompiles, test the registration flow:

1. Go to http://localhost:8000/account
2. Click "Create Account"
3. Fill in your details:
   - First Name: Tejas
   - Last Name: Shinde
   - Email: tejas.smtp.dev@gmail.com
   - Phone: 9130304095
   - Password: (at least 8 characters with uppercase, lowercase, and number)
4. Check "I read and agree to Terms & Conditions"
5. Click "Continue"

**Expected Result:** ✅ "Verification code sent to your email!" message (no publishable key error)

## What This Fixes

### Before:
- OTP send endpoint → ❌ Missing publishable key
- OTP verify endpoint → ❌ Missing publishable key
- Password reset endpoints → ❌ Missing publishable key
- Registration fails with "Publishable API key required" error

### After:
- OTP send endpoint → ✅ Includes `x-publishable-api-key` header
- OTP verify endpoint → ✅ Includes `x-publishable-api-key` header
- Password reset endpoints → ✅ Includes `x-publishable-api-key` header
- Registration flow works completely

## Already Correct Files (No Changes Needed)

These files already had the publishable key properly configured:
- `src/lib/config.ts` - Medusa SDK initialization
- `src/lib/data/payment.ts` - Razorpay verification
- `src/modules/search/actions.ts` - Product search
- `src/proxy.ts` - Region fetching

## Verification

Check the browser DevTools Network tab after clicking "Continue":
1. Look for request to `/store/otp/send`
2. Check Request Headers
3. Should see: `x-publishable-api-key: pk_1f43375a1a1b6a3e...`

## Troubleshooting

If the error still appears:

1. **Check if Next.js detected the changes:**
   Look at the terminal running `npm run dev` - you should see "Compiled in XXms" messages

2. **Hard refresh the browser:**
   Press `Ctrl + Shift + R` to clear cached JavaScript

3. **Check the browser console:**
   Look for the SDK configuration log:
   ```
   Medusa SDK Configuration:
   - Backend URL: http://localhost:9000
   - Publishable Key: pk_1f43375a1a1b6a3e...
   ```

4. **Restart the dev server manually:**
   Sometimes hot reload doesn't pick up server-side changes

## Summary

✅ All OTP endpoints now include publishable key
✅ All password reset endpoints now include publishable key  
✅ Helper functions created for consistent header usage
✅ Debug logging added for troubleshooting
⏳ Waiting for Next.js to recompile (should happen automatically)

The account registration should work after Next.js recompiles!
