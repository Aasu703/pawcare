import React, { useState } from 'react'
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react'
export function SearchBar() {
  const [activeType, setActiveType] = useState('All')
  const types = ['All', 'Vet', 'Grooming', 'Boarding']
  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-20 -mt-10 mb-8">
      <div className="bg-white rounded-3xl shadow-xl border border-[#e7e5e4] p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
            <span className="text-sm font-semibold text-[#1c1917] uppercase tracking-wide">
              Curated for pet parents
            </span>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-full">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeType === type ? 'bg-[#f59e0b] text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Location */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="City or zip code"
                className="w-full h-12 pl-4 pr-4 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] transition-all"
              />
            </div>
          </div>

          {/* Service Type */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
              Service Type
            </label>
            <div className="relative">
              <select className="w-full h-12 pl-4 pr-8 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] cursor-pointer text-[#1c1917]">
                <option>All Services</option>
                <option>Checkup</option>
                <option>Grooming</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Dates */}
          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Check-in
              </label>
              <input
                type="text"
                placeholder="mm/dd"
                className="w-full h-12 px-3 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Check-out
              </label>
              <input
                type="text"
                placeholder="mm/dd"
                className="w-full h-12 px-3 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
              />
            </div>
          </div>

          {/* Pet Type */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
              Pet Type
            </label>
            <div className="relative">
              <select className="w-full h-12 pl-4 pr-8 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] cursor-pointer text-[#1c1917]">
                <option>All Pets</option>
                <option>Dog</option>
                <option>Cat</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-start">
          <button className="flex items-center gap-2 text-xs font-semibold text-[#f59e0b] hover:text-[#d97706] transition-colors group">
            <SlidersHorizontal className="w-3 h-3" />
            Advanced Filters
            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
