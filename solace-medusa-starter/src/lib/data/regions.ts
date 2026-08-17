import { cache } from 'react'

import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import { HttpTypes } from '@medusajs/types'

export const listRegions = cache(async function () {
  console.log('[DEBUG regions.ts] listRegions CALLED')
  return sdk.store.region
    .list({}, { next: { tags: ['regions'] } })
    .then(({ regions }) => {
      console.log('[DEBUG regions.ts] listRegions SUCCESS, count:', regions?.length)
      return regions
    })
    .catch((err) => {
      console.error('[DEBUG regions.ts] listRegions FAILED:', err.message)
      return medusaError(err)
    })
})

export const retrieveRegion = cache(async function (id: string) {
  return sdk.store.region
    .retrieve(id, {}, { next: { tags: ['regions'] } })
    .then(({ region }) => region)
    .catch(medusaError)
})

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = cache(async function (countryCode: string) {
  console.log('[DEBUG regions.ts] getRegion CALLED with countryCode:', countryCode)
  try {
    const normalizedCountryCode = countryCode?.toLowerCase() || 'us'
    console.log('[DEBUG regions.ts] getRegion normalized:', normalizedCountryCode)

    if (regionMap.has(normalizedCountryCode)) {
      console.log('[DEBUG regions.ts] getRegion CACHE HIT for:', normalizedCountryCode)
      return regionMap.get(normalizedCountryCode)
    }

    console.log('[DEBUG regions.ts] getRegion CACHE MISS, listing regions...')
    const regions = await listRegions()

    if (!regions || !regions.length) {
      console.log('[DEBUG regions.ts] getRegion: listRegions returned null/undefined or empty')
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        const iso = c?.iso_2?.toLowerCase() ?? ''
        if (iso) {
          regionMap.set(iso, region)
        }
      })
    })

    const res =
      regionMap.get(normalizedCountryCode) ??
      regionMap.get('us') ??
      regionMap.get('in') ??
      regionMap.values().next().value ??
      regions[0] ??
      null

    console.log('[DEBUG regions.ts] getRegion returning:', res ? res.id : 'null')
    return res
  } catch (e: any) {
    console.error('[DEBUG regions.ts] getRegion ERROR:', e.message, e.stack)
    return null
  }
})
