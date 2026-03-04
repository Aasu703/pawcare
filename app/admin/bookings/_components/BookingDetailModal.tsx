"use client";

import { X } from "lucide-react";

interface BookingDetailModalProps {
  selected: any;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingDetailModal({ selected, onClose }: BookingDetailModalProps) {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Booking Details</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <span className="font-medium">Service:</span>{" "}
            {typeof selected.serviceId === "object" ? selected.serviceId?.title : selected.serviceId}
          </p>
          <p>
            <span className="font-medium">User:</span>{" "}
            {typeof selected.userId === "object" ? selected.userId?.Firstname : selected.userId}
          </p>
          <p>
            <span className="font-medium">Pet:</span>{" "}
            {typeof selected.petId === "object" ? selected.petId?.name : selected.petId}
          </p>
          <p>
            <span className="font-medium">Start:</span>{" "}
            {new Date(selected.startTime).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">End:</span>{" "}
            {new Date(selected.endTime).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[selected.status] || ""}`}>
              {selected.status}
            </span>
          </p>
          {selected.notes && (
            <p>
              <span className="font-medium">Notes:</span> {selected.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
