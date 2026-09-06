'use client'

import {
  useMemo,
  useState,
  useTransition,
} from 'react'
import { useSearchParams } from 'next/navigation'

import { passwordRequirements } from '@lib/constants'
import { resetPassword } from '@lib/data/customer'
import { cn } from '@lib/util/cn'
import { validatePassword, ValidationError } from '@lib/util/validator'
import { SubmitButton } from '@modules/checkout/components/submit-button'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Input } from '@modules/common/components/input'
import { Label } from '@modules/common/components/label'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
import { toast } from '@modules/common/components/toast'
import { CheckCircleIcon, XCircleIcon } from '@modules/common/icons'

export function ResetPassword() {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  const token = useMemo(() => {
    return searchParams?.get('token') || ''
  }, [searchParams])

  const email = useMemo(() => {
    return searchParams?.get('email') || ''
  }, [searchParams])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const errors: ValidationError[] = []

    const newPassword = formData.get('new_password') as string
    const confirmedPassword = formData.get('confirmed_password') as string

    if (!newPassword) {
      errors.push({ field: 'new_password', message: 'Please enter new password' })
    }

    if (!confirmedPassword) {
      errors.push({ field: 'confirmed_password', message: 'Please confirm new password' })
    }

    const isPasswordValid = validatePassword(newPassword)
    if (isPasswordValid.length > 0) {
      isPasswordValid.forEach((requirement) => {
        errors.push({
          field: 'new_password',
          message: requirement,
        })
      })
    }

    if (newPassword && confirmedPassword && newPassword !== confirmedPassword) {
      errors.push({
        field: 'confirmed_password',
        message: 'Passwords don’t match. Please enter correct password.',
      })
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setServerError(null)

    formData.append('email', email)
    formData.append('token', token)

    startTransition(async () => {
      const res = await resetPassword(null, formData)
      if (res && typeof res === 'string') {
        setServerError(res)
        toast('error', res)
      } else {
        // Password successfully updated in authentication system!
        setPasswordChanged(true)
        toast('success', 'Your password has been reset successfully!')
      }
    })
  }

  return (
    <Box
      className={cn('flex w-full flex-col gap-6', {
        'max-w-[438px]': passwordChanged,
        'bg-primary p-5 small:p-4 rounded-2xl border border-gray-100 shadow-sm': !passwordChanged,
      })}
    >
      {passwordChanged ? (
        <>
          <CheckCircleIcon className="mx-auto h-14 w-14 text-emerald-500" />
          <Box className="text-center space-y-2">
            <Heading className="text-xl small:text-2xl font-bold text-gray-900">
              Password changed
            </Heading>
            <Text className="text-gray-600 text-sm" size="md">
              Your password has been updated in our authentication system. You are ready to log in with your new password.
            </Text>
          </Box>
          <Button size="sm" asChild className="w-full mt-2">
            <LocalizedClientLink href="/account?mode=sign-in">
              Log in with New Password →
            </LocalizedClientLink>
          </Button>
        </>
      ) : (
        <>
          <Box>
            <Heading className="mb-2 text-xl small:text-2xl font-bold text-gray-900">
              Set new password
            </Heading>
            <Text className="text-gray-600 text-sm" size="md">
              Almost done. Enter your new password and you&apos;re good to go.
            </Text>
          </Box>

          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 font-medium">
              {serverError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              name="new_password"
              required
              type="password"
              autoComplete="new-password"
              error={
                validationErrors.find((error) => error.field === 'new_password')
                  ?.message
              }
            />
            <Box className="flex flex-col gap-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
              {passwordRequirements.map((item, id) => {
                const isValid = !validationErrors.some(
                  (error) => error.message === item
                )

                return (
                  <Box
                    key={id}
                    className={cn('flex items-center gap-2 text-xs text-gray-600', {
                      'text-red-600 font-semibold': !isValid,
                    })}
                  >
                    {isValid ? (
                      <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    <Label
                      size="sm"
                      className={cn({ 'text-red-600': !isValid })}
                    >
                      {item}
                    </Label>
                  </Box>
                )
              })}
            </Box>
            <Input
              label="Confirm new password"
              name="confirmed_password"
              required
              type="password"
              autoComplete="confirmed-password"
              error={
                validationErrors.find(
                  (error) => error.field === 'confirmed_password'
                )?.message
              }
            />
            <SubmitButton
              className="mt-6 w-full"
              data-testid="register-button"
              isLoading={isPending}
            >
              Set new password
            </SubmitButton>
          </form>
        </>
      )}
    </Box>
  )
}
