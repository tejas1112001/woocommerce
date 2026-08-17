'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import useEmblaCarousel from 'embla-carousel-react'

type ImageCarouselProps = {
  images: { id: string; url: string }[]
  openDialog: (index: number | null) => void
}

const ImageCarousel = ({ images, openDialog }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  // Track previous image count so we know when to reInit vs just scroll
  const prevImageCountRef = useRef(images.length)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
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

  // When the images array changes (variant selected → new thumbnail prepended),
  // scroll back to the first slide so the variant image is visible immediately.
  useEffect(() => {
    if (!emblaApi) return

    if (images.length !== prevImageCountRef.current) {
      // Slide count changed — reinitialise Embla so it rebuilds scroll geometry
      emblaApi.reInit()
      prevImageCountRef.current = images.length
    }

    // Always snap back to the first slide (variant thumbnail)
    emblaApi.scrollTo(0, true /* jump without animation */)
    setCurrentIndex(0)
  }, [emblaApi, images])

  const slideWidth = 100 / images.length
  const isOnlyOneImage = images.length === 1

  return (
    <>
      <div
        className="overflow-hidden medium:hidden"
        ref={isOnlyOneImage ? null : emblaRef}
      >
        <div className="flex">
          {images.map((image, index) => (
            <div
              className="relative aspect-[29/34] max-h-[400px] w-full shrink-0"
              key={image.id}
            >
              <Image
                onClick={() => openDialog(index)}
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                priority={index <= 2}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 992px) 780px"
              />
            </div>
          ))}
        </div>
      </div>

      {!isOnlyOneImage && (
        <div className="absolute bottom-3 left-3 right-3 h-1 bg-primary/30 medium:hidden">
          <div
            className="absolute h-full bg-primary transition-all duration-200 ease-out"
            style={{
              width: `${slideWidth}%`,
              left: `${currentIndex * slideWidth}%`,
            }}
          />
        </div>
      )}
    </>
  )
}

export default ImageCarousel
