'use client'

import { useEffect, useRef } from 'react'

/**
 * NavScrollWrapper
 *
 * A thin client component that wraps the server-rendered nav and applies
 * a scroll-shadow class when the user scrolls past the top of the page.
 * Keeping this as a separate client component avoids making the entire
 * nav (and its data-fetching) a client component.
 */
export default function NavScrollWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return
      const nav = wrapperRef.current.querySelector('nav')
      if (!nav) return

      if (window.scrollY > 4) {
        nav.classList.add('header-shadow')
      } else {
        nav.classList.remove('header-shadow')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={wrapperRef} className="sticky top-0 z-50">
      {children}
    </div>
  )
}
