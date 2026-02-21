"use client";

import { useRouter } from "next/navigation";
import { Clock3 } from "lucide-react";

export default function ProviderVerificationPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white border border-amber-100 rounded-3xl shadow-xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
          <Clock3 className="w-8 h-8 text-amber-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification In Progress</h1>
        <p className="text-gray-600 mb-8">
          Your provider details were submitted successfully and are waiting for admin approval.
          You can access the provider dashboard after your account is approved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/provider/select-type")}
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Edit Submission
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  );
}
