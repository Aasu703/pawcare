"use client";

interface BookingFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const filters = ["all", "pending", "confirmed", "completed", "cancelled"];

export function BookingFilters({ filter, onFilterChange }: BookingFiltersProps) {
  return (
    <div className="flex gap-2 mb-6">
      {filters.map((s) => (
        <button
          key={s}
          onClick={() => onFilterChange(s)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
            filter === s ? "bg-[#0f4f57] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
