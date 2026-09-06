import { Spinner } from '@modules/common/icons'

export default function CheckoutLoading() {
  return (
    <div className="relative w-full small:min-h-screen bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center py-20">
        <Spinner size={40} />
        <p className="text-sm text-secondary">Loading checkout...</p>
      </div>
    </div>
  )
}
