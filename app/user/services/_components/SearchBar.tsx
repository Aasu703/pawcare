import React, { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react'

export type ServiceSearchFilters = {
  location: string
  serviceType: 'all' | 'vet' | 'grooming' | 'boarding'
  petType: 'all' | 'dog' | 'cat' | 'other'
  dateFrom: string
  dateTo: string
}

const DEFAULT_FILTERS: ServiceSearchFilters = {
  location: '',
  serviceType: 'all',
  petType: 'all',
  dateFrom: '',
  dateTo: '',
}

type SearchBarProps = {
  onSearch?: (filters: ServiceSearchFilters) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<ServiceSearchFilters>(DEFAULT_FILTERS)
  const types: Array<{ label: string; value: ServiceSearchFilters['serviceType'] }> = [
    { label: 'All', value: 'all' },
    { label: 'Vet', value: 'vet' },
    { label: 'Grooming', value: 'grooming' },
    { label: 'Boarding', value: 'boarding' },
  ]

  useEffect(() => {
    onSearch?.(filters)
  }, [filters, onSearch])

  const applySearch = () => {
    onSearch?.(filters)
  }

  return (
    <div className="relative z-20 mx-auto mb-8 w-full max-w-6xl px-4 -mt-6 md:-mt-10">
      <div className="bg-white rounded-3xl shadow-xl border border-[#e7e5e4] p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
            <span className="text-sm font-semibold text-[#1c1917] uppercase tracking-wide">
              Curated for pet parents
            </span>
          </div>

          <div className="flex max-w-full overflow-x-auto rounded-full bg-stone-100 p-1">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, serviceType: type.value }))
                }
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filters.serviceType === type.value ? 'bg-[#f59e0b] text-white shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
              >
                {type.label}
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
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
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
              <select
                value={filters.serviceType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    serviceType: e.target.value as ServiceSearchFilters['serviceType'],
                  }))
                }
                className="w-full h-12 pl-4 pr-8 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] cursor-pointer text-[#1c1917]"
              >
                <option value="all">All Services</option>
                <option value="vet">Vet</option>
                <option value="grooming">Grooming</option>
                <option value="boarding">Boarding</option>
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
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
                className="w-full h-12 px-3 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#78716c] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Check-out
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
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
              <select
                value={filters.petType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    petType: e.target.value as ServiceSearchFilters['petType'],
                  }))
                }
                className="w-full h-12 pl-4 pr-8 bg-stone-50 border border-[#e7e5e4] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] cursor-pointer text-[#1c1917]"
              >
                <option value="all">All Pets</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={applySearch}
              className="w-full h-12 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
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
