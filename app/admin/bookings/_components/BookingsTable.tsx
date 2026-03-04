"use client";

import { Trash2, Eye } from "lucide-react";

interface Booking {
  _id: string;
  serviceId: any;
  userId: any;
  petId: any;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingsTable({ bookings, onView, onDelete, onStatusChange }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
          No bookings found
        </td>
      </tr>
    );
  }

  return (
    <>
      {bookings.map((b) => (
        <tr key={b._id} className="hover:bg-muted">
          <td className="px-6 py-4 text-sm">
            {typeof b.serviceId === "object" ? b.serviceId?.title : b.serviceId}
          </td>
          <td className="px-6 py-4 text-sm">
            {typeof b.userId === "object" ? b.userId?.Firstname : b.userId}
          </td>
          <td className="px-6 py-4 text-sm">
            {new Date(b.startTime).toLocaleDateString()}
          </td>
          <td className="px-6 py-4">
            <select
              value={b.status}
              onChange={(e) => onStatusChange(b._id, e.target.value)}
              className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[b.status] || "bg-muted"}`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex gap-1 justify-end">
              <button
                onClick={() => onView(b)}
                className="p-2 text-muted-foreground hover:text-[var(--pc-teal)] hover:bg-[var(--pc-teal-light)] rounded-lg"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(b._id)}
                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
