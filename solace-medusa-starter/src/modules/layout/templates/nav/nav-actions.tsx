import { Box } from '@modules/common/components/box'
import CartButton from '@modules/layout/components/cart-button'
import ProfileButton from '@modules/layout/components/profile-button'

export default function NavActions() {
  return (
    // h-[88px] matches NavContent so all header icons sit on the same baseline
    <Box className="flex h-[88px] shrink-0 items-center gap-1">
      <ProfileButton />
      <CartButton />
    </Box>
  )
}
