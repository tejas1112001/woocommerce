'use client'

import React, { useActionState, useEffect, useState } from 'react'

import { updateCustomerPassword } from '@lib/data/customer'
import { HttpTypes } from '@medusajs/types'
import { SubmitButton } from '@modules/checkout/components/submit-button'
import { Button } from '@modules/common/components/button'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@modules/common/components/dialog'
import { Input } from '@modules/common/components/input'
import { Text } from '@modules/common/components/text'
import { toast } from '@modules/common/components/toast'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

type ProfilePasswordProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<ProfilePasswordProps> = ({ customer }) => {
  const [open, setOpen] = useState(false)

  const [formState, formAction] = useActionState(updateCustomerPassword, {
    success: false,
    error: null,
  })

  useEffect(() => {
    if (formState.success) {
      toast('success', 'Password updated successfully.')
      setOpen(false)
    }
  }, [formState.success])

  useEffect(() => {
    if (formState.error) {
      toast('error', formState.error)
    }
  }, [formState.error])

  return (
    <div className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 small:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
        <div>
          <p className="text-lg font-bold text-neutral-900 dark:text-white">Security &amp; Password</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Keep your account secure with a strong password
          </p>
        </div>
        <Button
          variant="tonal"
          size="sm"
          onClick={() => setOpen(true)}
          data-testid="change-password-button"
        >
          Change password
        </Button>
      </div>
      <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <Text className="text-xs text-neutral-500 dark:text-neutral-400">
          Password status:
        </Text>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
          Protected &bull; &bull; &bull; &bull; &bull; &bull; &bull; &bull;
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            className="max-h-fit max-w-[650px] !rounded-none border border-action-primary"
            aria-describedby={undefined}
          >
            <form action={formAction} className="flex h-full flex-col">
              {/* Hidden email field needed for re-auth */}
              <input type="hidden" name="email" value={customer.email} />

              <DialogHeader className="flex items-center text-xl medium:p-6 medium:text-2xl">
                Change password
                <DialogClose className="right-4" />
              </DialogHeader>
              <VisuallyHidden.Root>
                <DialogTitle>Change password modal</DialogTitle>
              </VisuallyHidden.Root>

              <DialogBody className="overflow-y-auto p-5">
                <div className="flex flex-col gap-4">
                  <Input
                    label="Current password"
                    name="old_password"
                    type="password"
                    required
                    autoComplete="current-password"
                    data-testid="old-password-input"
                  />
                  <Input
                    label="New password"
                    name="new_password"
                    type="password"
                    required
                    autoComplete="new-password"
                    data-testid="new-password-input"
                  />
                  <Input
                    label="Confirm new password"
                    name="confirm_password"
                    type="password"
                    required
                    autoComplete="new-password"
                    data-testid="confirm-password-input"
                  />
                  {formState.error && (
                    <p className="text-sm text-negative">{formState.error}</p>
                  )}
                </div>
              </DialogBody>

              <DialogFooter className="mt-auto">
                <SubmitButton
                  data-testid="save-password-button"
                  className="w-full"
                >
                  Update password
                </SubmitButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}

export default ProfilePassword
