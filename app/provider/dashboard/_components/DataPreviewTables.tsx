"use client";

interface Service {
  _id?: string;
  title: string;
  category?: string;
  catergory?: string;
  price: number;
  duration_minutes: number;
}

interface InventoryItem {
  _id?: string;
  product_name: string;
  category?: string;
  price?: number;
  quantity?: number;
}

interface Booking {
  _id?: string;
  service?: { title: string };
  startTime: string;
  status: string;
}

interface DataPreviewTablesProps {
  serviceList: Service[];
  inventoryList: InventoryItem[];
  bookingList: Booking[];
  isShop: boolean;
  isVet: boolean;
}

export function ServicesTable({ services }: { services: Service[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {services.slice(0, 5).map((s, idx) => (
            <tr key={s._id ?? `service-${idx}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.title}</td>
              <td className="px-6 py-4 text-sm text-gray-500 capitalize">{s.category || s.catergory || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-500">${s.price}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{s.duration_minutes} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InventoryTable({ inventory }: { inventory: InventoryItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {inventory.slice(0, 5).map((item, idx) => (
            <tr key={item._id ?? `inventory-${idx}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.category || "-"}</td>
              <td className="px-6 py-4 text-sm text-gray-500">${item.price || 0}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.quantity || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BookingsTable({ bookings, isVet }: { bookings: Booking[]; isVet: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.slice(0, 5).map((booking, idx) => (
            <tr key={booking._id ?? `booking-${idx}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">#{(booking._id || "").slice(-6)}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{booking.service?.title || "Service"}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.startTime).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-500 capitalize">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataPreviewTables({ serviceList, inventoryList, bookingList, isShop, isVet }: DataPreviewTablesProps) {
  return (
    <>
      {!isShop && serviceList.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Services</h2>
          <ServicesTable services={serviceList} />
        </div>
      )}

      {isShop && inventoryList.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Products</h2>
          <InventoryTable inventory={inventoryList} />
        </div>
      )}

      {!isShop && bookingList.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isVet ? "Upcoming Vet Bookings" : "Recent Bookings"}
          </h2>
          <BookingsTable bookings={bookingList} isVet={isVet} />
        </div>
      )}
    </>
  );
}
