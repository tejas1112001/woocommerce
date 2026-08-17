import { NextRequest, NextResponse } from 'next/server'
import type { HttpTypes } from '@medusajs/types'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'us'

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
        console.error(
          '[Proxy] Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'
        )
        return regionMapCache.regionMap
      }

      console.log('[Proxy] Fetching regions from backend...')

      // Use raw fetch with timeout instead of SDK to avoid middleware blocking
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Region fetch failed: ${response.status}`)
      }

      const data = await response.json()
      const regions = data.regions

      console.log(`[Proxy] Fetched ${regions?.length || 0} regions`)

      if (!regions?.length) {
        console.error('[Proxy] No regions configured in Medusa backend')
        return regionMapCache.regionMap
      }

      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? '', region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
      console.log('[Proxy] Region map cached successfully')
    } catch (error: any) {
      console.error('[Proxy] Error fetching regions:', error.message || error)
      // Return empty map, let the app use default region
      return regionMapCache.regionMap
    }
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get('x-vercel-ip-country')
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split('/')[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    } else {
      countryCode = DEFAULT_REGION
    }

    return countryCode
  } catch (error) {
    return DEFAULT_REGION
  }
}

/**
 * Proxy to handle region selection and onboarding status.
 *
 * AUTHENTICATED CHECKOUT GUARD:
 * The checkout route (/[countryCode]/checkout) is protected — only authenticated
 * customers (those with a valid _medusa_jwt cookie) may access it.
 * Unauthenticated visitors are redirected to the account/login page with a
 * `redirectTo` query param so they are sent back to checkout after signing in.
 */
export async function proxy(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get('onboarding') === 'true'
  const cartId = searchParams.get('cart_id')
  const checkoutStep = searchParams.get('step')
  const onboardingCookie = request.cookies.get('_medusa_onboarding')
  const cartIdCookie = request.cookies.get('_medusa_cart_id')

  // ── Authenticated Checkout Guard ──────────────────────────────────────────
  // Check if the request targets the checkout route (any country-prefixed path).
  // Matches: /in/checkout, /us/checkout, /in/checkout?step=delivery, etc.
  const checkoutPathRegex = /^\/[a-z]{2}\/checkout(\/|$|\?)/
  const isCheckoutRoute =
    checkoutPathRegex.test(request.nextUrl.pathname) ||
    request.nextUrl.pathname.endsWith('/checkout')

  if (isCheckoutRoute) {
    // Guests have no _medusa_jwt cookie — redirect them to the login page.
    const authToken = request.cookies.get('_medusa_jwt')?.value

    if (!authToken) {
      // Preserve the full checkout URL (including ?step=…) so we can redirect
      // back after successful authentication.
      const checkoutPath =
        request.nextUrl.pathname + request.nextUrl.search

      // Derive the country-code prefix from the URL so the login URL stays
      // within the same region (e.g. /in/account?redirectTo=…).
      const countryPrefix = request.nextUrl.pathname.split('/')[1] || ''
      const loginUrl = new URL(
        `/${countryPrefix}/account`,
        request.nextUrl.origin
      )
      loginUrl.searchParams.set('redirectTo', checkoutPath)

      return NextResponse.redirect(loginUrl, 307)
    }
  }
  // ── End Checkout Guard ────────────────────────────────────────────────────

  const regionMap = await getRegionMap()

  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split('/')[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (
    urlHasCountryCode &&
    (!isOnboarding || onboardingCookie) &&
    (!cartId || cartIdCookie)
  ) {
    return NextResponse.next()
  }

  const firstSegment = request.nextUrl.pathname.split('/')[1]
  const isTwoLetterCode = /^[a-zA-Z]{2}$/.test(firstSegment ?? '')

  let cleanedPath = request.nextUrl.pathname
  if (isTwoLetterCode && !urlHasCountryCode) {
    cleanedPath = request.nextUrl.pathname.replace(`/${firstSegment}`, '')
  }

  const redirectPath =
    cleanedPath === '/' || cleanedPath === '' ? '' : cleanedPath

  const queryString = request.nextUrl.search ? request.nextUrl.search : ''

  let response = NextResponse.next()
  let redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    if (redirectUrl !== request.nextUrl.href) {
      response = NextResponse.redirect(redirectUrl, 307)
    }
  }

  // If a cart_id is in the params, we set it as a cookie and redirect to the address step.
  if (cartId && !checkoutStep) {
    const separator = redirectUrl.includes('?') ? '&' : '?'
    redirectUrl = `${redirectUrl}${separator}step=address`
    response = NextResponse.redirect(redirectUrl, 307)
    response.cookies.set('_medusa_cart_id', cartId, { maxAge: 60 * 60 * 24 })
  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set('_medusa_onboarding', 'true', {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)'],
}
