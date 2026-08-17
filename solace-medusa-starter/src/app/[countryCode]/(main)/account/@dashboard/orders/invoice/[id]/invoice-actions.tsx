'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function InvoiceActions() {
  const router = useRouter()

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-200/80 dark:border-neutral-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-lg shadow-xs transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.475-1.12-1.077L6.34 18m11.318 0a3.11 3.11 0 0 0 .182-1.036V10.5c0-1.423-1.122-2.583-2.522-2.617a41.832 41.832 0 0 0-6.97 0c-1.4.034-2.522 1.594-2.522 3.017v6.464c0 .356.066.7.187 1.018m11.319 0H6.34"
          />
        </svg>
        Print / Save as PDF
      </button>
    </div>
  )
}
