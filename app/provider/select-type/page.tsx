"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { setProviderType } from "@/lib/api/provider/provider";
import { Stethoscope, Scissors, ShoppingBag, MoreHorizontal, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const providerTypes = [
  {
    id: "vet",
    title: "Veterinarian",
    description: "Provide veterinary services including consultations, vaccinations, and medical treatments",
    icon: Stethoscope,
    color: "bg-green-500",
  },
  {
    id: "groomer",
    title: "Pet Groomer",
    description: "Offer grooming services like bathing, trimming, nail care, and styling",
    icon: Scissors,
    color: "bg-purple-500",
  },
  {
    id: "shop_owner",
    title: "Pet Shop Owner",
    description: "Sell pet supplies, food, toys, and accessories",
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  {
    id: "other",
    title: "Other Services",
    description: "Pet sitting, training, boarding, or other pet-related services",
    icon: MoreHorizontal,
    color: "bg-orange-500",
  },
];

export default function SelectProviderType() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      const res = await setProviderType({ type: selectedType });
      if (res.success) {
        toast.success("Provider type set successfully!");
        router.push("/provider/dashboard");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to set provider type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Provider Type
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the type of pet services you provide. This will help us customize your experience and connect you with the right customers.
          </p>
        </div>

        {/* Provider Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {providerTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-primary rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`${type.color} p-4 rounded-2xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedType || loading}
            className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              selectedType && !loading
                ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting up your profile...
              </div>
            ) : (
              "Continue to Dashboard"
            )}
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/provider/dashboard")}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}