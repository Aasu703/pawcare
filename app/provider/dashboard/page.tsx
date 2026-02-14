"use client";

import { useState, useEffect } from "react";
import { getProviderServices } from "@/lib/api/provider/provider";
import { Service } from "@/lib/types/service";
import { Wrench, Package, MessageSquare, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getProviderServices();
    if (res.success && res.data) setServices(res.data);
    setLoading(false);
  };

  const serviceList = Array.isArray(services) ? services : [];
  const totalRevenue = serviceList.reduce((sum, s) => sum + (s.price || 0), 0);

  const stats = [
    { label: "Total Services", value: serviceList.length, icon: Wrench, color: "bg-blue-500" },
    { label: "Total Revenue Potential", value: `$${totalRevenue}`, icon: DollarSign, color: "bg-green-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your services and business</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0f4f57] border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/provider/services" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <Wrench className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Manage Services</p>
              <p className="text-sm text-gray-500 mt-1">Add or edit your services</p>
            </Link>
            <Link href="/provider/inventory" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <Package className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
              <p className="font-semibold text-gray-900">View Inventory</p>
              <p className="text-sm text-gray-500 mt-1">Manage your stock items</p>
            </Link>
            <Link href="/provider/feedback" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <MessageSquare className="h-8 w-8 text-[#0f4f57] mx-auto mb-3" />
              <p className="font-semibold text-gray-900">View Feedback</p>
              <p className="text-sm text-gray-500 mt-1">See customer feedback</p>
            </Link>
          </div>

          {/* Recent Services */}
          {serviceList.length > 0 && (
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
                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">{s.catergory || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">${s.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{s.duration_minutes} min</td>
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
