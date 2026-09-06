import { ReadonlyURLSearchParams } from 'next/navigation'

export const DEFAULT_REGION = (process.env.NEXT_PUBLIC_DEFAULT_REGION || 'in').toLowerCase()

export const getLocalizedPath = (path: string = '', countryCode?: string) => {
  const code = (countryCode || DEFAULT_REGION).toLowerCase()
  
  // Normalize path
  let cleanPath = path
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }

  // If path already starts with the country code (e.g. /in/shop), strip it
  if (cleanPath === `/${code}` || cleanPath.startsWith(`/${code}/`)) {
    cleanPath = cleanPath.slice(code.length + 1)
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`
    }
  }

  // Always return path with country code prefix
  // This is required because Next.js routing requires [countryCode] parameter
  return `/${code}${cleanPath === '/' ? '' : cleanPath}`
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
  id?: string
) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`
  return `${pathname}${queryString}${id ?? ''}`
}

