"use client";

import { useState, useEffect } from "react";
import { getAllBookings, updateBooking, deleteBooking } from "@/lib/api/admin/booking";
import { Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings(1, 100);
      setBookings(res.data?.bookings || res.data || res.bookings || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleStatusChange = async (id: any, status: any) => {
    try {
      await updateBooking(id, { status });
      toast.success("Booking status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (data: any) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBooking(id);
      toast.success("Booking deleted");
      load();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all bookings</p>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Booking Details</h2>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Service:</span> {typeof selected.serviceId === "object" ? (selected.serviceId as any).title : selected.serviceId}</p>
              <p><span className="font-medium">User:</span> {typeof selected.userId === "object" ? (selected.userId as any).Firstname : selected.userId}</p>
              <p><span className="font-medium">Pet:</span> {typeof selected.petId === "object" ? (selected.petId as any).name : selected.petId}</p>
              <p><span className="font-medium">Start:</span> {new Date(selected.startTime).toLocaleString()}</p>
              <p><span className="font-medium">End:</span> {new Date(selected.endTime).toLocaleString()}</p>
              <p><span className="font-medium">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[selected.status] || ""}`}>{selected.status}</span></p>
              {selected.notes && <p><span className="font-medium">Notes:</span> {selected.notes}</p>}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No bookings found</td></tr>
              ) : bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{typeof b.serviceId === "object" ? (b.serviceId as any).title : b.serviceId}</td>
                  <td className="px-6 py-4 text-sm">{typeof b.userId === "object" ? (b.userId as any).Firstname : b.userId}</td>
                  <td className="px-6 py-4 text-sm">{new Date(b.startTime).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[b.status] || "bg-gray-100"}`}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setSelected(b)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(b._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

