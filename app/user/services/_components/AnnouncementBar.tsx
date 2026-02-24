import React from 'react'
import { PawPrint } from 'lucide-react'
export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#dcfce7] py-2 px-4 text-center border-b border-[#bbf7d0]">
      <p className="text-xs md:text-sm font-medium text-[#14532d] flex items-center justify-center gap-2">
        <PawPrint className="w-3 h-3 md:w-4 md:h-4" />
        <span>
          Free cancellation on selected bookings · Verified pet care providers
          only
        </span>
      </p>
    </div>
  )
}
