import { Suspense } from 'react'
import { Spinner } from '@modules/common/icons'
import LoginTemplate from '@modules/account/templates/login-template'

export default function DefaultLogin() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner size={36} />
        </div>
      }
    >
      <LoginTemplate />
    </Suspense>
  )
}
