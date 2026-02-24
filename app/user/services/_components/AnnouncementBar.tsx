import React from 'react'
import { PawPrint } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <div className="w-full border-b border-[#bbf7d0] bg-[#dcfce7] px-4 py-2 text-center">
      <p className="flex items-center justify-center gap-2 text-xs font-medium text-[#14532d] md:text-sm">
        <PawPrint className="h-3 w-3 md:h-4 md:w-4" />
        <span>Free cancellation on selected bookings - Verified pet care providers only</span>
      </p>
    </div>
  )
}
