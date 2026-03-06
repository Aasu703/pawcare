'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <p className="text-muted-foreground">Something went wrong loading this page.</p>
      <button
        onClick={reset}
        className="bg-[var(--pc-primary)] text-white rounded-[12px] px-4 py-2 text-sm font-semibold"
      >
        Try again
      </button>
    </div>
  )
}
