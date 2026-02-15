"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserPetById } from "@/lib/api/user/pet";
import { getHealthRecordsByPet, createHealthRecord, updateHealthRecord, deleteHealthRecord } from "@/lib/api/user/health-record";
import { ArrowLeft, Plus, FileText, Calendar, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function PetHealthPage() {
  const params = useParams();
  const petId = params.id as string;
  const router = useRouter();

  const [pet, setPet] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    recordType: "",
    title: "",
    description: "",
    date: "",
    nextDueDate: "",
  });

  useEffect(() => { loadData(); }, [petId]);

  const loadData = async () => {
    setLoading(true);
    const [petRes, recordsRes] = await Promise.all([
      getUserPetById(petId),
      getHealthRecordsByPet(petId),
    ]);
    if (petRes.success && petRes.data) setPet(petRes.data);
    if (recordsRes.success && recordsRes.data) setRecords(recordsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res;
    if (editingId) {
      res = await updateHealthRecord(editingId, form);
    } else {
      res = await createHealthRecord({ ...form, petId });
    }
    if (res.success) {
      toast.success(editingId ? "Record updated!" : "Record created!");
      resetForm();
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  const handleEdit = (record: HealthRecord) => {
    setEditingId(record._id);
    setForm({
      recordType: record.recordType || "",
      title: record.title || "",
      description: record.description || "",
      date: record.date || "",
      nextDueDate: record.nextDueDate || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this health record?")) return;
    const res = await deleteHealthRecord(id);
    if (res.success) {
      toast.success("Record deleted");
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ recordType: "", title: "", description: "", date: "", nextDueDate: "" });
  };

  const recordTypeColors: Record<string, string> = {
    vaccination: "bg-green-100 text-green-700",
    checkup: "bg-blue-100 text-blue-700",
    surgery: "bg-red-100 text-red-700",
    medication: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/user/pet" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        Back to Pets
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {pet?.name}&apos;s Health Records
          </h1>
          <p className="text-gray-500 mt-1">Track vaccinations, checkups, and more</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#0f4f57] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0c4148] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Record
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editingId ? "Edit Record" : "Add Health Record"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                <select
                  value={form.recordType}
                  onChange={(e) => setForm({ ...form, recordType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="checkup">Checkup</option>
                  <option value="surgery">Surgery</option>
                  <option value="medication">Medication</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    value={form.nextDueDate}
                    onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4f57] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0f4f57] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c4148] transition-colors"
              >
                {editingId ? "Update Record" : "Add Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No health records yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your first record to start tracking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{record.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${recordTypeColors[record.recordType] || recordTypeColors.other}`}>
                      {record.recordType}
                    </span>
                  </div>
                  {record.description && (
                    <p className="text-gray-600 text-sm mb-3">{record.description}</p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {record.date}
                    </span>
                    {record.nextDueDate && (
                      <span className="flex items-center gap-1">
                        Next: {record.nextDueDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(record)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(record._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
