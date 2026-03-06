"use client";

import { Clock, Trash2 } from "lucide-react";

interface Booking {
  _id?: string;
  status: string;
  price?: number;
  startTime: string;
  endTime: string;
  provider?: { businessName?: string };
  providerId?: string;
  notes?: string;
}

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const bookingId = booking._id;

  return (
    <div
      className="bg-white rounded-xl border border-border p-6 flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[booking.status] || "bg-muted text-muted-foreground"}`}>
            {booking.status}
          </span>
          {booking.price && (
            <span className="text-sm font-semibold text-foreground">${booking.price}</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
          </span>
        </div>
        {(booking.provider?.businessName || booking.providerId) && (
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">Provider:</span>{" "}
            {booking.provider?.businessName || booking.providerId}
          </p>
        )}
        {booking.notes && (
          <p className="text-sm text-muted-foreground mt-2">{booking.notes}</p>
        )}
      </div>

      {(booking.status === "pending" || booking.status === "confirmed") && bookingId && (
        <button
          onClick={() => onCancel(bookingId)}
          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Cancel booking"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
