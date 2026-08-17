'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import { useProductVariant } from '@lib/context/product-variant-context'
import { cn } from '@lib/util/cn'
import { HttpTypes } from '@medusajs/types'

import { LoadingImage } from '../product-tile/loading-image'
import { GalleryDialog } from './gallery-dialog'

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

export default function ImageGallery({
  images: productImages,
  title,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dialogIndex, setDialogIndex] = useState<number | null>(null)
  const { selectedVariant } = useProductVariant()

  // Switch to variant-specific image when available.
  const images = useMemo(() => {
    const thumbnail = selectedVariant?.thumbnail
    if (thumbnail) {
      const variantImg = {
        id: `variant-thumb-${selectedVariant!.id}`,
        url: thumbnail,
      } as HttpTypes.StoreProductImage
      const rest = productImages.filter((img) => img.url !== thumbnail)
      return [variantImg, ...rest]
    }
    return productImages
  }, [selectedVariant, productImages])

  // Reset selected image index to 0 whenever variant image changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [images])

  // Thumbnail Embla Carousel (active if > 4 images)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const currentImage = images[selectedIndex] || images[0]

  return (
    <div className="flex w-full flex-col">
      {/* ── 1. Main Product Image Area (Compact padding & balanced height) ──── */}
      <div className="relative h-[300px] sm:h-[360px] large:h-[400px] max-h-[400px] w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-2 sm:p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        {currentImage ? (
          <LoadingImage
            src={currentImage.url}
            alt={`${title} - Shree Swami Samarth Devotional Product`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
            className="h-full w-full cursor-pointer object-contain object-center transition-transform duration-300 hover:scale-[1.02]"
            loading="eager"
            onClick={() => setDialogIndex(selectedIndex)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* ── 2. Horizontal Thumbnails Row (Proportional full-width fit) ────── */}
      {images.length > 1 && (
        <div className="mt-3.5 sm:mt-4 w-full">
          {images.length <= 4 ? (
            /* 4 or fewer thumbnails: Responsive grid filling 100% of row width without empty right space */
            <div
              className={cn(
                'grid w-full gap-2.5 sm:gap-3.5',
                images.length === 2 && 'grid-cols-2 sm:grid-cols-4',
                images.length === 3 && 'grid-cols-3 sm:grid-cols-4',
                images.length === 4 && 'grid-cols-4'
              )}
            >
              {images.map((img, idx) => {
                const isActive = idx === selectedIndex
                return (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={cn(
                      'relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-200 focus:outline-none touch-manipulation cursor-pointer',
                      isActive
                        ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-xs scale-[1.02]'
                        : 'border-gray-200/90 opacity-70 hover:border-gray-400 hover:opacity-100'
                    )}
                  >
                    <LoadingImage
                      src={img.url}
                      alt={`${title} thumbnail ${idx + 1}`}
                      sizes="(max-width: 640px) 25vw, 100px"
                      className="h-full w-full object-contain object-center rounded-xl"
                      loading="lazy"
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            /* More than 4 thumbnails: Smooth scroll track with optional arrows */
            <div className="relative flex w-full items-center gap-2">
              {canScrollPrev && (
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous thumbnails"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-xs transition-all hover:bg-gray-100 active:scale-95 text-gray-800 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}

              <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3 sm:gap-4 py-1 px-0.5">
                  {images.map((img, idx) => {
                    const isActive = idx === selectedIndex
                    return (
                      <button
                        key={img.id || idx}
                        type="button"
                        onClick={() => {
                          setSelectedIndex(idx)
                          emblaApi?.scrollTo(idx)
                        }}
                        className={cn(
                          'relative h-16 w-16 sm:h-[76px] sm:w-[76px] shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-200 focus:outline-none touch-manipulation cursor-pointer',
                          isActive
                            ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-xs scale-[1.03]'
                            : 'border-gray-200/90 opacity-70 hover:border-gray-400 hover:opacity-100'
                        )}
                      >
                        <LoadingImage
                          src={img.url}
                          alt={`${title} thumbnail ${idx + 1}`}
                          sizes="90px"
                          className="h-full w-full object-contain object-center rounded-xl"
                          loading="lazy"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {canScrollNext && (
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next thumbnails"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-xs transition-all hover:bg-gray-100 active:scale-95 text-gray-800 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 3. Fullscreen Zoom Dialog Modal ───────────────────── */}
      <GalleryDialog
        activeImg={dialogIndex}
        onChange={setDialogIndex}
        images={images}
        title={title}
      />
    </div>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}
