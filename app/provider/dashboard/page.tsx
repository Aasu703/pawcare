"use client";

import { useState, useEffect } from "react";
import { getProviderServices, getInventoryByProvider } from "@/lib/api/provider/provider";
import { getProviderBookings } from "@/lib/api/provider/booking";
import { addAppNotification, createUpcomingAppointmentNotifications } from "@/lib/notifications/app-notifications";
import AppNotificationBell from "@/components/AppNotificationBell";
import { Wrench, Package, MessageSquare, DollarSign, CalendarCheck, HeartPulse, AlertTriangle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  canAccessVetFeatures,
  canManageBookings,
  canManageInventory,
  canManageServices,
  getProviderTypeLabel,
  isShopProvider,
} from "@/lib/provider-access";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const providerType = user?.providerType;
    const providerId = user?._id || user?.id;

    if (canManageServices(providerType)) {
      const servicesRes = await getProviderServices();
      if (servicesRes.success && servicesRes.data) setServices(servicesRes.data);
    } else {
      setServices([]);
    }

    if (canManageBookings(providerType)) {
      const bookingsRes = await getProviderBookings();
      if (bookingsRes.success && bookingsRes.data?.bookings) {
        const nextBookings = Array.isArray(bookingsRes.data.bookings)
          ? bookingsRes.data.bookings
          : [];
        setBookings(nextBookings);

        for (const booking of nextBookings) {
          if (booking?.status === "pending") {
            addAppNotification({
              audience: "provider",
              providerType: providerType ?? undefined,
              type: "booking",
              title: "New booking request",
              message: `${booking.service?.title || "Service booking"} is awaiting your confirmation.`,
              link: "/provider/bookings",
              dedupeKey: `dashboard-pending-booking:${booking._id || booking.id}`,
            });
          }
        }

        createUpcomingAppointmentNotifications(nextBookings, {
          audience: "provider",
          providerType: providerType ?? undefined,
          statuses: ["confirmed"],
          link: canAccessVetFeatures(providerType)
            ? "/provider/vet-appointments"
            : "/provider/bookings",
        });
      } else {
        setBookings([]);
      }
    } else {
      setBookings([]);
    }

    if (canManageInventory(providerType) && providerId) {
      const inventoryRes = await getInventoryByProvider(providerId);
      if (inventoryRes.success && inventoryRes.data) {
        const nextInventory = Array.isArray(inventoryRes.data)
          ? inventoryRes.data
          : [];
        setInventory(nextInventory);

        for (const item of nextInventory) {
          const quantity = Number(item?.quantity || 0);
          if (quantity <= 5) {
            addAppNotification({
              audience: "provider",
              providerType: "shop",
              type: "order",
              title: quantity === 0 ? "Out of stock item" : "Low stock alert",
              message: `${item?.product_name || "Product"} has ${
                quantity === 0 ? "no remaining stock" : `${quantity} units left`
              }.`,
              link: "/provider/inventory",
              dedupeKey: `dashboard-stock-alert:${item?._id || item?.id}:${quantity}`,
            });
          }
        }
      } else {
        setInventory([]);
      }
    } else {
      setInventory([]);
    }

    setLoading(false);
  }

  useEffect(() => { loadData(); }, [user?._id, user?.id, user?.providerType]);

  const serviceList = Array.isArray(services) ? services : [];
  const bookingList = Array.isArray(bookings) ? bookings : [];
  const inventoryList = Array.isArray(inventory) ? inventory : [];
  const providerType = user?.providerType;
  const isVet = canAccessVetFeatures(providerType);
  const isShop = isShopProvider(providerType);

  const totalServiceRevenue = serviceList.reduce((sum, s) => sum + (s.price || 0), 0);
  const pendingBookings = bookingList.filter((b) => b.status === "pending").length;
  const completedBookings = bookingList.filter((b) => b.status === "completed").length;
  const lowStockCount = inventoryList.filter((i) => (i.quantity || 0) < 5).length;
  const inventoryValue = inventoryList.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 0)), 0);

  const stats = isShop
    ? [
        { label: "Products", value: inventoryList.length, icon: Package, color: "bg-blue-500" },
        { label: "Low Stock Alerts", value: lowStockCount, icon: AlertTriangle, color: "bg-amber-500" },
        { label: "Inventory Value", value: `$${inventoryValue.toFixed(2)}`, icon: DollarSign, color: "bg-green-500" },
      ]
    : [
        { label: "Total Services", value: serviceList.length, icon: Wrench, color: "bg-blue-500" },
        { label: "Pending Bookings", value: pendingBookings, icon: CalendarCheck, color: "bg-amber-500" },
        { label: "Completed Bookings", value: completedBookings, icon: ClipboardList, color: "bg-green-500" },
        { label: "Revenue Potential", value: `$${totalServiceRevenue}`, icon: DollarSign, color: "bg-emerald-600" },
      ];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getProviderTypeLabel(providerType)} Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {isShop
              ? "Manage your shop products and stock visibility"
              : isVet
              ? "Manage vet services, bookings, and appointments"
              : "Manage grooming services and customer bookings"}
          </p>
        </div>
        <AppNotificationBell
          audience="provider"
          providerType={providerType ?? undefined}
          buttonClassName="h-10 w-10 bg-white text-[#0f4f57] border border-gray-200 hover:bg-gray-50"
          panelClassName="right-0"
        />
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-1 ${isShop ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"} gap-6 mb-10`}>
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
                <div className={`${s.color} p-3 rounded-lg`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className={`grid grid-cols-1 ${isShop ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4`}>
            {canManageServices(providerType) && (
              <Link href="/provider/services" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <Wrench className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Manage Services</p>
                <p className="text-sm text-gray-500 mt-1">Add or edit your services</p>
              </Link>
            )}
            {canManageBookings(providerType) && (
              <Link href="/provider/bookings" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <CalendarCheck className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Manage Bookings</p>
                <p className="text-sm text-gray-500 mt-1">Confirm and process requests</p>
              </Link>
            )}
            {isVet && (
              <Link href="/provider/vet-appointments" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <HeartPulse className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Vet Appointments</p>
                <p className="text-sm text-gray-500 mt-1">Create checkup reports for pets</p>
              </Link>
            )}
            {canManageBookings(providerType) && (
              <Link href="/provider/messages" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <MessageSquare className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Messages</p>
                <p className="text-sm text-gray-500 mt-1">Chat with pet owners</p>
              </Link>
            )}
            {canManageInventory(providerType) && (
              <Link href="/provider/inventory" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
                <Package className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Manage Shop Products</p>
                <p className="text-sm text-gray-500 mt-1">Add products visible to users</p>
              </Link>
            )}
            <Link href="/provider/feedback" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <MessageSquare className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
              <p className="font-semibold text-gray-900">View Feedback</p>
              <p className="text-sm text-gray-500 mt-1">See customer feedback</p>
            </Link>
          </div>

          {/* Data Preview */}
          {!isShop && serviceList.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Services</h2>
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
                    {serviceList.slice(0, 5).map((s, idx) => (
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
            </div>
          )}

          {isShop && inventoryList.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Products</h2>
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
                    {inventoryList.slice(0, 5).map((item, idx) => (
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
            </div>
          )}

          {!isShop && bookingList.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isVet ? "Upcoming Vet Bookings" : "Recent Bookings"}
              </h2>
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
                    {bookingList.slice(0, 5).map((booking, idx) => (
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

