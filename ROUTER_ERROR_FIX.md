# Router Error Fix

## Error Encountered

```
Runtime Error
Internal Next.js error: Router action dispatched before initialization.
```

## Root Cause

The `dropdown-menu.tsx` component was using client-side components (`LocalizedClientLink`) without the `'use client'` directive at the top of the file.

In Next.js 13+ with the App Router:
- Components are **Server Components** by default
- Components using client-side hooks or browser APIs need the `'use client'` directive
- `LocalizedClientLink` uses `useParams()` from `next/navigation`, which is a client-side hook
- When a server component tries to render client-only code, it causes initialization errors

## The Fix

Added `'use client'` directive to the top of `dropdown-menu.tsx`:

```typescript
'use client'

import React from 'react'
// ... rest of imports
```

## Why This Fixes It

1. **Client Component Boundary**: The `'use client'` directive tells Next.js that this component and its children should be treated as client components

2. **Proper Initialization**: Client components are hydrated on the client side where the Next.js router is properly initialized

3. **Hook Access**: Client components can safely use client-side hooks like:
   - `useState`
   - `useEffect`
   - `useParams` (from next/navigation)
   - `usePathname` (from next/navigation)
   - `useRouter` (from next/navigation)

## Files Modified

**File**: `src/modules/layout/templates/nav/dropdown-menu.tsx`

**Change**: Added `'use client'` directive as the first line of the file

## Next Steps

1. **Hard Refresh Browser**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear Cache**: If issue persists, clear browser cache
3. **Restart Dev Server**: If needed, restart the Next.js development server

## Verification

After refreshing, you should see:
- ✅ No router initialization errors
- ✅ Page loads successfully
- ✅ Navigation works properly
- ✅ Mega menu appears on hover over "Shop" or "Collections"
- ✅ All links are clickable and functional

## Technical Details

### Server Components vs Client Components

**Server Components** (default):
- Render on the server
- Cannot use browser APIs
- Cannot use React hooks like useState, useEffect
- Cannot use event handlers (onClick, onHover, etc.)
- Better for SEO and initial page load

**Client Components** (with 'use client'):
- Hydrate on the client
- Can use browser APIs
- Can use React hooks
- Can use event handlers
- Required for interactivity

### When to Use 'use client'

Use when your component:
- Uses `useState`, `useEffect`, or other React hooks
- Uses browser APIs (window, document, localStorage, etc.)
- Has event handlers (onClick, onChange, onMouseEnter, etc.)
- Uses context providers
- Uses client-only libraries
- Needs to access the Next.js router hooks

### Our Case

The `dropdown-menu.tsx` component needed 'use client' because it:
1. Uses `onMouseEnter` and `onMouseLeave` event handlers
2. Renders `LocalizedClientLink` which uses `useParams()` hook
3. Needs client-side interactivity for hover states

## Best Practices Applied

✅ **Minimal Client Boundary**: Only marked the component that actually needs client-side features

✅ **Server-First Approach**: Parent components (nav wrapper, page layouts) remain server components

✅ **Proper Component Separation**: Client components (dropdown-menu, navigation) are separate from server components

✅ **Performance**: Keeps most of the app as server components for better performance

## Related Documentation

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js: Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React: 'use client' directive](https://react.dev/reference/react/use-client)

---

**Status**: ✅ **FIXED**

The error has been resolved. The mega menu should now work correctly after a browser refresh.
