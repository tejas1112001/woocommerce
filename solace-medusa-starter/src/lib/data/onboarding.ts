'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function resetOnboardingState(orderId: string) {
  ;(await cookies()).set('_medusa_onboarding', 'false', { maxAge: -1 })
  const adminUrl =
    process.env.MEDUSA_ADMIN_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    'http://localhost:9000'
  redirect(`${adminUrl}/app/orders/${orderId}`)
}
