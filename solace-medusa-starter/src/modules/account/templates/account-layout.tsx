import React from 'react'

import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'

import AccountNav from '../components/account-nav'
import AccountMobileNav from '../components/account-nav/account-mobile-nav'

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <Box className="flex justify-center bg-secondary">
        <Container className="w-full !max-w-[660px] !pb-16 !pt-8">
          <div className="flex items-center justify-center">{children}</div>
        </Container>
      </Box>
    )
  }

  return (
    <Box className="bg-secondary print:bg-white print:p-0 print:m-0">
      <div className="print:hidden">
        <AccountMobileNav />
      </div>
      <Container className="print:p-0 print:m-0 print:max-w-none">
        <Box className="gap grid grid-cols-12 gap-6 print:block print:w-full">
          <Box className="hidden xl:col-span-3 xl:block print:hidden">
            <AccountNav />
          </Box>
          <div className="col-span-12 xl:col-span-9 print:w-full print:col-span-12">{children}</div>
        </Box>
      </Container>
    </Box>
  )
}

export default AccountLayout
