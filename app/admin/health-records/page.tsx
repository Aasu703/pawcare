"use client";

import { useState, useEffect } from "react";
import { getAllHealthRecords, deleteHealthRecord } from "@/lib/api/admin/health-record";
import { HealthRecord } from "@/lib/types/health-record";
import { Trash2, Eye, X } from "lucide-react";
import { toast } from "sonner";

const recordTypeColors: Record<string, string> = {
  vaccination: "bg-green-100 text-green-700",
  checkup: "bg-blue-100 text-blue-700",
  surgery: "bg-red-100 text-red-700",
  medication: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-700",
};

export default function AdminHealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HealthRecord | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllHealthRecords(1, 100);
      setRecords(res.data || res.healthRecords || []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this health record?")) return;
    try {
      await deleteHealthRecord(id);
      toast.success("Health record deleted");
      setSelected(null);
      load();
    } catch {
      toast.error("Failed to delete record");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Health Records Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all pet health records</p>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Health Record Details</h2>
              <button onClick={() => setSelected(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Pet:</span> {typeof selected.petId === "object" ? (selected.petId as any).name : selected.petId}</p>
              <p><span className="font-medium">Type:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${recordTypeColors[selected.recordType] || ""}`}>{selected.recordType}</span></p>
              <p><span className="font-medium">Date:</span> {new Date(selected.date).toLocaleDateString()}</p>
              {selected.nextDueDate && <p><span className="font-medium">Next Due:</span> {new Date(selected.nextDueDate).toLocaleDateString()}</p>}
              {selected.description && <p><span className="font-medium">Description:</span> {selected.description}</p>}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No health records found</td></tr>
              ) : records.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{typeof r.petId === "object" ? (r.petId as any).name : r.petId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${recordTypeColors[r.recordType] || "bg-gray-100"}`}>{r.recordType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{r.title || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setSelected(r)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(r._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
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
