import React from 'react'
import { Clock, DollarSign, Star, ArrowRight, PawPrint } from 'lucide-react'
interface ServiceCardProps {
  title: string
  description: string
  duration: string
  price: number
  category?: string
}
export function ServiceCard({
  title,
  description,
  duration,
  price,
  category = 'GENERAL',
}: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full">
      {/* Image Area */}
      <div className="h-40 bg-stone-100 relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-stone-200 shadow-sm z-10">
          <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
            {category}
          </span>
        </div>
        <PawPrint className="w-12 h-12 text-stone-300 opacity-50 group-hover:scale-110 transition-transform duration-500" />

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-semibold text-[#1c1917] group-hover:text-[#1a3a2a] transition-colors">
            {title}
          </h3>
        </div>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 text-stone-300 fill-stone-100" />
            ))}
          </div>
          <span className="text-xs text-[#78716c] ml-1">No rating yet</span>
        </div>

        <p className="text-sm text-[#78716c] line-clamp-2 mb-4 flex-grow">
          {description}
        </p>

        {/* Meta Tags */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-xs font-medium text-stone-600">
              {duration}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
            <DollarSign className="w-3.5 h-3.5 text-[#1a3a2a]" />
            <span className="text-xs font-medium text-stone-600">${price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-stone-100">
          <button className="flex-1 py-2 px-4 rounded-full border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors">
            View Details
          </button>
          <button className="flex-1 py-2 px-4 rounded-full bg-[#f59e0b] text-white text-sm font-medium hover:bg-[#d97706] transition-colors shadow-sm hover:shadow flex items-center justify-center gap-1 group/btn">
            Book Now
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
