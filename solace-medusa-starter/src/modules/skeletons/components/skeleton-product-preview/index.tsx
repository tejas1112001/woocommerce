const SkeletonProductPreview = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white animate-pulse">
      <div className="relative aspect-square w-full bg-skeleton-primary" />
      <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 gap-2">
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-4/5 rounded bg-skeleton-primary" />
          <div className="h-4 w-2/5 rounded bg-skeleton-primary" />
        </div>
        <div className="mt-auto pt-1">
          <div className="h-[36px] w-full rounded-lg bg-skeleton-secondary" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
