import React, { useState } from 'react'
import { ServiceCard } from './ServiceCard'
import { List, Map, SlidersHorizontal, ChevronDown } from 'lucide-react'
const SERVICES = [
  {
    id: 1,
    title: 'Nail Trimming',
    description:
      'Safe and gentle nail trimming for dogs and cats. We use professional grade grinders and clippers.',
    duration: '20 min',
    price: 17,
    category: 'GROOMING',
  },
  {
    id: 2,
    title: 'General Health Checkup',
    description:
      'Comprehensive physical examination and health assessment by a certified veterinarian.',
    duration: '30 min',
    price: 60,
    category: 'VET CARE',
  },
  {
    id: 3,
    title: 'Dental Cleaning',
    description:
      'Professional teeth cleaning under sedation with full oral examination and polishing.',
    duration: '120 min',
    price: 244,
    category: 'VET CARE',
  },
  {
    id: 4,
    title: 'Bath & Brush',
    description:
      'Thorough bath with premium shampoo and full coat brushing. Includes ear cleaning.',
    duration: '45 min',
    price: 44,
    category: 'GROOMING',
  },
  {
    id: 5,
    title: 'Vaccination Package',
    description:
      'Core vaccinations including rabies, distemper, and parvovirus. Certificate included.',
    duration: '30 min',
    price: 142,
    category: 'VET CARE',
  },
  {
    id: 6,
    title: 'Ear Cleaning',
    description:
      'Gentle ear cleaning and inspection for infections. Medicated flush if needed.',
    duration: '15 min',
    price: 25,
    category: 'GROOMING',
  },
]
export function ServiceGrid() {
  const [activeTab, setActiveTab] = useState('All Services')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const tabs = ['All Services', 'Vet Visits', 'Grooming', 'Boarding']
  return (
    <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#1c1917] mb-2">
            Shop by need
          </h2>
          <p className="text-[#78716c]">
            Choose a care type to narrow down options quickly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-[#f59e0b] text-white shadow-md' : 'bg-white border border-[#e7e5e4] text-[#78716c] hover:border-[#f59e0b] hover:text-[#f59e0b]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-2 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white text-[#1c1917] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]'}`}
          >
            <Map className="w-4 h-4" />
            Map View
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
          <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-[#e7e5e4] rounded-lg text-sm text-[#1c1917] hover:border-stone-300 w-full sm:w-auto">
            <span>Newest First</span>
            <ChevronDown className="w-4 h-4 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            duration={service.duration}
            price={service.price}
            category={service.category}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="px-6 py-3 bg-white border border-[#e7e5e4] text-[#1c1917] font-medium rounded-full hover:bg-stone-50 transition-colors shadow-sm">
          Load More Services
        </button>
      </div>
    </section>
  )
}