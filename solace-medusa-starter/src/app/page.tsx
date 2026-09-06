import { redirect } from 'next/navigation'

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'in'

export default function RootPage() {
  // Redirect to the default region's home page
  redirect(`/${DEFAULT_REGION}`)
}
