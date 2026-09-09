import { redirect } from 'next/navigation'
import { getLocalizedPath } from '@lib/util/urls'

export default async function AccountResetPasswordPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const { countryCode } = params
  const query = new URLSearchParams()
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        query.set(key, value)
      } else if (Array.isArray(value) && value[0]) {
        query.set(key, value[0])
      }
    })
  }

  const queryString = query.toString()
  const targetPath = `/reset-password${queryString ? `?${queryString}` : ''}`
  redirect(getLocalizedPath(targetPath, countryCode))
}
