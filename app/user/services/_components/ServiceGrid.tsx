import React, { useEffect, useMemo, useState } from 'react'
import { ServiceCard } from './ServiceCard'
import { List, Map, ChevronDown } from 'lucide-react'
import ProviderNearbyShopsMap from '@/components/ProviderNearbyShopsMap'
import { getAllServices } from '@/lib/api/public/service'
import type { ServiceSearchFilters } from './SearchBar'

const PAGE_SIZE = 6

type ServiceItem = {
  _id: string
  title?: string
  description?: string
  duration_minutes?: number
  price?: number
  category?: string
  catergory?: string
  createdAt?: string
  provider?: {
    address?: string
    location?: string | { address?: string }
  }
  location?: string
  petType?: string
}

const normalizeCategory = (value?: string) => value?.toLowerCase().replace(/\s+/g, '-') ?? ''
const toLowerText = (value: unknown): string => (typeof value === 'string' ? value.toLowerCase() : '')
type SortType = 'newest' | 'price-low' | 'price-high'

const DEFAULT_FILTERS: ServiceSearchFilters = {
  location: '',
  serviceType: 'all',
  petType: 'all',
  dateFrom: '',
  dateTo: '',
}

type ServiceGridProps = {
  filters?: ServiceSearchFilters
}

export function ServiceGrid({ filters = DEFAULT_FILTERS }: ServiceGridProps) {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('All Services')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [sortBy, setSortBy] = useState<SortType>('newest')
  const tabs = ['All Services', 'Vet Visits', 'Grooming', 'Boarding']
  const activeServiceType = filters.serviceType !== 'all' ? filters.serviceType : activeTab === 'Grooming' ? 'grooming' : activeTab === 'Boarding' ? 'boarding' : activeTab === 'Vet Visits' ? 'vet' : 'all'
  const mapMode: 'pet-shop' | 'vet-hospital' = activeServiceType === 'grooming' || activeServiceType === 'boarding' ? 'pet-shop' : 'vet-hospital'

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      setError(null)
      const response = await getAllServices()

      if (!response.success || !response.data) {
        setServices([])
        setError(response.message || 'Failed to load services')
        setLoading(false)
        return
      }

      setServices(response.data)
      setLoading(false)
    }

    loadServices()
  }, [])

  const filteredServices = useMemo(() => {
    let result = [...services]
    if (activeTab !== 'All Services') {
      result = result.filter((service) => {
        const category = normalizeCategory(service.category || service.catergory)
        if (activeTab === 'Vet Visits') return category.includes('vet')
        if (activeTab === 'Grooming') return category.includes('groom')
        if (activeTab === 'Boarding') return category.includes('board')
        return true
      })
    }

    if (filters.serviceType !== 'all') {
      result = result.filter((service) =>
        normalizeCategory(service.category || service.catergory).includes(filters.serviceType),
      )
    }

    if (filters.location.trim()) {
      const query = filters.location.toLowerCase()
      result = result.filter((service) => {
        const providerLocation = toLowerText(service.provider?.location)
        const providerLocationAddress =
          typeof service.provider?.location === 'object'
            ? toLowerText(service.provider.location?.address)
            : ''
        const providerAddress = toLowerText(service.provider?.address)
        const serviceLocation = toLowerText(service.location)
        return (
          providerLocation.includes(query) ||
          providerLocationAddress.includes(query) ||
          providerAddress.includes(query) ||
          serviceLocation.includes(query)
        )
      })
    }

    if (filters.petType !== 'all') {
      result = result.filter((service) => {
        const petType = toLowerText(service.petType)
        return !petType || petType === filters.petType
      })
    }

    return result.sort((a, b) => {
      if (sortBy === 'price-low') return (a.price ?? 0) - (b.price ?? 0)
      if (sortBy === 'price-high') return (b.price ?? 0) - (a.price ?? 0)
      return (
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
    })
  }, [activeTab, filters.location, filters.petType, filters.serviceType, services, sortBy])

  const visibleServices = filteredServices.slice(0, visibleCount)
  const hasMore = visibleCount < filteredServices.length

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="mb-2 text-2xl font-serif font-bold text-[#1c1917] md:text-3xl">
            Shop by need
          </h2>
          <p className="text-[#78716c]">
            Choose a care type to narrow down options quickly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-[#f59e0b] text-white shadow-md' : 'bg-white border border-[#e7e5e4] text-[#78716c] hover:border-[#f59e0b] hover:text-[#f59e0b]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#e7e5e4] bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full overflow-x-auto rounded-lg bg-stone-100 p-1 sm:w-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            <Map className="w-4 h-4" />
            Map View
          </button>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="h-10 w-full appearance-none rounded-lg border border-[#e7e5e4] bg-white pl-3 pr-9 text-sm text-[#1c1917] hover:border-stone-300 focus:outline-none sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white p-3 shadow-sm md:p-4">
          <ProviderNearbyShopsMap mode={mapMode} />
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f59e0b] border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : visibleServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e7e5e4] bg-white px-5 py-10 text-center text-sm text-[#78716c]">
              No services found for this category.
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleServices.map((service) => (
                  <ServiceCard
                    key={service._id}
                    serviceId={service._id}
                    title={service.title || 'Untitled Service'}
                    description={service.description || 'No description available.'}
                    duration={`${service.duration_minutes ?? 0} min`}
                    price={service.price ?? 0}
                    category={(service.category || service.catergory || 'GENERAL').toUpperCase()}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-full border border-[#e7e5e4] bg-white px-6 py-3 font-medium text-[#1c1917] shadow-sm transition-colors hover:bg-stone-50"
                  >
                    Load More Services
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
