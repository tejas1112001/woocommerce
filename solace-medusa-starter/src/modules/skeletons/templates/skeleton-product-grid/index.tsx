import repeat from '@lib/util/repeat'
import SkeletonProductPreview from '@modules/skeletons/components/skeleton-product-preview'

const SkeletonProductGrid = () => {
  return (
    <ul
      className="grid w-full grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      data-testid="products-list"
    >
      {repeat(8).map((index) => (
        <li key={index} className="flex flex-col h-full">
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
